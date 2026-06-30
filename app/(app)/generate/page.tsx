import Link from "next/link";
import { redirect } from "next/navigation";

import { PitchForm } from "@/components/pitch/PitchForm";
import { createClient } from "@/lib/supabase-server";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function GeneratePage({ searchParams }: Props) {
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("services")
    .eq("user_id", user.id)
    .maybeSingle();
  const isProfileIncomplete = !profile || !profile.services?.trim();

  return (
    <main className="max-w-[1280px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Generate</h1>
      {error && (
        <p className="bg-error-light text-error-foreground text-sm rounded-lg px-3 py-2 mb-4">
          Something went wrong signing you out. Please try again.
        </p>
      )}
      {isProfileIncomplete && (
        <p className="bg-warning-light text-warning-foreground text-sm rounded-lg px-3 py-2 mb-4">
          Complete your profile to get personalised pitches —{" "}
          <Link href="/profile" className="font-medium underline text-warning-foreground">
            add your services to get started.
          </Link>
        </p>
      )}
      <div className="max-w-2xl">
        <PitchForm />
      </div>
    </main>
  );
}
