"use client";

import { useEffect, useState } from "react";

type Tab = "Home" | "Bingo" | "Rewards" | "Profile";
type Mission = { id: number; title: string; icon: string; points: number; tone: string };
type GuideMessage = { role: "user" | "assistant"; text: string };

const missions: Mission[] = [
  { id: 1, title: "Find a tree", icon: "♧", points: 20, tone: "mint" },
  { id: 2, title: "Walk for 10 min", icon: "↗", points: 30, tone: "peach" },
  { id: 3, title: "Look at clouds", icon: "☁", points: 20, tone: "blue" },
  { id: 4, title: "Spot a bird", icon: "⌁", points: 25, tone: "yellow" },
  { id: 5, title: "Screen-free moment", icon: "✳", points: 50, tone: "lime" },
  { id: 6, title: "Find a flower", icon: "❋", points: 25, tone: "pink" },
  { id: 7, title: "Feel the breeze", icon: "≋", points: 20, tone: "blue" },
  { id: 8, title: "Notice a leaf", icon: "❧", points: 20, tone: "mint" },
  { id: 9, title: "Find a sunny spot", icon: "☼", points: 25, tone: "peach" },
];

function Icon({ name }: { name: string }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  const shapes: Record<string, React.ReactNode> = {
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-6h6v6"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    gift: <><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8H7.5a2.5 2.5 0 1 1 2.5-2.5V8Zm0 0h4.5A2.5 2.5 0 1 0 14 5.5V8Z"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    leaf: <><path d="M20 4c-8 0-14 3-14 10a6 6 0 0 0 6 6c7 0 8-8 8-16Z"/><path d="M4 21c3-6 7-9 12-12"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4"/></>,
    moon: <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z"/></>,
    trophy: <><path d="M8 21h8m-4-4v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4v2a4 4 0 0 0 4 4m9-6h3v2a4 4 0 0 1-4 4"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  };
  return <svg {...common}>{shapes[name] ?? shapes.spark}</svg>;
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("Home");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [completed, setCompleted] = useState<number[]>([]);
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const [toast, setToast] = useState("");
  const [points, setPoints] = useState(240);
  const [loaded, setLoaded] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideQuestion, setGuideQuestion] = useState("");
  const [guideMessages, setGuideMessages] = useState<GuideMessage[]>([
    { role: "assistant", text: "Hey, Explorer! Ask me about nature, outdoor missions, or simple ways to help the planet." },
  ]);
  const [guideLoading, setGuideLoading] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem("ecobingo-theme");
      const savedProgress = window.localStorage.getItem("ecobingo-progress-v1");
      if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress) as {
          completed?: unknown;
          bonusClaimed?: unknown;
          points?: unknown;
        };
        if (Array.isArray(parsed.completed)) {
          setCompleted(parsed.completed.filter((id): id is number =>
            typeof id === "number" && missions.some((mission) => mission.id === id)
          ));
        }
        if (typeof parsed.bonusClaimed === "boolean") setBonusClaimed(parsed.bonusClaimed);
        if (typeof parsed.points === "number" && Number.isFinite(parsed.points)) {
          setPoints(Math.max(0, Math.floor(parsed.points)));
        }
      }
    } catch {
      // If saved browser data is invalid or unavailable, start with the demo defaults.
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem("ecobingo-theme", theme);
      window.localStorage.setItem("ecobingo-progress-v1", JSON.stringify({
        completed,
        bonusClaimed,
        points,
      }));
    } catch {
      // The app remains usable if the browser blocks local storage.
    }
  }, [theme, completed, bonusClaimed, points, loaded]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2100);
  }

  function toggleMission(id: number) {
    const mission = missions.find((m) => m.id === id);
    if (!mission) return;
    if (completed.includes(id)) {
      setCompleted((prev) => prev.filter((x) => x !== id));
      setPoints((p) => p - mission.points);
      notify("Mission unchecked");
    } else {
      setCompleted((prev) => [...prev, id]);
      setPoints((p) => p + mission.points);
      notify(`+${mission.points} points earned`);
    }
  }

  function claimBonus() {
    if (completed.length < 3) return notify("Complete 3 missions to unlock the bonus");
    if (bonusClaimed) return notify("You've already claimed today's bonus");
    setBonusClaimed(true);
    setPoints((p) => p + 100);
    notify("Bingo bonus claimed · +100 points");
  }

  async function sendGuideMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = guideQuestion.trim();
    if (!question || guideLoading) return;
    if (question.length > 1200) {
      setGuideMessages((prev) => [...prev, { role: "assistant", text: "Please keep your question under 1,200 characters." }]);
      return;
    }

    setGuideQuestion("");
    setGuideMessages((prev) => [...prev, { role: "user", text: question }]);
    setGuideLoading(true);

    try {
      const response = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json() as { answer?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "The nature guide is unavailable. Please try again.");
      setGuideMessages((prev) => [...prev, {
        role: "assistant",
        text: data.answer || "I couldn't find an answer. Please try again.",
      }]);
    } catch (error) {
      setGuideMessages((prev) => [...prev, {
        role: "assistant",
        text: error instanceof Error ? error.message : "Connection failed. Please try again.",
      }]);
    } finally {
      setGuideLoading(false);
    }
  }

  const nav: { name: Tab; icon: string }[] = [
    { name: "Home", icon: "home" }, { name: "Bingo", icon: "grid" },
    { name: "Rewards", icon: "gift" }, { name: "Profile", icon: "user" },
  ];

  return (
    <main className="app-shell" data-theme={theme}>
      <div className="phone-frame">
        <header className="topbar">
          <button className="brand" onClick={() => setTab("Home")} aria-label="EcoBingo home">
            <span className="brand-mark"><Icon name="leaf" /></span>
            <span className="brand-word">eco<span>bingo</span><small>GO A LITTLE WILDER</small></span>
          </button>
          <div className="header-actions">
            <button className="theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
              <span className="theme-toggle-thumb"><Icon name={theme === "light" ? "sun" : "moon"} /></span>
            </button>
            <button className="avatar-button" onClick={() => setTab("Profile")} aria-label="Open profile">A</button>
          </div>
        </header>

        {tab === "Home" && <section className="page-content" key="home">
          <div className="hero-card">
            <div className="hero-decoration hero-decoration-a" /><div className="hero-decoration hero-decoration-b" />
            <span className="eyebrow"><span className="status-dot" /> YOUR DAILY RESET</span>
            <h1>Less scrolling.<br /><em>More living.</em></h1>
            <p>Little outdoor missions. Big main-character energy.</p>
            <button className="primary-button" onClick={() => setTab("Bingo")}>Start today&apos;s adventure <Icon name="arrow" /></button>
            <div className="hero-bottom"><span><Icon name="sun" /> Fresh air looks good on you</span><span>01 / 09</span></div>
          </div>
          <div className="section-heading"><div><span className="eyebrow muted">YOUR OUTDOOR ERA</span><h2>Today's progress</h2></div><button className="text-button" onClick={() => setTab("Bingo")}>View board <Icon name="arrow" /></button></div>
          <div className="progress-card">
            <div className="progress-top"><div className="progress-icon"><Icon name="spark" /></div><div className="progress-copy"><strong>{completed.length} of 9 missions</strong><span>{completed.length ? "You're making outside time count" : "Your next little adventure awaits"}</span></div><strong className="progress-percent">{Math.round(completed.length / 9 * 100)}%</strong></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${completed.length / 9 * 100}%` }} /></div>
            <div className="progress-foot"><span><Icon name="trophy" /> +100 bonus at 3 missions</span><span>{completed.reduce((sum, id) => sum + (missions.find(m => m.id === id)?.points ?? 0), 0)} pts today</span></div>
          </div>
          <div className="section-heading compact"><div><span className="eyebrow muted">A TINY CHALLENGE</span><h2>Try one right now</h2></div></div>
          <button className="featured-mission" onClick={() => toggleMission(5)}><span className="featured-icon">✳</span><span className="featured-text"><strong>Take a screen-free moment</strong><small>Look up. Take a breath. Be here.</small></span><span className={`mission-check ${completed.includes(5) ? "checked" : ""}`}>{completed.includes(5) ? <Icon name="check" /> : "+"}</span></button>
          <div className="quote-card"><Icon name="spark" /><p>“The world is more interesting than your feed.”</p><span>YOUR GENTLE REMINDER</span></div>
        </section>}

        {tab === "Bingo" && <section className="page-content" key="bingo">
          <div className="page-title-row"><div><span className="eyebrow muted">YOUR DAILY QUEST</span><h1 className="page-title">Eco<span>Bingo.</span></h1><p className="page-subtitle">Go outside. Find your moments. Mark them off.</p></div><span className="date-pill"><Icon name="sun" /> DAILY</span></div>
          <div className="board-summary"><div><strong>{completed.length}<span>/9</span></strong><small>MISSIONS DONE</small></div><div className="summary-divider" /><div><strong>{completed.reduce((sum, id) => sum + (missions.find(m => m.id === id)?.points ?? 0), 0)}</strong><small>POINTS EARNED</small></div><span className="summary-stamp"><Icon name="leaf" /></span></div>
          <div className="bingo-grid">{missions.map((mission, i) => { const done = completed.includes(mission.id); return <button key={mission.id} className={`bingo-tile tone-${mission.tone} ${done ? "tile-done" : ""} ${i === 4 ? "tile-center" : ""}`} onClick={() => toggleMission(mission.id)} aria-pressed={done}><span className="tile-emoji">{done ? <Icon name="check" /> : mission.icon}</span><strong>{mission.title}</strong><small>{done ? "COMPLETED" : `+${mission.points} PTS`}</small></button>; })}</div>
          <div className="phone-away-note"><span className="note-icon"><Icon name="clock" /></span><p><strong>Now, put your phone away.</strong><br />Come back when you've completed a mission. The outdoors isn't going anywhere.</p></div>
          <button className={`primary-button full-button ${bonusClaimed ? "claimed-button" : ""}`} onClick={claimBonus}>{bonusClaimed ? "Bonus claimed" : "Claim 3-mission bonus · +100 pts"} <Icon name={bonusClaimed ? "check" : "arrow"} /></button>
          <p className="micro-note">Demo points only · no GPS or camera tracking</p>
        </section>}

        {tab === "Rewards" && <section className="page-content" key="rewards">
          <div><span className="eyebrow muted">GOOD THINGS COME TO OUTSIDE</span><h1 className="page-title">Your <span>rewards.</span></h1><p className="page-subtitle">Little wins for showing up in the real world.</p></div>
          <div className="points-hero"><span className="eyebrow">YOUR ECO POINTS</span><strong>{points.toLocaleString("en-IN")}</strong><span className="points-label"><Icon name="spark" /> Every mission gets you closer</span><div className="points-bottom"><span>LEVEL 3 · EXPLORER</span><span>{Math.max(0, 500 - points % 500)} pts to next level</span></div><div className="level-track"><div style={{ width: `${points % 500 / 5}%` }} /></div></div>
          <div className="section-heading"><div><span className="eyebrow muted">UNLOCK YOUR GOODIES</span><h2>Achievements</h2></div><span className="small-count">01 / 03</span></div>
          <div className="reward-list">{[{title:"Fresh Start", subtitle:"Complete your first bingo", cost:"100 pts", icon:"leaf", ready:true},{title:"Nature Nerd",subtitle:"Finish 3 daily boards",cost:"250 pts",icon:"leaf",ready:false},{title:"Touch Grass Club",subtitle:"Get outside 5 days in a row",cost:"500 pts",icon:"trophy",ready:false}].map((r,i)=><div className={`reward-row ${!r.ready?"reward-locked":""}`} key={r.title}><div className={`reward-icon reward-${i}`}><Icon name={r.icon} /></div><div className="reward-copy"><strong>{r.title}</strong><small>{r.subtitle}</small><span>{r.cost}</span></div><span className={r.ready?"unlocked":"locked-label"}>{r.ready?"READY":"LOCKED"}</span></div>)}</div>
          <div className="coming-soon"><span className="coming-icon"><Icon name="gift" /></span><div><strong>Real-world rewards are on the way</strong><p>Partner coupons and redeemable perks come later. Points are demo points, not cash.</p></div></div>
        </section>}

        {tab === "Profile" && <section className="page-content" key="profile">
          <span className="eyebrow muted">YOUR LITTLE CORNER</span><h1 className="page-title">Hey, <span>Explorer.</span></h1><p className="page-subtitle">You're doing better than you think. Keep stepping outside.</p>
          <div className="profile-card"><div className="profile-avatar">A</div><div><strong>Outdoor Explorer</strong><span>Level 3 · Nature curious</span><small>Member since today</small></div><span className="profile-leaf"><Icon name="leaf" /></span></div>
          <div className="stat-grid"><div className="stat-card"><Icon name="trophy" /><strong>{points}</strong><span>TOTAL POINTS</span></div><div className="stat-card"><Icon name="grid" /><strong>{completed.length}</strong><span>MISSIONS DONE</span></div><div className="stat-card"><Icon name="clock" /><strong>1 day</strong><span>CURRENT STREAK</span></div><div className="stat-card"><Icon name="leaf" /><strong>1</strong><span>BADGES EARNED</span></div></div>
          <div className="settings-list"><div><span className="setting-icon"><Icon name="clock" /></span><span><strong>Screen-time intention</strong><small>Spend less time scrolling</small></span><span className="setting-tag">ON</span></div><div><span className="setting-icon"><Icon name="leaf" /></span><span><strong>Privacy by design</strong><small>No GPS, camera or background tracking</small></span><Icon name="check" /></div><button className="settings-theme" onClick={() => setTheme(theme === "light" ? "dark" : "light")}><span className="setting-icon"><Icon name={theme === "light" ? "moon" : "sun"} /></span><span><strong>{theme === "light" ? "Dark mode" : "Light mode"}</strong><small>Change the look of EcoBingo</small></span><span className={`switch ${theme === "dark" ? "switch-on" : ""}`}><span /></span></button></div>
          <p className="micro-note">EcoBingo is a little nudge to enjoy the world beyond your screen.</p>
        </section>}

        {guideOpen && (
          <section className="guide-panel" aria-label="EcoBingo Nature Guide">
            <header className="guide-header">
              <span className="guide-mark"><Icon name="leaf" /></span>
              <div className="guide-heading">
                <strong>Nature Guide</strong>
                <small>Powered by Gemma · EcoBingo</small>
              </div>
              <button className="guide-close" onClick={() => setGuideOpen(false)} aria-label="Close nature guide">×</button>
            </header>
            <div className="guide-messages" aria-live="polite">
              {guideMessages.map((message, index) => (
                <div key={`${index}-${message.role}`} className={`guide-message guide-${message.role}`}>
                  {message.text}
                </div>
              ))}
              {guideLoading && <div className="guide-message guide-assistant">Thinking of something wild…</div>}
            </div>
            <form className="guide-form" onSubmit={sendGuideMessage}>
              <input
                value={guideQuestion}
                onChange={(event) => setGuideQuestion(event.target.value)}
                placeholder="Ask about nature or a mission…"
                aria-label="Ask the nature guide"
                maxLength={1200}
                disabled={guideLoading}
              />
              <button type="submit" disabled={guideLoading || !guideQuestion.trim()} aria-label="Send question">
                {guideLoading ? "…" : "Send"}
              </button>
            </form>
            <p className="guide-disclaimer">Stay on safe paths. Observe wildlife from a distance.</p>
          </section>
        )}
        <button
          className={`guide-launcher ${guideOpen ? "guide-launcher-open" : ""}`}
          onClick={() => setGuideOpen((open) => !open)}
          aria-expanded={guideOpen}
          aria-label={guideOpen ? "Close Nature Guide" : "Open Nature Guide"}
        >
          <Icon name={guideOpen ? "check" : "leaf"} />
          <span>{guideOpen ? "Close guide" : "Nature Guide"}</span>
        </button>

        <nav className="bottom-nav" aria-label="Main navigation">{nav.map(item => <button key={item.name} className={`nav-item ${tab === item.name ? "nav-active" : ""}`} onClick={() => setTab(item.name)}><span className="nav-icon-wrap"><Icon name={item.icon} /></span><span>{item.name}</span></button>)}</nav>
        {toast && <div className="toast" role="status"><Icon name="check" />{toast}</div>}
      </div>
    </main>
  );
}
