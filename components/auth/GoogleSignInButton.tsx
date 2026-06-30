"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase-client";

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleSignIn(): Promise<void> {
    try {
      setHasError(false);
      setIsLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("[GoogleSignInButton]", error);
      setHasError(true);
      setIsLoading(false);
    }
  }

  return (
    <>
      {hasError && (
        <p className="bg-error-light text-error-foreground text-sm rounded-lg px-3 py-2 mb-4">
          Something went wrong signing you in. Please try again.
        </p>
      )}
      <button
        type="button"
        onClick={handleSignIn}
        disabled={isLoading}
        className="w-full bg-accent hover:bg-accent-hover text-accent-foreground rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Redirecting..." : "Continue with Google"}
      </button>
    </>
  );
}
