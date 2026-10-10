import { NextResponse } from "next/server";

const MAX_QUESTION_LENGTH = 1200;

export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "The EcoBingo nature guide is not configured yet. Add GEMINI_API_KEY in the deployment environment." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a valid JSON request." }, { status: 400 });
  }

  const question = typeof body === "object" && body !== null && "question" in body
    ? (body as { question?: unknown }).question
    : undefined;
  const mode = typeof body === "object" && body !== null && "mode" in body
    ? (body as { mode?: unknown }).mode
    : "chat";
  const generateMissions = mode === "missions";
  if (mode !== "chat" && mode !== "missions") {
    return NextResponse.json({ error: "Unsupported nature guide mode." }, { status: 400 });
  }

  if (typeof question !== "string" || !question.trim()) {
    return NextResponse.json({ error: "Add a question for the nature guide." }, { status: 400 });
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return NextResponse.json({ error: `Keep your question under ${MAX_QUESTION_LENGTH} characters.` }, { status: 413 });
  }

  try {
    const model = process.env.GEMMA_MODEL || "gemma-4-26b-a4b-it";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: [
              "You are EcoBingo's friendly, practical outdoor nature guide and Eco Coach.",
              generateMissions
                ? 'Return ONLY valid JSON, no markdown fences, in this exact shape: {"missions":[{"title":"short title","description":"one-sentence goal","action":"clear action taking 5-30 minutes"}]}. Generate exactly 3 varied, beginner-friendly, personalized outdoor or environmentally helpful missions based on the user request. Titles must be 3-7 words. Keep missions safe, free, realistic, and doable without special equipment. Do not include points or claim to know local conditions.'
                : "Help people notice nature, take screen breaks, and complete simple outdoor missions safely. Keep answers concise, encouraging, and actionable.",
              "Do not claim to know the user's location, weather, surroundings, or what is in a photo unless they provide that information.",
              "Never encourage touching unknown plants or wildlife, approaching dangerous animals, trespassing, or entering roads or unsafe areas.",
              "EcoBingo points are demo-only and have no cash value. Do not promise real rewards.",
            ].join(" ") }],
          },
          contents: [{ role: "user", parts: [{ text: question.trim() }] }],
          generationConfig: { temperature: generateMissions ? 0.5 : 0.7, maxOutputTokens: generateMissions ? 650 : 450 },
        }),
        signal: AbortSignal.timeout(25000),
      },
    );
    const payload = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      error?: { message?: string };
    };
    if (!response.ok) {
      console.error("Gemma API error", response.status, payload.error?.message || "Unknown provider error");
      return NextResponse.json({ error: "The nature guide is temporarily unavailable. Please try again." }, { status: 502 });
    }
    const resultText = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n");
    const answer = resultText?.trim();
    if (!answer) {
      return NextResponse.json({ error: "The nature guide returned an empty answer. Try again." }, { status: 502 });
    }
    if (generateMissions) {
      try {
        const jsonText = answer.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
        const parsed = JSON.parse(jsonText) as { missions?: unknown };
        if (!Array.isArray(parsed.missions) || parsed.missions.length !== 3) throw new Error("Invalid mission count");
        const missions = parsed.missions.map((item: unknown, index: number) => {
          if (!item || typeof item !== "object") throw new Error("Invalid mission");
          const mission = item as { title?: unknown; description?: unknown; action?: unknown };
          if ([mission.title, mission.description, mission.action].some((value) => typeof value !== "string" || !value.trim())) throw new Error("Incomplete mission");
          return {
            id: `ai-${Date.now()}-${index}`,
            title: (mission.title as string).trim().slice(0, 70),
            description: (mission.description as string).trim().slice(0, 220),
            action: (mission.action as string).trim().slice(0, 220),
          };
        });
        return NextResponse.json({ missions, model });
      } catch {
        console.error("Gemma returned invalid Eco Coach mission JSON");
        return NextResponse.json({ error: "The Eco Coach couldn't format its missions. Please generate them again." }, { status: 502 });
      }
    }
    return NextResponse.json({ answer, model });
  } catch (error) {
    console.error("EcoBingo Gemma guide request failed", error);
    return NextResponse.json({ error: "The nature guide is temporarily unavailable. Please try again." }, { status: 502 });
  }
}
