// Standard reusable animation variants per ui-rules.md's Motion Patterns section.
// Import from here — never re-declare inline.

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
} as const;

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
} as const;

// Shared transition for two-column panel slide-in (Generate + Profile pages).
// 0.4s easeOut — snappy but not harsh for a page-level entrance.
export const panelTransition = {
  duration: 0.4,
  ease: "easeOut" as const,
} as const;

// Tighter stagger for small inline elements (badges, chips) — 0.06s instead
// of 0.08s so clusters of 3–6 elements don't feel sluggish.
export const badgeContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
} as const;

// Overshoot spring for badges — pops in from small scale per ui-rules.md's
// Overshoot spring pattern. Transition is defined here (not on the parent
// container) so each badge uses its own spring rather than a tween.
export const badgeItem = {
  hidden: { opacity: 0, scale: 0.6 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 400, damping: 10 },
  },
} as const;
