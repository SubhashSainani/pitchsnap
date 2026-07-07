"use client";

import { useEffect, useRef, useState } from "react";

import { Check, Copy, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { useLazyReducedMotion } from "@/lib/useLazyReducedMotion";
import type { Pitch } from "@/types";

type Props = {
  pitch: Pitch | null;
  onRegenerate: () => void;
  isRegenerating: boolean;
  subjectLines?: string[];
  tone?: string;
};

export function PitchOutput({
  pitch,
  onRegenerate,
  isRegenerating,
  subjectLines = [],
  tone = "Professional",
}: Props) {
  const [content, setContent] = useState(pitch?.email_content ?? "");
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const copiedIndexTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reducedMotion = useLazyReducedMotion();

  useEffect(() => {
    setContent(pitch?.email_content ?? "");
    setCopied(false);
  }, [pitch]);

  // Reset per-line copy highlight whenever a new set of subject lines arrives.
  useEffect(() => {
    setCopiedIndex(null);
  }, [subjectLines]);

  // Clean up the per-line copy timer on unmount
  useEffect(() => {
    return () => {
      if (copiedIndexTimer.current) clearTimeout(copiedIndexTimer.current);
    };
  }, []);

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("[PitchOutput]", error);
    }
  }

  async function handleCopySubject(line: string, index: number): Promise<void> {
    try {
      await navigator.clipboard.writeText(line);
      if (copiedIndexTimer.current) clearTimeout(copiedIndexTimer.current);
      setCopiedIndex(index);
      copiedIndexTimer.current = setTimeout(() => setCopiedIndex(null), 1500);
    } catch (error) {
      console.error("[PitchOutput]", error);
    }
  }

  const hasPitch = Boolean(pitch && pitch.email_content);
  const wordCount = hasPitch
    ? pitch!.email_content.trim().split(/\s+/).length
    : 0;

  return (
    // interactive card — hover lift intentional
    <div className="bg-surface border border-border rounded-2xl shadow-sm min-h-[28rem] flex flex-col h-full hover:shadow-md hover:border-border-strong transition-all duration-200">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text-primary">
            Generated email
          </span>
          {hasPitch && (
            <span className="bg-surface-secondary text-text-muted text-xs rounded-full px-2.5 py-1">
              {tone} · {wordCount} words
            </span>
          )}
        </div>
        {hasPitch && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="h-8 px-3 rounded-md text-xs text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors duration-150 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRegenerating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              {isRegenerating ? "Regenerating..." : "Regenerate"}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="h-8 px-3 rounded-md text-xs text-text-secondary hover:text-text-primary hover:bg-surface-secondary hover:shadow-[0_0_12px_rgba(255,255,255,0.1)] transition-colors duration-150 flex items-center gap-1.5"
            >
              <Copy size={14} />
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
        )}
      </div>

      <div className="border-b border-border" />

      {subjectLines.length > 0 && (
        <>
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider px-6 pt-4">
            Subject lines
          </p>
          {subjectLines.map((line, i) => (
            <div
              key={line}
              className={`flex items-center justify-between px-6 py-2 border-b border-border hover:bg-surface-secondary transition-colors duration-150 cursor-pointer ${
                i === subjectLines.length - 1 ? "border-b-0" : ""
              }`}
              onClick={() => void handleCopySubject(line, i)}
            >
              <span className="text-sm text-text-primary">{line}</span>
              <button
                type="button"
                aria-label="Copy subject line"
                onClick={(e) => {
                  e.stopPropagation();
                  void handleCopySubject(line, i);
                }}
                className="ml-3 shrink-0 text-text-muted hover:text-text-primary transition-colors duration-150"
              >
                {copiedIndex === i ? (
                  <Check size={14} className="text-success-foreground" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          ))}
          <div className="border-b border-border" />
        </>
      )}

      <div className="px-6 py-6 flex-1">
        {hasPitch ? (
          <motion.div
            key={pitch?.id}
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="w-full h-full min-h-full resize-none border-0 outline-none bg-transparent text-sm leading-relaxed text-text-primary focus:ring-0 whitespace-pre-wrap"
            />
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center gap-3 h-full">
            <Sparkles size={32} className="text-text-muted" />
            <p className="text-sm text-text-muted text-center">
              Paste a URL above and click Generate Pitch to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
