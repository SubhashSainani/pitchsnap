import { NextRequest, NextResponse } from "next/server";

import { extractDomain, fetchWebsiteText } from "@/lib/fetcher";
import { generatePitch, parsePitchResponse } from "@/lib/gemini";
import { DEMO_COOKIE_NAME, getClientIp } from "@/lib/demo";
import { createAdminClient } from "@/lib/supabase-admin";
import type { Profile } from "@/types";

const DEMO_PROFILE: Profile = {
  full_name: "",
  services: "providing professional services tailored to your business",
  tone: "Professional",
  target_client: "",
};

function parseUrl(body: unknown): string {
  if (typeof body !== "object" || body === null || !("url" in body)) {
    return "";
  }
  const value = (body as { url: unknown }).url;
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest) {
  try {
    const cookieId =
      req.cookies.get(DEMO_COOKIE_NAME)?.value ?? crypto.randomUUID();
    const ipAddress = getClientIp(req.headers);

    const body: unknown = await req.json();
    const url = parseUrl(body);
    if (!url) {
      return NextResponse.json(
        { success: false, error: "A website URL is required" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { data: existingUsage, error: usageCheckError } = await supabase
      .from("demo_usage")
      .select("id")
      .eq("ip_address", ipAddress)
      .eq("cookie_id", cookieId)
      .maybeSingle();
    if (usageCheckError) {
      console.error("[api/demo-generate]", usageCheckError);
    }

    if (existingUsage) {
      return NextResponse.json(
        {
          success: false,
          error: "demo_used",
          message: "You've already used your free demo",
        },
        { status: 403 },
      );
    }

    let websiteText: string;
    try {
      websiteText = await fetchWebsiteText(url);
    } catch (error) {
      console.error("[api/demo-generate] fetch failed", error);
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
      const raw = await generatePitch(websiteText, DEMO_PROFILE, domain);
      emailContent = parsePitchResponse(raw).emailContent;
    } catch (error) {
      console.error("[api/demo-generate] gemini failed", error);
      return NextResponse.json(
        {
          success: false,
          error: "Something went wrong generating your pitch. Please try again.",
        },
        { status: 502 },
      );
    }

    const { error: insertError } = await supabase.from("demo_usage").insert({
      ip_address: ipAddress,
      cookie_id: cookieId,
    });
    if (insertError) {
      console.error("[api/demo-generate] usage insert failed", insertError);
    }

    return NextResponse.json({ success: true, data: { email_content: emailContent } });
  } catch (error) {
    console.error("[api/demo-generate]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
