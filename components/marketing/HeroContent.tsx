"use client";

import Link from "next/link";
import { Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";

import { useLazyReducedMotion } from "@/lib/useLazyReducedMotion";
import { staggerContainer, staggerItem } from "@/lib/motionVariants";

const container = staggerContainer;
const item = staggerItem;
const MotionLink = motion(Link);

export function HeroContent() {
  const reducedMotion = useLazyReducedMotion();

  return (
    <motion.div
      variants={container}
      initial={reducedMotion ? "show" : "hidden"}
      animate="show"
      className="flex flex-col items-center text-center lg:items-start lg:text-left"
    >
      {/* Eyebrow badge */}
      <motion.div
        variants={item}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 backdrop-blur-sm px-4 py-2 text-sm font-medium text-text-secondary shadow-sm"
      >
        <Sparkles className="h-4 w-4 text-accent" />
        AI cold emails that actually get replies
      </motion.div>

      {/* H1 */}
      <motion.h1
        variants={item}
        className="mt-6 text-5xl sm:text-6xl font-semibold leading-[1.05] tracking-tight"
      >
        <span className="inline-block bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end bg-clip-text text-transparent">
          Cold emails,
        </span>
        <span className="block text-text-primary"> written in a snap.</span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        variants={item}
        className="mt-6 text-lg leading-relaxed text-text-secondary max-w-lg"
      >
        PitchSnap reads your prospect&apos;s website and writes a
        personalized pitch in seconds — no templates, no generic openers, no
        blank-page dread.
      </motion.p>

      {/* Button row */}
      <motion.div
        variants={item}
        className="mt-8 flex flex-col sm:flex-row gap-4"
      >
        <MotionLink
          href="/login"
          whileHover={reducedMotion ? undefined : { scale: 1.03 }}
          whileTap={reducedMotion ? undefined : { scale: 0.97 }}
          className="inline-flex items-center justify-center rounded-full bg-accent hover:bg-accent-hover text-accent-foreground px-7 h-12 text-base font-medium transition-colors duration-150 shadow-[0_4px_20px_rgba(108,71,255,0.3)] hover:shadow-[0_4px_28px_rgba(108,71,255,0.6)]"
        >
          Start Free →
        </MotionLink>
        <Link
          href="#how-it-works"
          className="inline-flex items-center justify-center rounded-full bg-transparent hover:bg-accent-light text-text-primary px-7 h-12 text-base font-medium transition-colors duration-150"
        >
          See how it works
        </Link>
      </motion.div>

      {/* Social proof */}
      <motion.div
        variants={item}
        className="mt-8 flex flex-col sm:flex-row items-center gap-3"
      >
        {/* Avatar stack + star rating — decorative only, not tied to brand
            tokens. Sanctioned exception per the original design brief,
            reconfirmed under the dark theme token system (Session 17):
            these stay Tailwind's built-in rose/emerald/amber scale. */}
        <div className="flex" aria-hidden>
          <div className="h-8 w-8 rounded-full bg-rose-400 ring-2 ring-surface" />
          <div className="h-8 w-8 rounded-full bg-emerald-400 ring-2 ring-surface -ml-2" />
          <div className="h-8 w-8 rounded-full bg-accent ring-2 ring-surface -ml-2" />
          <div className="h-8 w-8 rounded-full bg-amber-400 ring-2 ring-surface -ml-2" />
        </div>
        <div className="flex items-center gap-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <p className="text-sm text-text-secondary">
          Loved by{" "}
          <span className="font-semibold text-text-primary">3,000+</span>{" "}
          founders
        </p>
      </motion.div>
    </motion.div>
  );
}
