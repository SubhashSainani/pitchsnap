"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="bg-surface border border-border rounded-xl shadow-sm p-6 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-text-secondary mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="bg-error-light text-error-foreground hover:bg-error rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
