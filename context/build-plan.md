# Build Plan

Ordered list of every feature to build. One session per phase.
Never skip ahead. Never build a feature before its dependencies are complete.

---

## Phase 1 — Foundation
01. Project scaffold — Next.js 15, Tailwind v4, folder structure, globals.css tokens
02. Supabase setup — create project, run schema SQL, configure env vars
03. Auth — Google OAuth via Supabase, login page, middleware, redirect logic

## Phase 2 — Core Pages Shell
04. Root layout + Navbar — logo, nav links, sign-out button
05. Homepage — hero section, how it works, CTA button
06. Profile page — form UI + save logic (services, tone, target client)

## Phase 3 — Core Feature
07. Website fetcher — lib/fetcher.ts, server-side URL fetch, HTML to text extraction
08. Gemini integration — lib/gemini.ts, prompt construction, API call, response parsing
09. Generate page — URL input form, POST to /api/generate, display PitchOutput

## Phase 4 — History
10. Pitch history — /history page, fetch all user pitches, PitchHistoryRow, delete pitch

## Phase 5 — Polish
11. Incomplete profile banner on /generate
12. Empty states — history empty, generate before first use
13. Loading states — generate button spinner, history loading
14. Error handling — fetch failures, Gemini failures, user-facing messages

## Phase 6 — Production
15. Environment variable audit — verify all vars set correctly
16. RLS policies — verify Supabase row-level security on both tables
17. Deploy to Vercel — connect repo, set env vars, verify production build
