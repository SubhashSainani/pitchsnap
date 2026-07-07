"use client";

import { useState } from "react";
import { flushSync } from "react-dom";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, Loader2, Pencil, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";

import { PitchOutput } from "@/components/pitch/PitchOutput";
import { formatDate, PLAN_LIMITS } from "@/lib/utils";
import { useLazyReducedMotion } from "@/lib/useLazyReducedMotion";
import { badgeContainer, badgeItem, panelTransition } from "@/lib/motionVariants";
import type { Pitch, Profile, UsageInfo } from "@/types";

type Props = {
  profile: Profile | null;
  usage: UsageInfo;
};

// Stable reference — new array on every render would restart the shimmer loop.
const SHIMMER_X: [string, string] = ["-100%", "100%"];

export function PitchForm({ profile, usage }: Props) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [pitch, setPitch] = useState<Pitch | null>(null);
  const [subjectLines, setSubjectLines] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reducedMotion = useLazyReducedMotion();

  async function generate(targetUrl: string): Promise<void> {
    setIsLoading(true);
    setError(null);
    setSubjectLines([]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (!response.ok) {
        // Error responses from this API always have { error: string }
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        if (chunk.includes("__STREAM_ERROR__")) {
          throw new Error("Generation failed");
        }

        if (chunk.includes("__METADATA__")) {
          const metaMatch = chunk.match(/__METADATA__({.*})/);
          if (metaMatch) {
            try {
              const meta = JSON.parse(metaMatch[1]) as { subjectLines?: string[] };
              setSubjectLines(meta.subjectLines ?? []);
            } catch {}
          }
          // Remove the metadata trailer from displayed text
          const cleanChunk = chunk.replace(/__METADATA__.*/, "").trim();
          if (cleanChunk) {
            fullText += cleanChunk;
          }
          continue;
        }

        fullText += chunk;

        // flushSync bypasses React 18's automatic batching so each chunk
        // renders immediately rather than being coalesced into one update
        // at the end of the loop.
        flushSync(() => {
          setPitch({
            id: "streaming",
            prospect_url: targetUrl,
            prospect_summary: "",
            email_content: fullText,
            created_at: new Date().toISOString(),
          });
        });
      }

      // A single server enqueue() is not guaranteed to arrive as a single
      // browser read() — proxies/edge runtimes can re-chunk. Check the fully
      // assembled fullText for sentinels that may have been split across reads.
      if (fullText.includes("__STREAM_ERROR__")) {
        throw new Error("Generation failed");
      }

      // If __METADATA__ was split, it will be embedded in fullText rather than
      // having been stripped per-chunk. Extract and remove it now.
      const metaIndex = fullText.indexOf("__METADATA__");
      if (metaIndex !== -1 && subjectLines.length === 0) {
        const jsonStr = fullText.slice(metaIndex + "__METADATA__".length);
        try {
          const meta = JSON.parse(jsonStr) as { subjectLines?: string[] };
          setSubjectLines(meta.subjectLines ?? []);
        } catch {}
        fullText = fullText.slice(0, metaIndex).trimEnd();
      }

      // Strip SUBJECT_LINES/EMAIL markers from the final displayed content.
      // Gemini streams the full structured response; we only show the email body.
      const emailMatch = fullText.match(/EMAIL:\n([\s\S]*)/);
      const displayContent = emailMatch ? emailMatch[1].trim() : fullText.trim();
      setPitch((prev) =>
        prev ? { ...prev, email_content: displayContent } : null,
      );

      router.refresh();
    } catch (err) {
      console.error("[PitchForm]", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>): void {
    formEvent.preventDefault();
    if (!url.trim()) return;
    void generate(url.trim());
  }

  function handleRegenerate(): void {
    if (!pitch || limitReached) return;
    void generate(pitch.prospect_url);
  }

  const isProfileIncomplete = !profile || !profile.services?.trim();
  const planLimit = PLAN_LIMITS[usage.plan];
  const limitReached = usage.pitches_this_month >= planLimit;
  const pitchesLeft = planLimit - usage.pitches_this_month;
  const progressPercent = Math.min(
    (usage.pitches_this_month / planLimit) * 100,
    100
  );
  const serviceBadges = profile?.services
    ? (() => {
        const segments = profile.services
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        return segments.every((s) => s.length < 25)
          ? segments
          : [profile.services.trim()];
      })()
    : [];

  return (
    <>
      <motion.div
        className="lg:col-span-2 flex flex-col gap-5"
        initial={reducedMotion ? false : { opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={panelTransition}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-4"
        >
          {error && (
            <p className="bg-error-light text-error-foreground text-sm rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div>
            <label className="text-sm font-medium text-text-primary">
              Prospect website URL
            </label>
            <div className="relative mt-2">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
              <input
                type="text"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://example.com"
                disabled={isLoading}
                className="h-11 w-full rounded-lg border border-border bg-background text-text-primary placeholder:text-text-muted pl-10 pr-3 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {usage.cancel_at && (
            <p className="mt-4 bg-warning-light text-warning-foreground rounded-lg px-3 py-2 text-xs">
              Your {usage.plan} plan ends {formatDate(usage.cancel_at)} —{" "}
              <Link href="/pricing" className="font-medium underline">
                renew now
              </Link>
            </p>
          )}

          {usage.plan !== "pro" && (
            <div className="mt-4">
              <div className="flex justify-between">
                <span className="text-xs text-text-secondary">
                  {usage.pitches_this_month} of {planLimit}{" "}
                  {usage.plan === "free" ? "free " : ""}pitches used this
                  month
                </span>
                {!limitReached && (
                  <span className="text-xs font-medium text-accent">
                    {pitchesLeft} left
                  </span>
                )}
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-surface-secondary overflow-hidden">
                <div
                  role="progressbar"
                  aria-valuenow={usage.pitches_this_month}
                  aria-valuemin={0}
                  aria-valuemax={planLimit}
                  className={`h-full rounded-full transition-all ${
                    limitReached ? "bg-warning" : "bg-accent"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {limitReached ? (
            <div className="mt-4">
              <Link
                href="/pricing"
                className="h-11 w-full rounded-lg bg-accent-light border border-accent/30 text-accent text-sm font-medium flex items-center justify-center gap-2"
              >
                <Zap size={16} />
                Upgrade to generate more
              </Link>
              <p className="mt-2 text-xs text-text-muted text-center">
                You&apos;ve used all{usage.plan === "free" ? " free" : ""}{" "}
                pitches this month.
              </p>
            </div>
          ) : (
            <motion.button
              type="submit"
              disabled={isLoading || !url.trim()}
              whileHover={
                reducedMotion ? undefined : { scale: 1.02 }
              }
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              className="relative mt-4 h-11 w-full flex items-center justify-center rounded-lg bg-accent hover:bg-accent-hover text-accent-foreground text-sm font-medium overflow-hidden transition-colors duration-150 shadow-[0_4px_20px_rgba(108,71,255,0.3)] hover:shadow-[0_4px_28px_rgba(108,71,255,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && !reducedMotion && (
                <motion.div
                  aria-hidden
                  className="absolute inset-0 z-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                  }}
                  animate={{ x: SHIMMER_X }}
                  transition={{
                    duration: 1.2,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
                {isLoading ? "Generating..." : "Generate Pitch"}
              </span>
            </motion.button>
          )}
        </form>

        {isProfileIncomplete ? (
          <p className="bg-warning-light text-warning-foreground text-sm rounded-lg px-3 py-2">
            Complete your profile to get personalised pitches —{" "}
            <Link
              href="/profile"
              className="font-medium underline text-warning-foreground"
            >
              add your services to get started.
            </Link>
          </p>
        ) : (
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-text-primary">
                Your profile
              </span>
              <Link
                href="/profile"
                className="text-xs font-medium text-accent hover:underline flex items-center gap-1"
              >
                <Pencil size={12} />
                Edit
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs text-text-secondary">Services</p>
                <motion.div
                  className="mt-1.5 flex flex-wrap gap-1.5"
                  variants={badgeContainer}
                  initial={reducedMotion ? "show" : "hidden"}
                  animate="show"
                >
                  {serviceBadges.map((service) => (
                    <motion.span
                      key={service}
                      variants={badgeItem}
                      className="bg-accent-light text-accent text-xs font-medium rounded-md px-2 py-1"
                    >
                      {service}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
              <div>
                <p className="text-xs text-text-secondary">Tone</p>
                <p className="text-sm text-text-primary mt-1">
                  {profile.tone}
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        className="lg:col-span-3"
        initial={reducedMotion ? false : { opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={panelTransition}
      >
        <PitchOutput
          pitch={pitch}
          onRegenerate={handleRegenerate}
          isRegenerating={isLoading}
          subjectLines={subjectLines}
          tone={profile?.tone ?? "Professional"}
        />
      </motion.div>
    </>
  );
}
