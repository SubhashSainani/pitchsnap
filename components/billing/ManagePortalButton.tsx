"use client";

import { useState } from "react";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { useLazyReducedMotion } from "@/lib/useLazyReducedMotion";

type PortalResponse =
  | { success: true; url: string }
  | { success: false; error: string };

export function ManagePortalButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reducedMotion = useLazyReducedMotion();

  async function handleClick(): Promise<void> {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/billing-portal", {
        method: "POST",
      });
      const result: PortalResponse = await response.json();

      if (result.success) {
        window.location.href = result.url;
      } else {
        setError(result.error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("[ManagePortalButton]", error);
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
        className="h-9 px-4 rounded-lg bg-surface border border-border hover:bg-surface-secondary text-text-primary text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading && <Loader2 size={16} className="animate-spin" />}
        {isLoading ? "Redirecting..." : "Manage subscription"}
      </motion.button>
    </div>
  );
}
