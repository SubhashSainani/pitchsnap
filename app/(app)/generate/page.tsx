import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PitchForm } from "@/components/pitch/PitchForm";
import { createClient } from "@/lib/supabase-server";
import { isTone, isPlan, type Profile, type UsageInfo } from "@/types";

export const metadata: Metadata = {
  title: "Generate Pitch — PitchSnap",
};

type Props = {
  searchParams: Promise<{ error?: string; upgraded?: string }>;
};

export default async function GeneratePage({ searchParams }: Props) {
  const { error, upgraded } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profileRow } = await supabase
    .from("profiles")
    .select(
      "full_name, services, tone, target_client, plan, pitches_this_month, stripe_customer_id, stripe_subscription_id, subscription_status, cancel_at"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  const profile: Profile | null = profileRow
    ? {
        full_name: profileRow.full_name ?? "",
        services: profileRow.services,
        tone: isTone(profileRow.tone) ? profileRow.tone : "Professional",
        target_client: profileRow.target_client,
      }
    : null;

  const usage: UsageInfo = {
    plan: isPlan(profileRow?.plan) ? profileRow.plan : "free",
    pitches_this_month: profileRow?.pitches_this_month ?? 0,
    stripe_customer_id: profileRow?.stripe_customer_id ?? null,
    stripe_subscription_id: profileRow?.stripe_subscription_id ?? null,
    subscription_status: profileRow?.subscription_status ?? null,
    cancel_at: profileRow?.cancel_at ?? null,
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          Generate
        </h1>

        {error && (
          <p className="mt-4 bg-error-light text-error-foreground text-sm rounded-lg px-3 py-2">
            Something went wrong signing you out. Please try again.
          </p>
        )}

        {upgraded === "true" && (
          <p className="mt-4 bg-success-light text-success-foreground text-sm rounded-lg px-3 py-2">
            You&apos;re all set! Your plan has been upgraded.
          </p>
        )}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-5">
          <PitchForm profile={profile} usage={usage} />
        </div>
      </div>
    </main>
  );
}
