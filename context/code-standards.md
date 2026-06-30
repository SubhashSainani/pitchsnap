# Code Standards

Rules for every session. Read this before writing a single line of code.
These rules prevent pattern drift across sessions.

---

## Engineering Mindset

- **Read context files first** — always check architecture.md before building anything
- **Scope is sacred** — only build what the current feature requires
- **One feature at a time** — finish one thing completely before touching the next
- **Think before implementing** — understand what and why before writing code
- **Clean over clever** — simple readable code always wins
- **Every feature must be verifiable** — if it can't be tested right after build, it's incomplete
- **Failures are expected** — wrap everything in try/catch, log failures, never crash silently

---

## TypeScript

- Strict mode enabled — no exceptions
- Never use `any` — use `unknown` and narrow the type
- Never use type assertions (`as SomeType`) unless absolutely necessary with a comment explaining why
- All function parameters and return types must be explicitly typed
- Use `type` for object shapes and unions
- Use `interface` only for extendable component props
- All async functions must handle errors — no floating promises
- Use `const` by default — `let` only when reassignment is necessary

---

## Next.js 15 Conventions

- App Router only
- All components are Server Components by default
- Only add `"use client"` when the component needs:
  - useState / useReducer
  - useEffect
  - Browser APIs (clipboard, window, etc.)
  - Event handlers that can't be server actions
- Never add `"use client"` to layout files
- Data fetching happens in Server Components only
- Route handlers live in `app/api/` — no business logic directly in route handlers
- Server Actions live in `actions/` — never inline in components
- Always read the Next.js docs reference before implementing Next.js-specific features

---

## File and Folder Naming

- Folders: kebab-case — `pitch-output`, `auth-callback`
- Component files: PascalCase — `PitchForm.tsx`, `Navbar.tsx`
- Utility files: camelCase — `gemini.ts`, `supabase-server.ts`
- Type files: camelCase — `index.ts`
- API route files: always `route.ts`
- Server Action files: camelCase — `profile.ts`, `pitches.ts`
- One component per file — never export multiple components from one file
- Index files only in `components/ui/` — never barrel export from other folders

---

## Component Structure

Every component follows this exact order:

```typescript
"use client"; // only if needed

// 1. External imports
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 2. Internal imports
import { PitchOutput } from "@/components/pitch/PitchOutput";

// 3. Type definitions
type Props = {
  userId: string;
};

// 4. Component
export function ComponentName({ userId }: Props) {
  // state
  // derived values
  // handlers
  // return JSX
}
```

- Always named exports — never default exports for components
- **Exception:** Next.js App Router special files (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`) must use default exports — this is a framework requirement, not a deviation
- Props type defined directly above the component
- No inline styles — all styling via Tailwind using tokens from ui-tokens.md

---

## API Route Handlers

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // validate
    // call lib function
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[api/generate]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

- Every route handler has try/catch
- Every route handler validates request body before processing
- Errors logged with route path prefix: `[api/generate]`
- Always return `{ success: boolean, data?: T, error?: string }`
- Never return raw data without the success wrapper

---

## Server Actions

```typescript
"use server";

import { revalidatePath } from "next/cache";

export async function saveProfile(data: ProfileData) {
  try {
    // validate
    // write to DB
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("[actions/profile]", error);
    return { success: false, error: "Failed to save profile" };
  }
}
```

- Every server action has try/catch
- Every server action returns `{ success: boolean, error?: string }`
- Always call `revalidatePath` after mutations
- Never throw from server actions — always return the error
- **Exception:** server actions bound directly to `<form action={...}>` (no client wrapper) must return `Promise<void>` instead of `{ success, error }` — React's form action type only accepts `void | Promise<void>`. On failure, redirect back to the current route with an `?error=` query param instead of returning an error object, so the destination page can render a human-readable message. `actions/auth.ts`'s `signOut` is the reference example.

---

## Supabase Usage

```typescript
// Server context — Server Components, Route Handlers, Server Actions
import { createClient } from "@/lib/supabase-server";
const supabase = await createClient();

// Browser context — Client Components only
import { createClient } from "@/lib/supabase-client";
const supabase = createClient();
```

- Never use the browser client in server context
- Never use the server client in browser context
- Always scope every query to the current user_id — never query without a user filter
- Always check for Supabase errors: `if (error) throw error`

---

## Error Handling

- Never use empty catch blocks
- **Exception:** the `setAll` cookie sync inside `lib/supabase-server.ts`'s `createClient` wraps `cookieStore.set(...)` in an empty `catch {}` — this is the official Supabase SSR pattern for Next.js (the call only fails when invoked from a Server Component, where it's a no-op because middleware already refreshes the session). Do not replicate this empty-catch pattern anywhere else.
- Console errors always include context: `[component-or-function-name]`
- User-facing errors must be human readable — never expose raw error messages
- API route errors return status 500 with a generic message
- Never expose internal error details to the client

---

## Import Aliases

Always use `@/` — never use relative imports going up more than one level.

```typescript
// Correct
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase-server";

// Never
import { Button } from "../../../components/ui/button";
```

---

## Comments

- No comments explaining what the code does — code must be self-explanatory
- Comments only for why — explaining a non-obvious decision
- Never leave TODO comments in committed code

---

## Approved Dependencies

Never install a new package without checking:
1. Does shadcn/ui already have this component?
2. Does Next.js already provide this?
3. Is there a simpler native solution?

Approved packages for PitchSnap:

- `@supabase/supabase-js` — Supabase client
- `@supabase/ssr` — Supabase SSR helpers for Next.js
- `@google/generative-ai` — Gemini API client
- `zod` — schema validation
- `lucide-react` — icons
- `tailwindcss` — styling
- shadcn/ui components — UI primitives (first use: Dialog, Feature 10 — pulls in `@base-ui/react` as the underlying headless primitive, plus `clsx` + `tailwind-merge` via `lib/utils.ts`'s `cn()`, and `tw-animate-css` for open/close transitions; `shadcn` itself is a devDependency, codegen only, never imported at runtime)
- `cheerio` — HTML parsing for website fetcher (server only)

Do not install anything else without updating this list.

---

## Environment Variables

| Variable                        | Used in                    |
|---------------------------------|----------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`      | lib/supabase-client.ts     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | lib/supabase-client.ts     |
| `GEMINI_API_KEY`                | lib/gemini.ts              |

`NEXT_PUBLIC_` = safe for browser. Never add `NEXT_PUBLIC_` to `GEMINI_API_KEY`.
