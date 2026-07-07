import type { Metadata } from "next";

import { PricingCards } from "@/components/billing/PricingCards";
import { createClient } from "@/lib/supabase-server";
import { isPlan } from "@/types";

export const metadata: Metadata = {
  title: "Pricing — PitchSnap",
};

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currentPlan = null;
  if (user) {
    const { data: profileRow } = await supabase
      .from("profiles")
      .select("plan")
      .eq("user_id", user.id)
      .maybeSingle();
    currentPlan = isPlan(profileRow?.plan) ? profileRow.plan : "free";
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary">
            Simple, transparent pricing
          </h1>
          <p className="mt-3 text-lg text-text-secondary">
            Start free. Upgrade when you need more pitches.
          </p>
        </div>

        <PricingCards currentPlan={currentPlan} isLoggedIn={Boolean(user)} />
      </div>
    </main>
  );
}
