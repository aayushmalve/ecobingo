This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## EcoBingo features

- Mission completion, demo points, bonus status, and theme preference are saved in this browser using local storage. This is device-local persistence, not account sync.
- A web app manifest and SVG app icon provide install metadata for supported browsers. Installability and offline support still depend on the browser and hosting environment; this version does not cache the app for offline use.
- The hosted Gemma 4 nature-guide endpoint is available at `POST /api/guide`. Send JSON such as `{ "question": "Give me a safe 5-minute outdoor observation mission." }`. The endpoint returns `{ "answer": "...", "model": "gemma-4-26b-a4b-it" }`.

### Configure the hosted Gemma 4 API

1. Copy `.env.example` to `.env.local`.
2. Add a Google AI Studio API key to `GEMINI_API_KEY`. Never expose this key in client-side code or commit `.env.local`.
3. Optionally set `GEMMA_MODEL` to another Gemma 4 model available to your API key.
4. For Vercel, add `GEMINI_API_KEY` (and optionally `GEMMA_MODEL`) in the project's Environment Variables settings, then redeploy.

Example local API check:

```bash
curl -X POST http://localhost:3000/api/guide \
  -H 'Content-Type: application/json' \
  -d '{"question":"Suggest one safe outdoor observation mission."}'
```
