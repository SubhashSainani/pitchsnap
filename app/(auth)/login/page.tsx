import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginCard } from "@/components/auth/LoginCard";
import { LoginOrbs } from "@/components/auth/LoginOrbs";
import { createClient } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Sign in — PitchSnap",
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/generate");

  const { error } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-background">
      {/* Login page background orbs — permitted exception per ui-rules.md, page background depth only */}
      <LoginOrbs />
      <LoginCard error={error} />
    </main>
  );
}
