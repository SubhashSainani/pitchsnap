"use client";

import { useLazyReducedMotion } from "@/lib/useLazyReducedMotion";
import { motion } from "framer-motion";

export function LoginOrbs() {
  const reducedMotion = useLazyReducedMotion();

  return (
    <>
      <motion.div
        aria-hidden
        animate={reducedMotion ? undefined : { x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -z-10 -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-accent opacity-[0.13] blur-3xl pointer-events-none"
      />
      <motion.div
        aria-hidden
        animate={reducedMotion ? undefined : { x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -z-10 -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-accent-light opacity-55 blur-3xl pointer-events-none"
      />
    </>
  );
}
