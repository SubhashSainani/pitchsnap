"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { useLazyReducedMotion } from "@/lib/useLazyReducedMotion";
import { staggerContainer, staggerItem } from "@/lib/motionVariants";

export default function NotFound() {
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
            Page not found
          </motion.h1>
          <motion.p
            variants={staggerItem}
            className="text-sm text-text-secondary"
          >
            The page you&apos;re looking for doesn&apos;t exist.
          </motion.p>
          <motion.div variants={staggerItem}>
            <Link
              href="/generate"
              className="bg-accent hover:bg-accent-hover text-accent-foreground rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150"
            >
              Back to Generate
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
