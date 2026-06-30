import { redirect } from "next/navigation";

import { ProfileForm } from "@/components/profile/ProfileForm";
import { createClient } from "@/lib/supabase-server";
import { isTone, type Profile } from "@/types";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("services, tone, target_client")
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

  return (
    <main className="max-w-[1280px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Profile</h1>
      <div className="bg-surface border border-border rounded-xl shadow-sm p-6 max-w-lg">
        <ProfileForm initialData={initialData} />
      </div>
    </main>
  );
}
