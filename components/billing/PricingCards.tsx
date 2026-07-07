"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

import { UpgradeButton } from "@/components/billing/UpgradeButton";
import { useLazyReducedMotion } from "@/lib/useLazyReducedMotion";
import { staggerItem } from "@/lib/motionVariants";
import type { Plan } from "@/types";

type PlanCard = {
  id: Plan;
  name: string;
  price: string;
  pitchesLabel: string;
  features: string[];
};

const PLAN_CARDS: PlanCard[] = [
  {
    id: "free",
    name: "Free",
    price: "$0/month",
    pitchesLabel: "5 pitches per month",
    features: [
      "AI-powered personalization",
      "Company research",
      "Email history",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: "$10/month",
    pitchesLabel: "50 pitches per month",
    features: [
      "AI-powered personalization",
      "Company research",
      "Email history",
      "Priority generation",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$25/month",
    pitchesLabel: "Unlimited pitches",
    features: [
      "AI-powered personalization",
      "Company research",
      "Email history",
      "Priority generation",
      "Email support",
      "Unlimited generations",
      "Priority support",
    ],
  },
];

const cardContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const CARD_HOVER_TRANSITION = {
  type: "spring" as const,
  stiffness: 300,
  damping: 20,
};

type Props = {
  currentPlan: Plan | null;
  isLoggedIn: boolean;
};

export function PricingCards({ currentPlan, isLoggedIn }: Props) {
  const reducedMotion = useLazyReducedMotion();

  return (
    <motion.div
      className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
      variants={cardContainer}
      initial={reducedMotion ? "show" : "hidden"}
      animate="show"
    >
      {PLAN_CARDS.map((card) => {
        const isCurrentPlan = currentPlan === card.id;
        const isPro = card.id === "pro";

        return (
          <motion.div
            key={card.id}
            variants={staggerItem}
            whileHover={
              reducedMotion
                ? undefined
                : {
                    y: isPro ? -6 : -4,
                    boxShadow: "0 20px 40px rgba(108,71,255,0.1)",
                  }
            }
            transition={CARD_HOVER_TRANSITION}
            className={
              isPro
                ? "relative bg-accent-light rounded-2xl p-8 shadow-[0_0_40px_rgba(108,71,255,0.1)] flex flex-col"
                : "relative bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col"
            }
          >
            {/* Pro card pulsing glow blob — contained in its own overflow-hidden
                wrapper so the outer card stays unclipped (preserving the -top-3 badge). */}
            {isPro && (
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <motion.div
                  aria-hidden
                  className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[60px]"
                  style={{ background: "rgba(108,71,255,1)" }}
                  animate={
                    reducedMotion ? undefined : { opacity: [0.15, 0.25, 0.15] }
                  }
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            )}

            {isPro && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-medium rounded-full px-3 py-1">
                Best value
              </span>
            )}

            <div className="relative z-10 flex flex-col flex-1">
              <h2 className="text-xl font-semibold text-text-primary">
                {card.name}
              </h2>
              <p className="mt-2 text-3xl font-semibold text-text-primary">
                {card.price}
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                {card.pitchesLabel}
              </p>

              <ul className="mt-6 flex flex-col gap-2.5 flex-1">
                {card.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-text-primary"
                  >
                    <Check size={16} className="text-accent shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {isCurrentPlan ? (
                  <button
                    type="button"
                    disabled
                    className="h-11 w-full rounded-lg bg-surface-secondary text-text-muted text-sm font-medium disabled:cursor-not-allowed"
                  >
                    Current plan
                  </button>
                ) : card.id === "free" ? (
                  isLoggedIn ? null : (
                    <button
                      type="button"
                      disabled
                      className="h-11 w-full rounded-lg bg-surface-secondary text-text-muted text-sm font-medium disabled:cursor-not-allowed"
                    >
                      Current plan
                    </button>
                  )
                ) : isLoggedIn ? (
                  <UpgradeButton plan={card.id} />
                ) : (
                  <Link
                    href="/login"
                    className="h-11 w-full rounded-lg bg-accent hover:bg-accent-hover text-accent-foreground text-sm font-medium flex items-center justify-center transition-colors duration-150"
                  >
                    Upgrade to {card.name}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
