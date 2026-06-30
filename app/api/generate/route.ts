import { NextRequest, NextResponse } from "next/server";

import { extractDomain, fetchWebsiteText } from "@/lib/fetcher";
import { generatePitch } from "@/lib/gemini";
import { createClient } from "@/lib/supabase-server";
import { isTone, type Profile } from "@/types";

function summarize(text: string): string {
  const capped = text.slice(0, 300);
  const lastSpace = capped.lastIndexOf(" ");
  return lastSpace > 0 ? capped.slice(0, lastSpace).trim() : capped.trim();
}

function parseUrl(body: unknown): string {
  if (typeof body !== "object" || body === null || !("url" in body)) {
    return "";
  }
  // Narrowed to object/non-null with a "url" key above; this cast only
  // exposes the property as `unknown`, so the typeof check below still does
  // the real narrowing — required since TS can't type-narrow through `in`.
  const value = (body as { url: unknown }).url;
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 },
      );
    }

    const body: unknown = await req.json();
    const url = parseUrl(body);
    if (!url) {
      return NextResponse.json(
        { success: false, error: "A website URL is required" },
        { status: 400 },
      );
    }

    const { data: profileRow, error: profileError } = await supabase
      .from("profiles")
      .select("services, tone, target_client")
      .eq("user_id", user.id)
      .maybeSingle();
    if (profileError) {
      console.error("[api/generate]", profileError);
    }

    const profile: Profile = {
      services: profileRow?.services ?? "",
      tone: isTone(profileRow?.tone) ? profileRow.tone : "Professional",
      target_client: profileRow?.target_client ?? "",
    };

    let websiteText: string;
    try {
      websiteText = await fetchWebsiteText(url);
    } catch (error) {
      console.error("[api/generate] fetch failed", error);
      return NextResponse.json(
        {
          success: false,
          error: "We couldn't read that website. Check the URL and try again.",
        },
        { status: 422 },
      );
    }

    const domain = extractDomain(url);

    let emailContent: string;
    try {
      emailContent = await generatePitch(websiteText, profile, domain);
    } catch (error) {
      console.error("[api/generate] gemini failed", error);
      return NextResponse.json(
        {
          success: false,
          error: "Something went wrong generating your pitch. Please try again.",
        },
        { status: 502 },
      );
    }

    const prospectSummary = summarize(websiteText);

    const { data: pitch, error: insertError } = await supabase
      .from("pitches")
      .insert({
        user_id: user.id,
        prospect_url: url,
        prospect_summary: prospectSummary,
        email_content: emailContent,
      })
      .select("id, prospect_url, prospect_summary, email_content, created_at")
      .single();
    if (insertError) throw insertError;

    return NextResponse.json({ success: true, pitch });
  } catch (error) {
    console.error("[api/generate]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
