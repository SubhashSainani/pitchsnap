"use client";

import { useState } from "react";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { useLazyReducedMotion } from "@/lib/useLazyReducedMotion";

type Props = {
  plan: "standard" | "pro";
};

type CheckoutResponse =
  | { success: true; url: string; upgraded?: never }
  | { success: true; url: null; upgraded: true }
  | { success: false; error: string };

export function UpgradeButton({ plan }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reducedMotion = useLazyReducedMotion();

  async function handleClick(): Promise<void> {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const result: CheckoutResponse = await response.json();

      if (result.success) {
        window.location.href = result.url ?? "/generate?upgraded=true";
      } else {
        setError(result.error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("[UpgradeButton]", error);
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div>
      {error && (
        <p className="mb-2 bg-error-light text-error-foreground text-sm rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        whileHover={reducedMotion ? undefined : { scale: 1.02 }}
        whileTap={reducedMotion ? undefined : { scale: 0.98 }}
        className="h-11 w-full rounded-lg bg-accent hover:bg-accent-hover text-accent-foreground text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-150 shadow-[0_4px_20px_rgba(108,71,255,0.3)] hover:shadow-[0_4px_28px_rgba(108,71,255,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading && <Loader2 size={16} className="animate-spin" />}
        {isLoading
          ? "Redirecting..."
          : `Upgrade to ${plan === "standard" ? "Standard" : "Pro"}`}
      </motion.button>
    </div>
  );
}
