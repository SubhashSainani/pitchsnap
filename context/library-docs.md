# Library Docs

Key API references for libraries used in PitchSnap.
This file exists because AI training data goes stale.
Always refer to this before implementing any integration.

---

## Supabase SSR (Next.js App Router)

### Install
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### Server Client (Server Components, Route Handlers, Server Actions)
```typescript
// lib/supabase-server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
```

### Browser Client (Client Components only)
```typescript
// lib/supabase-client.ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### Middleware (route protection)
```typescript
// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  const protectedRoutes = ["/generate", "/history", "/profile"];
  const isProtected = protectedRoutes.some(r =>
    request.nextUrl.pathname.startsWith(r)
  );
  if (!user && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

### Google OAuth Sign In
```typescript
const supabase = createClient(); // browser client
await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

### Auth Callback Route
```typescript
// app/auth/callback/route.ts
import { createClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(new URL("/generate", request.url));
}
```

### Get current user (server)
```typescript
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
```

### Sign Out (server action)
```typescript
"use server";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
```

---

## Google Gemini API

### Install
```bash
npm install @google/generative-ai
```

### Basic Usage
```typescript
// lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generatePitch(
  websiteContent: string,
  services: string,
  tone: string,
  targetClient: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = buildPrompt(websiteContent, services, tone, targetClient);
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

### Model to use
Always use `"gemini-2.5-flash"` — it is fast, free tier friendly, and good enough for email generation.
Do NOT use `"gemini-pro"` or any `"-pro"` variant — they consume quota faster.

**Note:** `"gemini-1.5-flash"` (this doc's original recommendation) was retired by Google and returns
a 404 as of 2026-06-29. If `generateContent` calls start 404ing again in the future, run
`GET https://generativelanguage.googleapis.com/v1beta/models?key=<key>` to list currently
available models before picking a replacement.

### Free Tier Limits
- 15 requests per minute
- 1 million tokens per minute
- 1,500 requests per day
Sufficient for development and early users. No credit card required.

---

## Cheerio (HTML parsing)

### Install
```bash
npm install cheerio
```

### Extract readable text from HTML
```typescript
import * as cheerio from "cheerio";

export function extractText(html: string): string {
  const $ = cheerio.load(html);
  // Remove noise
  $("script, style, nav, footer, header, noscript").remove();
  // Get main content
  const text = $("body").text();
  // Clean whitespace
  return text.replace(/\s+/g, " ").trim().slice(0, 5000); // cap at 5000 chars
}
```

Always cap extracted text at 5000 characters before sending to Gemini.
This keeps token usage low and responses fast.
