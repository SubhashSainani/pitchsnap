"use client";

import { useRef, useState } from "react";

import { Loader2, Save } from "lucide-react";
import { motion } from "framer-motion";

import { saveProfile } from "@/actions/profile";
import { useLazyReducedMotion } from "@/lib/useLazyReducedMotion";
import { staggerContainer, staggerItem } from "@/lib/motionVariants";
import type { Profile, Tone } from "@/types";

const TONES: readonly Tone[] = ["Professional", "Friendly", "Direct"];

type Ripple = { x: number; y: number; key: number };

type Props = {
  initialData: Profile;
};

export function ProfileForm({ initialData }: Props) {
  const [services, setServices] = useState(initialData.services);
  const [tone, setTone] = useState<Tone>(initialData.tone);
  const [targetClient, setTargetClient] = useState(initialData.target_client);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [ripple, setRipple] = useState<Ripple | null>(null);
  const rippleKey = useRef(0);

  const reducedMotion = useLazyReducedMotion();

  async function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setIsSaving(true);
    setError(null);
    setSaved(false);

    const result = await saveProfile({
      services,
      tone,
      target_client: targetClient,
    });

    if (result.success) {
      setSaved(true);
    } else {
      setError(result.error ?? "Failed to save profile. Please try again.");
    }
    setIsSaving(false);
  }

  function handleRipple(e: React.MouseEvent<HTMLButtonElement>): void {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    rippleKey.current += 1;
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, key: rippleKey.current });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p className="bg-error-light text-error-foreground text-sm rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {saved && (
        <p className="bg-success-light text-success-foreground text-sm rounded-lg px-3 py-2">
          Profile saved.
        </p>
      )}

      <motion.div
        className="flex flex-col gap-4"
        variants={staggerContainer}
        initial={reducedMotion ? "show" : "hidden"}
        animate="show"
      >
        <motion.div variants={staggerItem}>
          <label className="text-sm font-medium text-text-secondary mb-1 block">
            Services Offered
          </label>
          <textarea
            value={services}
            onChange={(event) => setServices(event.target.value)}
            placeholder="e.g. I build Shopify stores for DTC brands"
            className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent w-full min-h-24 resize-none"
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <label className="text-sm font-medium text-text-secondary mb-1 block">
            Target Client
          </label>
          <textarea
            value={targetClient}
            onChange={(event) => setTargetClient(event.target.value)}
            placeholder="e.g. Small e-commerce brands doing $1M-$5M in revenue (optional)"
            className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent w-full min-h-24 resize-none"
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <label className="text-sm font-medium text-text-secondary mb-1 block">
            Tone of Voice
          </label>
          <select
            value={tone}
            // HTMLSelectElement.value is always typed string by the DOM API;
            // the <option>s below render only TONES values, so this is safe.
            onChange={(event) => setTone(event.target.value as Tone)}
            className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent w-full"
          >
            {TONES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </motion.div>
      </motion.div>

      <motion.button
        type="submit"
        disabled={isSaving}
        onClick={handleRipple}
        whileHover={reducedMotion ? undefined : { scale: 1.02 }}
        whileTap={reducedMotion ? undefined : { scale: 0.98 }}
        className="relative overflow-hidden bg-accent hover:bg-accent-hover text-accent-foreground rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 shadow-[0_4px_20px_rgba(108,71,255,0.2)] hover:shadow-[0_4px_28px_rgba(108,71,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed self-start"
      >
        {ripple && (
          <motion.span
            key={ripple.key}
            initial={{ scale: 0, opacity: 0.3 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onAnimationComplete={() => setRipple(null)}
            aria-hidden
            style={{
              position: "absolute",
              left: ripple.x - 50,
              top: ripple.y - 50,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "white",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          {isSaving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </span>
      </motion.button>
    </form>
  );
}
