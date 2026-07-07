"use client";

import { Zap } from "lucide-react";
import { motion } from "framer-motion";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { useLazyReducedMotion } from "@/lib/useLazyReducedMotion";
import { staggerContainer, staggerItem } from "@/lib/motionVariants";

type Props = {
  error?: string;
};

const container = staggerContainer;
const item = staggerItem;

// Icon pulse glow resting/peak values from ui-tokens.md's Glow & Shadow
// Reference, animated as a boxShadow keyframe rather than the generic
// Pulsing glow pattern's `opacity` tween — fading the logo mark itself
// out to 30% would read as flickering, not glowing; breathing the
// shadow's intensity between the two documented alpha values is what
// "pulsing glow" actually means for a solid icon mark like this one.
const PULSE_BOX_SHADOW = [
  "0 8px 20px rgba(108, 71, 255, 0.3)",
  "0 8px 20px rgba(108, 71, 255, 0.7)",
  "0 8px 20px rgba(108, 71, 255, 0.3)",
];

export function LoginCard({ error }: Props) {
  const reducedMotion = useLazyReducedMotion();

  return (
    <motion.div
      variants={container}
      initial={reducedMotion ? "show" : "hidden"}
      animate="show"
      className="max-w-sm w-full mx-auto relative z-10 bg-[rgba(25,25,35,0.6)] border border-[rgba(255,255,255,0.08)] backdrop-blur-[12px] p-8 rounded-2xl shadow-[0_20px_50px_rgba(108,71,255,0.1)] flex flex-col items-center text-center"
    >
      <motion.div variants={item}>
        <motion.div
          animate={
            reducedMotion ? undefined : { boxShadow: PULSE_BOX_SHADOW }
          }
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="size-12 rounded-xl bg-accent flex items-center justify-center shadow-[0_8px_20px_rgba(108,71,255,0.3)]"
        >
          <Zap className="size-6 text-accent-foreground" />
        </motion.div>
      </motion.div>

      <motion.h1
        variants={item}
        className="mt-6 text-2xl font-semibold tracking-tight text-text-primary text-balance"
      >
        Welcome to PitchSnap
      </motion.h1>
      <motion.p
        variants={item}
        className="mt-2 text-sm text-text-secondary leading-relaxed"
      >
        Sign in to start generating personalized cold emails
      </motion.p>

      {error && (
        <motion.p
          variants={item}
          className="mt-4 bg-error-light text-error-foreground text-sm rounded-lg px-3 py-2"
        >
          Something went wrong signing you in. Please try again.
        </motion.p>
      )}

      <motion.div variants={item} className="mt-8 w-full">
        <GoogleSignInButton />
      </motion.div>

      <motion.p variants={item} className="mt-5 text-xs text-text-muted">
        No credit card required · Free to start
      </motion.p>
    </motion.div>
  );
}
