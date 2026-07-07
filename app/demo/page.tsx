import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { Lock, Sparkles, Zap } from "lucide-react";

import { DemoForm } from "@/components/demo/DemoForm";
import { DEMO_COOKIE_NAME, getClientIp } from "@/lib/demo";
import { createAdminClient } from "@/lib/supabase-admin";

export const metadata: Metadata = {
  title: "Try PitchSnap Free — AI Cold Email Generator",
};

export default async function DemoPage() {
  const cookieStore = await cookies();
  const headersList = await headers();

  const cookieId = cookieStore.get(DEMO_COOKIE_NAME)?.value ?? null;
  const ipAddress = getClientIp(headersList);

  let demoUsed = false;
  if (cookieId) {
    const supabase = createAdminClient();
    const { data: existingUsage } = await supabase
      .from("demo_usage")
      .select("id")
      .eq("ip_address", ipAddress)
      .eq("cookie_id", cookieId)
      .maybeSingle();
    demoUsed = Boolean(existingUsage);
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero strip */}
      <section className="py-12 text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <span className="inline-flex items-center rounded-full border border-border bg-surface-secondary text-text-muted text-xs px-3 py-1">
            Try it free — no signup required
          </span>
          <h1 className="mt-4 text-3xl font-bold bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end bg-clip-text text-transparent">
            See PitchSnap write your pitch in real time
          </h1>
          <p className="mt-3 text-text-secondary text-base max-w-lg mx-auto">
            Paste any company URL. We&apos;ll research their site and craft a
            personalized cold email in seconds.
          </p>
          <div className="flex flex-wrap gap-6 justify-center mt-6">
            <span className="flex items-center gap-1.5 text-text-muted text-sm">
              <Zap size={14} />
              Under 10 seconds
            </span>
            <span className="flex items-center gap-1.5 text-text-muted text-sm">
              <Sparkles size={14} />
              Real AI generation
            </span>
            <span className="flex items-center gap-1.5 text-text-muted text-sm">
              <Lock size={14} />
              No credit card needed
            </span>
          </div>
        </div>
      </section>

      {/* Form section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <DemoForm demoUsed={demoUsed} />
      </div>
    </main>
  );
}
