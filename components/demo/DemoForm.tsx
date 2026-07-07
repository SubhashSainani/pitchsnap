"use client";

import { useState } from "react";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Globe, Loader2, Sparkles, Zap } from "lucide-react";

import { useLazyReducedMotion } from "@/lib/useLazyReducedMotion";
import { panelTransition } from "@/lib/motionVariants";

type Props = {
  demoUsed: boolean;
};

type DemoResponse =
  | { success: true; data: { email_content: string } }
  | { success: false; error: string; message?: string };

export function DemoForm({ demoUsed }: Props) {
  const [url, setUrl] = useState("");
  const [emailContent, setEmailContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUsedDemo, setHasUsedDemo] = useState(demoUsed);
  const [copied, setCopied] = useState(false);
  const [showConversionBanner, setShowConversionBanner] = useState(demoUsed);

  const reducedMotion = useLazyReducedMotion();

  async function generate(targetUrl: string): Promise<void> {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/demo-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });
      const result: DemoResponse = await response.json();

      if (result.success) {
        setEmailContent(result.data.email_content);
        setHasUsedDemo(true);
        setShowConversionBanner(true);
      } else {
        if (result.error === "demo_used") {
          setHasUsedDemo(true);
          setShowConversionBanner(true);
          setError(result.message ?? "You've already used your free demo");
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      console.error("[DemoForm]", err);
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

  async function handleCopy(): Promise<void> {
    if (!emailContent) return;
    try {
      await navigator.clipboard.writeText(emailContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("[DemoForm]", err);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
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
                  disabled={isLoading || hasUsedDemo}
                  className="h-11 w-full rounded-lg border border-border bg-background text-text-primary placeholder:text-text-muted pl-10 pr-3 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {hasUsedDemo ? (
              <div className="mt-4">
                <Link
                  href="/login"
                  className="h-11 w-full rounded-lg bg-accent-light border border-accent/30 text-accent text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Zap size={16} />
                  Sign up to keep generating
                </Link>
                <p className="mt-2 text-xs text-text-muted text-center">
                  You&apos;ve used your free demo. Create a free account for 5
                  pitches every month.
                </p>
              </div>
            ) : (
              <motion.button
                type="submit"
                disabled={isLoading || !url.trim()}
                whileHover={reducedMotion ? undefined : { scale: 1.02 }}
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                className="mt-4 h-11 w-full flex items-center justify-center gap-2 rounded-lg bg-accent hover:bg-accent-hover text-accent-foreground text-sm font-medium transition-colors duration-150 shadow-[0_4px_20px_rgba(108,71,255,0.3)] hover:shadow-[0_4px_28px_rgba(108,71,255,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
                {isLoading ? "Generating..." : "Generate Pitch"}
              </motion.button>
            )}
          </form>
        </motion.div>

        <motion.div
          className="lg:col-span-3"
          initial={reducedMotion ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={panelTransition}
        >
          {/* interactive card — hover lift intentional */}
          <div className="bg-surface border border-border rounded-2xl shadow-sm min-h-[28rem] flex flex-col h-full hover:shadow-md hover:border-border-strong transition-all duration-200">
            <div className="flex justify-between items-center px-6 py-4">
              <span className="text-sm font-medium text-text-primary">
                Generated email
              </span>
              {emailContent && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="h-8 px-3 rounded-md text-xs text-text-secondary hover:text-text-primary hover:bg-surface-secondary hover:shadow-[0_0_12px_rgba(255,255,255,0.1)] transition-colors duration-150 flex items-center gap-1.5"
                >
                  <Copy size={14} />
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              )}
            </div>

            <div className="border-b border-border" />

            <div className="px-6 py-6 flex-1">
              {emailContent ? (
                <textarea
                  value={emailContent}
                  onChange={(event) => setEmailContent(event.target.value)}
                  className="w-full h-full min-h-full resize-none border-0 outline-none bg-transparent text-sm leading-relaxed text-text-primary focus:ring-0 whitespace-pre-wrap"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center gap-3 h-full">
                  <Sparkles size={32} className="text-text-muted" />
                  <p className="text-sm text-text-muted text-center">
                    {hasUsedDemo
                      ? "You've already tried the demo. Sign up to generate unlimited pitches."
                      : "Paste a URL above and click Generate Pitch to get started"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showConversionBanner && (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-surface border border-border rounded-2xl p-8 max-w-2xl mx-auto mt-8 text-center"
          >
            <p className="text-text-muted text-xs uppercase tracking-wider mb-4">
              Free plan includes
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {["5 pitches/month", "Subject lines", "Email history"].map(
                (feature) => (
                  <span
                    key={feature}
                    className="bg-surface-secondary text-text-secondary text-xs rounded-full px-3 py-1"
                  >
                    {feature}
                  </span>
                ),
              )}
            </div>
            <h2 className="text-xl font-semibold text-text-primary">
              Like what you see?
            </h2>
            <p className="text-text-secondary text-sm mt-2">
              Create a free account and get 5 pitches every month. No credit
              card required.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center justify-center h-11 px-6 rounded-lg bg-accent hover:bg-accent-hover text-accent-foreground text-sm font-medium transition-colors duration-150 shadow-[0_4px_20px_rgba(108,71,255,0.3)] hover:shadow-[0_4px_28px_rgba(108,71,255,0.6)]"
            >
              Start for free
            </Link>
            <p className="text-text-muted text-xs mt-3">
              <Link
                href="/pricing"
                className="hover:text-text-secondary transition-colors duration-150"
              >
                See all plans →
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
