"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

import { useLazyReducedMotion } from "@/lib/useLazyReducedMotion";
import { staggerContainer, staggerItem } from "@/lib/motionVariants";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  const reducedMotion = useLazyReducedMotion();

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="bg-surface border border-border rounded-xl shadow-sm p-6 w-full max-w-sm text-center">
        <motion.div
          variants={staggerContainer}
          initial={reducedMotion ? "show" : "hidden"}
          animate="show"
          className="flex flex-col items-center gap-4"
        >
          <motion.h1
            variants={staggerItem}
            className="text-2xl font-bold text-text-primary"
          >
            Something went wrong
          </motion.h1>
          <motion.p
            variants={staggerItem}
            className="text-sm text-text-secondary"
          >
            An unexpected error occurred. Please try again.
          </motion.p>
          <motion.button
            variants={staggerItem}
            type="button"
            onClick={reset}
            className="bg-error-light text-error-foreground hover:bg-error rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150"
          >
            Try again
          </motion.button>
        </motion.div>
      </div>
    </main>
  );
}
