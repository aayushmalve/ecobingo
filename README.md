# EcoBingo

**Touch grass. Build habits. Make every little action count.**

EcoBingo is a gamified outdoor activity web app that encourages people to take screen breaks, explore nature, and complete small environmentally friendly actions. It combines bingo-style missions, progress tracking, weekly challenges, and AI-generated personalized activities.

**Live demo:** https://ecobingo-game.vercel.app/  
**Repository:** https://github.com/aayushmalve/ecobingo

## Features

- **Bingo missions:** Complete outdoor and environmentally friendly activities.
- **Points and bonuses:** Earn demo points by completing missions.
- **Streaks and progress:** Track activity and build consistent habits.
- **Weekly challenges:** Work toward longer-term goals.
- **AI Eco Coach:** Generate three personalized missions based on interests and available time.
- **Nature Guide:** Ask the AI for practical, safety-conscious outdoor ideas.
- **Local progress storage:** Save supported progress and preferences in your browser using local storage.
- **Install metadata:** Includes a web app manifest and app icon for supported browsers.

EcoBingo points are for demonstration purposes and have no cash value. Progress is stored locally and is not synchronized across accounts or devices.

## Technology

- Next.js with the App Router
- React and TypeScript
- CSS
- Google Gemini API with a hosted Gemma model
- Browser local storage
- Vercel deployment

### How the AI works

EcoBingo uses a Gemma model through Google's hosted Gemini API. The model is not running locally in the browser or on the user's device. AI requests require an internet connection and a server-side API key.

## Getting started

### Requirements

- Node.js and npm
- A Google AI Studio API key for AI features

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/aayushmalve/ecobingo.git
cd ecobingo
npm install
```

Create your local environment file:

```bash
cp .env.example .env.local
```

Set the following variables in `.env.local`:

```dotenv
GEMINI_API_KEY=your_google_ai_studio_api_key
GEMMA_MODEL=gemma-4-26b-a4b-it
```

Keep your actual API key secret. Never commit `.env.local` or expose the key in client-side code.

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000.

Build for production with:

```bash
npm run build
```

## AI API

The existing AI endpoint is `POST /api/guide`.

For nature-guide chat, send a JSON request:

```json
{
  "question": "Suggest one safe outdoor observation mission."
}
```

The endpoint returns an answer and the model identifier.

For personalized mission generation, the endpoint also accepts a mission-generation mode and returns three generated missions. See `src/app/api/guide/route.ts` for the request and response implementation.

AI functionality requires a configured server-side `GEMINI_API_KEY`. Do not expose this key in public repository files.

## Deployment

EcoBingo is deployed on Vercel.

To deploy your own instance:

1. Import the repository into Vercel.
2. Configure `GEMINI_API_KEY` in the project's environment variables.
3. Optionally configure `GEMMA_MODEL` to a supported model available to your API key.
4. Deploy and test the application.

## Screenshots

Add screenshots of the actual application here:

- Main bingo board and progress
- Eco Coach with generated missions
- Weekly challenges and streaks

## Contributing

Contributions, bug reports, and suggestions are welcome. For substantial changes, open an issue to discuss the proposal before submitting a pull request.

Please never commit API keys, credentials, or other secrets.

## License

See the `LICENSE` file for the license terms.
