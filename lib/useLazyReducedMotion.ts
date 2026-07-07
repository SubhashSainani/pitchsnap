"use client";

import { useState } from "react";

// Reads prefers-reduced-motion synchronously via a lazy useState initializer
// rather than a post-mount useEffect, so the value is known before framer-motion
// commits any `initial` prop on first render. This technique only applies to
// components that gate a `motion` element's `initial`/`whileHover` props; for
// imperative animation loops (like BrowserDemo.tsx's phase-loop) a plain
// useEffect check after mount is still the right approach. See ui-rules.md's
// Motion Patterns section for the full decision tree.
export function useLazyReducedMotion(): boolean {
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  return reducedMotion;
}
