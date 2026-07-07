import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { DEMO_COOKIE_NAME } from "@/lib/demo";

const DEMO_COOKIE_MAX_AGE = 10 * 365 * 24 * 60 * 60; // 10 years — effectively permanent

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Ensures the one-time demo cookie exists before /demo or /api/demo-generate
  // render — set here (not in app/demo/page.tsx) because Server Components
  // can't set cookies; setting it on request.cookies makes it visible to this
  // same request's render, not just future requests. The actual Set-Cookie
  // call on the response is deferred to just before return, since the
  // Supabase client below can reassign `supabaseResponse` to a fresh
  // NextResponse during its own cookie sync — setting it any earlier risks
  // that reassignment silently dropping this cookie.
  const isDemoPath =
    request.nextUrl.pathname === "/demo" ||
    request.nextUrl.pathname.startsWith("/api/demo-generate");
  let demoIdToSet: string | null = null;
  if (isDemoPath && !request.cookies.get(DEMO_COOKIE_NAME)) {
    demoIdToSet = crypto.randomUUID();
    request.cookies.set(DEMO_COOKIE_NAME, demoIdToSet);
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const protectedRoutes = ["/generate", "/history", "/profile"];
  const isProtected = protectedRoutes.some((r) =>
    request.nextUrl.pathname.startsWith(r)
  );
  if (!user && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (demoIdToSet) {
    supabaseResponse.cookies.set(DEMO_COOKIE_NAME, demoIdToSet, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: DEMO_COOKIE_MAX_AGE,
      path: "/",
    });
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
