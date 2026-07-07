import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ProfileLayout } from "@/components/profile/ProfileLayout";
import { createClient } from "@/lib/supabase-server";
import { isPlan, isTone, type Profile } from "@/types";

export const metadata: Metadata = {
  title: "Profile — PitchSnap",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("services, tone, target_client, plan, cancel_at")
    .eq("user_id", user.id)
    .maybeSingle();
  if (profileError) {
    console.error("[app/profile]", profileError);
  }

  const initialData: Profile = {
    services: profile?.services ?? "",
    tone: isTone(profile?.tone) ? profile.tone : "Professional",
    target_client: profile?.target_client ?? "",
  };

  const plan = isPlan(profile?.plan) ? profile.plan : "free";
  const cancelAt: string | null = profile?.cancel_at ?? null;

  return (
    <main className="max-w-[1280px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-text-primary">Profile &amp; Settings</h1>
      <p className="mt-1 mb-6 text-sm text-text-secondary">
        Manage your pitch tone, services, and billing.
      </p>
      <ProfileLayout initialData={initialData} plan={plan} cancelAt={cancelAt} />
    </main>
  );
}
