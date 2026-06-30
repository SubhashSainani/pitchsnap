# PitchSnap

AI-powered cold email generator for freelancers and indie hackers. Set up your
profile once — services, tone, target clients — then paste a prospect's website
URL. PitchSnap fetches the site, reads what the company does, and writes a fully
personalized cold email pitch. No templates, no sending — generate, edit, copy.

## Tech Stack

| Layer      | Technology               |
|------------|---------------------------|
| Framework  | Next.js 15 (App Router)  |
| Auth + DB  | Supabase                 |
| AI         | Google Gemini API        |
| Styling    | Tailwind CSS v4          |
| Deployment | Vercel                   |

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the required environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   GEMINI_API_KEY=
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000).

## Project Context

See `/context` for the architecture, build plan, code standards, and design
system this project is built against.
