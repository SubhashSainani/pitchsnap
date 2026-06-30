# Architecture

## Tech Stack

| Layer       | Technology              | Why                                      |
|-------------|-------------------------|------------------------------------------|
| Framework   | Next.js 15 (App Router) | Full stack, server components, API routes|
| Auth + DB   | Supabase                | Free tier, built-in OAuth, Postgres      |
| AI          | Google Gemini API       | Free tier, fast, good at writing tasks   |
| Styling     | Tailwind CSS v4         | Utility-first, token-based via @theme    |
| Deployment  | Vercel                  | Free tier, native Next.js support        |

---

## Folder Structure

```
pitchsnap/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (app)/
│   │   ├── layout.tsx          ← shared layout with navbar for authenticated pages
│   │   ├── generate/
│   │   │   └── page.tsx
│   │   ├── history/
│   │   │   └── page.tsx
│   │   └── profile/
│   │       └── page.tsx
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts        ← fetches URL + calls Gemini + saves pitch
│   │   └── pitches/
│   │       └── route.ts        ← GET all pitches, DELETE a pitch
│   ├── layout.tsx              ← root layout, font setup, Supabase provider
│   ├── page.tsx                ← homepage
│   └── globals.css             ← Tailwind @theme tokens
├── components/
│   ├── ui/                     ← shadcn primitives (button, input, etc.)
│   ├── layout/
│   │   └── Navbar.tsx
│   └── pitch/
│       ├── PitchForm.tsx       ← URL input + generate button
│       ├── PitchOutput.tsx     ← generated email display + copy + regenerate
│       └── PitchHistoryRow.tsx ← single row in history list
├── actions/
│   ├── profile.ts              ← saveProfile server action
│   └── pitches.ts              ← deletePitch server action
├── lib/
│   ├── supabase-server.ts      ← createClient for server context
│   ├── supabase-client.ts      ← createClient for browser context
│   ├── gemini.ts               ← Gemini API wrapper
│   ├── fetcher.ts              ← website content fetcher (server-side)
│   └── utils.ts                ← cn(), shared constants
├── types/
│   └── index.ts                ← shared TypeScript types
└── middleware.ts               ← auth route protection
```

---

## Architectural Boundaries

### Who owns what — never cross these lines

| Concern               | Lives in                        | Never in                        |
|-----------------------|---------------------------------|---------------------------------|
| DB reads (server)     | Server Components, Route Handlers, Server Actions | Client Components |
| DB reads (client)     | NOT ALLOWED — always go through Server Components or API routes | anywhere client-side |
| AI calls              | `lib/gemini.ts` + API route     | components, actions, client code |
| Website fetching      | `lib/fetcher.ts` + API route    | client components               |
| Auth session (server) | `lib/supabase-server.ts`        | browser context                 |
| Auth session (client) | `lib/supabase-client.ts`        | server context                  |
| Business logic        | `lib/` and `actions/`           | Route handlers directly         |
| UI state              | Client Components only          | Server Components               |

---

## Data Flow — Generate Feature

```
User submits URL (client)
  → POST /api/generate (route handler)
    → lib/fetcher.ts fetches prospect website
    → lib/gemini.ts calls Gemini with website content + user profile
    → Gemini returns email text
    → Save pitch to Supabase pitches table
    → Return { success: true, pitch: { id, email_content, prospect_summary } }
  → Client displays result in PitchOutput component
```

---

## Supabase Schema

```sql
-- profiles table
create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  services text not null default '',
  tone text not null default 'Professional',
  target_client text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- pitches table
create table pitches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  prospect_url text not null,
  prospect_summary text not null default '',
  email_content text not null,
  created_at timestamptz not null default now()
);

-- RLS policies (enable RLS on both tables)
-- Users can only read/write their own rows
```

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
```

`NEXT_PUBLIC_` variables are safe for the browser.
`GEMINI_API_KEY` is server-only — never expose to the client.

---

## Auth Flow

- Supabase handles Google OAuth
- After OAuth callback → Supabase sets session cookie automatically
- `middleware.ts` checks session on every protected route
- Protected routes: `/generate`, `/history`, `/profile`
- Public routes: `/`, `/login`, `/auth/callback`
