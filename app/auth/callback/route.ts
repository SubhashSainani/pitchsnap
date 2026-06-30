import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    if (code) {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
    }
    return NextResponse.redirect(new URL("/generate", request.url));
  } catch (error) {
    console.error("[auth/callback]", error);
    return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
  }
}
