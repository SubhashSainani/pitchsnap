import { NextRequest, NextResponse } from "next/server";

import { extractDomain, fetchWebsiteText } from "@/lib/fetcher";
import { generatePitchStream, parsePitchResponse } from "@/lib/gemini";
import { createClient } from "@/lib/supabase-server";
import { PLAN_LIMITS } from "@/lib/utils";
import { isPlan, isTone, type Profile } from "@/types";

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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  const url = parseUrl(body);
  if (!url) {
    return NextResponse.json(
      { success: false, error: "A website URL is required" },
      { status: 400 },
    );
  }

  const { data: profileRow, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, services, tone, target_client, pitches_this_month, plan")
    .eq("user_id", user.id)
    .maybeSingle();
  if (profileError) {
    console.error("[api/generate]", profileError);
  }

  const plan = isPlan(profileRow?.plan) ? profileRow.plan : "free";
  const planLimit = PLAN_LIMITS[plan];
  if ((profileRow?.pitches_this_month ?? 0) >= planLimit) {
    return NextResponse.json(
      { success: false, error: "Monthly pitch limit reached" },
      { status: 403 },
    );
  }

  const profile: Profile = {
    full_name: profileRow?.full_name ?? "",
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
        error:
          "We couldn't read that website. It may be protected against automated access. Try a different URL — SaaS company sites work best.",
      },
      { status: 422 },
    );
  }

  const domain = extractDomain(url);
  let textStream: AsyncGenerator<string>;
  try {
    textStream = await generatePitchStream(websiteText, profile, domain);
  } catch (error) {
    console.error("[api/generate] gemini stream failed", error);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong generating your pitch. Please try again.",
      },
      { status: 502 },
    );
  }

  const encoder = new TextEncoder();
  const pitchesThisMonth = profileRow?.pitches_this_month ?? 0;

  const stream = new ReadableStream({
    async start(controller) {
      const chunks: string[] = [];
      try {
        for await (const chunk of textStream) {
          chunks.push(chunk);
          controller.enqueue(encoder.encode(chunk));
        }

        const fullText = chunks.join("");
        const { subjectLines, emailContent } = parsePitchResponse(fullText);
        const prospectSummary = summarize(websiteText);

        const { error: insertError } = await supabase.from("pitches").insert({
          user_id: user.id,
          prospect_url: url,
          prospect_summary: prospectSummary,
          email_content: emailContent,
        });
        if (insertError) {
          // Log but do not abort — user still receives their generated email and
          // subject lines. The pitch won't appear in history, but that's better
          // than discarding visible output with an error sentinel.
          console.error("[api/generate] save failed", insertError);
        } else {
          const { error: usageError } = await supabase
            .from("profiles")
            .update({ pitches_this_month: pitchesThisMonth + 1 })
            .eq("user_id", user.id);
          if (usageError) {
            console.error("[api/generate] usage increment failed", usageError);
          }
        }

        controller.enqueue(
          encoder.encode(`__METADATA__${JSON.stringify({ subjectLines })}`),
        );
      } catch (error) {
        console.error("[api/generate] stream error", error);
        controller.enqueue(encoder.encode("__STREAM_ERROR__"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
