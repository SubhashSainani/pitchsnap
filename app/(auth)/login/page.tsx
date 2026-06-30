import { redirect } from "next/navigation";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { createClient } from "@/lib/supabase-server";

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
    <main className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="bg-surface border border-border rounded-xl shadow-sm p-6 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          PitchSnap
        </h1>
        <p className="text-sm text-text-secondary mb-6">
          Sign in to start generating personalized cold emails.
        </p>
        {error && (
          <p className="bg-error-light text-error-foreground text-sm rounded-lg px-3 py-2 mb-4">
            Something went wrong signing you in. Please try again.
          </p>
        )}
        <GoogleSignInButton />
      </div>
    </main>
  );
}
