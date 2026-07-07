import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PitchHistoryList } from "@/components/pitch/PitchHistoryList";
import { createClient } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Pitch History — PitchSnap",
};

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: pitches, error } = await supabase
    .from("pitches")
    .select("id, prospect_url, prospect_summary, email_content, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[app/history]", error);
  }

  return (
    <main className="max-w-[1280px] mx-auto px-6 py-8">
      {error ? (
        <>
          <h1 className="text-2xl font-bold text-text-primary mb-6">History</h1>
          <p className="bg-error-light text-error-foreground text-sm rounded-lg px-3 py-2">
            Something went wrong loading your pitch history. Please refresh and try again.
          </p>
        </>
      ) : (
        <PitchHistoryList pitches={pitches ?? []} />
      )}
    </main>
  );
}
