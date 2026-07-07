"use client";

import { Check, Zap } from "lucide-react";
import { motion } from "framer-motion";

import { ManagePortalButton } from "@/components/billing/ManagePortalButton";
import { UpgradeButton } from "@/components/billing/UpgradeButton";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useLazyReducedMotion } from "@/lib/useLazyReducedMotion";
import { panelTransition } from "@/lib/motionVariants";
import { formatDate } from "@/lib/utils";
import type { Profile } from "@/types";

type Props = {
  initialData: Profile;
  plan: string;
  cancelAt: string | null;
};

const PLAN_FEATURES: Record<string, string[]> = {
  free: ["5 pitches per month", "Basic tone options", "30-day email history"],
  standard: ["50 pitches per month", "Priority generation", "Email support"],
  pro: ["Unlimited pitches", "All premium tones", "Priority support"],
};

const PRO_FEATURES = [
  "Unlimited pitches",
  "All premium tones",
  "Custom templates",
  "Priority support",
];

export function ProfileLayout({ initialData, plan, cancelAt }: Props) {
  const reducedMotion = useLazyReducedMotion();

  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);
  const currentFeatures = PLAN_FEATURES[plan] ?? PLAN_FEATURES.free;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Left — profile form */}
      <motion.div
        className="lg:col-span-3 bg-surface border border-border rounded-xl shadow-sm p-6"
        initial={reducedMotion ? false : { opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={panelTransition}
      >
        <h2 className="text-base font-semibold text-text-primary">
          Your Pitch Profile
        </h2>
        <p className="mt-1 mb-5 text-sm text-text-secondary">
          This context is used to personalize every generated email.
        </p>
        <ProfileForm initialData={initialData} />
      </motion.div>

      {/* Right — plan info */}
      <motion.div
        className="lg:col-span-2 flex flex-col gap-4"
        initial={reducedMotion ? false : { opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={panelTransition}
      >
        {/* Current plan card */}
        <div className="bg-surface border border-border rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-primary">
              Current Plan
            </h2>
            <span className="bg-surface-secondary text-text-secondary text-xs font-medium rounded-full px-2.5 py-1">
              {planLabel}
            </span>
          </div>

          {cancelAt && (
            <p className="text-xs text-warning-foreground mb-3">
              Plan ends {formatDate(cancelAt)} · reverts to Free.
            </p>
          )}

          <ul className="flex flex-col gap-2">
            {currentFeatures.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-text-secondary">
                <Check size={14} className="text-accent shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          {plan !== "free" && (
            <div className="mt-4 pt-4 border-t border-border">
              <ManagePortalButton />
            </div>
          )}
        </div>

        {/* Pro upgrade card — hidden when already on Pro */}
        {plan !== "pro" && (
          <div className="bg-accent-light rounded-xl p-5 relative overflow-hidden">
            {/* Subtle glow */}
            <div
              aria-hidden
              className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] pointer-events-none opacity-20"
              style={{ background: "rgba(108,71,255,1)" }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="size-7 rounded-lg bg-accent flex items-center justify-center">
                  <Zap size={14} className="text-accent-foreground" />
                </div>
                <span className="text-sm font-semibold text-text-primary">
                  PitchSnap Pro
                </span>
              </div>

              <p className="text-2xl font-semibold text-text-primary">
                $25
                <span className="text-sm font-normal text-text-secondary ml-1">
                  /month
                </span>
              </p>

              <div className="mt-3">
                <UpgradeButton plan="pro" />
              </div>

              <ul className="mt-4 flex flex-col gap-2">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs text-text-secondary">
                    <Check size={12} className="text-accent shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
