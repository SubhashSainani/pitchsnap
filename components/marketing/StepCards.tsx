"use client";

import { UserCircle, Link as LinkIcon, Mail } from "lucide-react";
import { motion } from "framer-motion";

import { useLazyReducedMotion } from "@/lib/useLazyReducedMotion";
import { staggerContainer, staggerItem } from "@/lib/motionVariants";

const STEPS = [
  {
    icon: UserCircle,
    label: "STEP 1",
    title: "Set up your profile",
    description:
      "Describe your services, pick a tone, and tell us who your ideal client is. PitchSnap uses this as the foundation of every email it writes.",
  },
  {
    icon: LinkIcon,
    label: "STEP 2",
    title: "Paste a URL",
    description:
      "Drop in any prospect's website. PitchSnap reads it, understands what they do, and uses real details — no guessing, no generic filler.",
  },
  {
    icon: Mail,
    label: "STEP 3",
    title: "Get your email",
    description:
      "A fully personalized cold email lands in seconds. Review it, edit if you like, copy, and send. Done.",
  },
];

const container = staggerContainer;
const item = staggerItem;

export function StepCards() {
  const reducedMotion = useLazyReducedMotion();

  return (
    <motion.ol
      variants={container}
      initial={reducedMotion ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true }}
      className="grid md:grid-cols-3 gap-6"
    >
      {STEPS.map((step) => {
        const Icon = step.icon;
        return (
          // interactive card — hover lift intentional
          <motion.li
            key={step.label}
            variants={item}
            whileHover={reducedMotion ? undefined : { y: -4 }}
            className="h-full rounded-2xl border border-border bg-surface p-8 hover:shadow-[0_8px_30px_rgba(108,71,255,0.1)] transition-shadow duration-300"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light">
              <Icon className="h-6 w-6 text-accent" />
            </div>
            <p className="mb-2 text-sm font-semibold text-accent uppercase tracking-wider">
              {step.label}
            </p>
            <h3 className="mb-3 text-xl font-semibold text-text-primary">
              {step.title}
            </h3>
            <p className="text-text-secondary leading-relaxed text-sm">
              {step.description}
            </p>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}
