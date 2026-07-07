"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { useLazyReducedMotion } from "@/lib/useLazyReducedMotion";

const MotionLink = motion(Link);

export function CTAContent() {
  const reducedMotion = useLazyReducedMotion();

  return (
    <>
      {/* CTA glows — same permitted depth treatment as hero orbs */}
      <motion.div
        aria-hidden
        animate={reducedMotion ? undefined : { opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-accent opacity-10 blur-[80px]"
      />
      <motion.div
        aria-hidden
        animate={reducedMotion ? undefined : { opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-accent opacity-10 blur-[60px]"
      />

      {/* CTA content */}
      <div className="relative z-10">
        <div className="inline-flex items-center rounded-full border border-border bg-accent-light px-3 py-1 text-xs font-medium text-accent mb-6">
          No credit card required
        </div>

        <h2 className="text-3xl sm:text-5xl font-semibold leading-tight">
          <span className="text-text-primary block">
            Stop staring at a blank
          </span>
          <span className="bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end bg-clip-text text-transparent block">
            compose window
          </span>
        </h2>

        <p className="text-lg text-text-secondary max-w-xl mx-auto mt-4 leading-relaxed">
          Your next great cold email is one URL away. PitchSnap does the
          research, writes the pitch, and gets you to send in under 60
          seconds.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <MotionLink
            href="/login"
            whileHover={reducedMotion ? undefined : { scale: 1.03 }}
            whileTap={reducedMotion ? undefined : { scale: 0.97 }}
            className="inline-flex items-center justify-center rounded-full bg-accent hover:bg-accent-hover text-accent-foreground px-7 h-12 text-base font-medium transition-colors duration-150 shadow-[0_4px_20px_rgba(108,71,255,0.3)] hover:shadow-[0_4px_28px_rgba(108,71,255,0.6)]"
          >
            Start Free →
          </MotionLink>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center rounded-full border border-border bg-surface hover:bg-surface-secondary text-text-primary px-7 h-12 text-base font-medium transition-colors duration-150"
          >
            Try the demo
          </Link>
        </div>
      </div>
    </>
  );
}
