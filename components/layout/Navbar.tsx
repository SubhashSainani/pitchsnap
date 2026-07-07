"use client";

import { useLazyReducedMotion } from "@/lib/useLazyReducedMotion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

import { signOut } from "@/actions/auth";
import type { Plan } from "@/types";

const NAV_LINKS = [
  { href: "/generate", label: "Generate" },
  { href: "/history", label: "History" },
  { href: "/profile", label: "Profile" },
  { href: "/pricing", label: "Pricing" },
];

type Props = {
  plan: Plan | null;
  cancelAt: string | null;
};

export function Navbar({ plan, cancelAt }: Props) {
  const pathname = usePathname();
  // Lazy-read (not a post-mount useEffect, unlike BrowserDemo.tsx's check)
  // so a user with the OS preference set never sees the slide-down play once
  // before settling — framer-motion's `initial` prop only takes effect on
  // the very first commit, so by the time an effect could flip a state flag
  // it would be too late to skip the entrance animation. This intentionally
  // diverges from the server render (window is unavailable there), which is
  // an accepted, benign hydration mismatch for a client-only media query —
  // `suppressHydrationWarning` covers it since `motion.header` is the only
  // element here whose first-render output actually depends on this value.
  const reducedMotion = useLazyReducedMotion();

  return (
    <motion.header
      suppressHydrationWarning
      initial={reducedMotion ? false : { y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-16 w-full bg-surface border-b border-border px-6"
    >
      <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between">
        <Link href="/generate" className="flex items-center gap-2">
          <motion.div
            whileHover={reducedMotion ? undefined : { scale: 1.08 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              background:
                "linear-gradient(45deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)",
            }}
          >
            <Zap className="size-5 text-accent-foreground" />
          </motion.div>
          <span className="font-bold text-text-primary">PitchSnap</span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-1.5 text-sm font-medium"
              >
                {isActive && (
                  <motion.span
                    layoutId="navPill"
                    className="absolute inset-0 bg-surface-secondary rounded-lg"
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 380, damping: 30 }
                    }
                  />
                )}
                <span
                  className={
                    isActive
                      ? "relative text-text-primary transition-colors duration-150"
                      : "relative text-text-secondary transition-colors duration-150"
                  }
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {plan && (
            <span
              className={`flex items-center ${
                cancelAt
                  ? "bg-warning-light text-warning-foreground"
                  : "bg-surface-secondary text-text-secondary"
              } text-xs font-medium rounded-full px-2.5 py-1`}
            >
              {(plan === "standard" || plan === "pro") && !cancelAt && (
                <span className="w-2 h-2 rounded-full bg-success mr-1.5" />
              )}
              {plan.charAt(0).toUpperCase() + plan.slice(1)}
              {cancelAt ? " · Canceling" : ""}
            </span>
          )}
          <form action={signOut}>
            <button
              type="submit"
              className="text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded-lg px-3 py-1.5 text-sm transition-colors duration-150"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </motion.header>
  );
}
