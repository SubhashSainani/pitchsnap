"use client";

import { useEffect, useState } from "react";

import { Copy, Loader2, Sparkles } from "lucide-react";

import type { Pitch } from "@/types";

type Props = {
  pitch: Pitch | null;
  onRegenerate: () => void;
  isRegenerating: boolean;
};

export function PitchOutput({ pitch, onRegenerate, isRegenerating }: Props) {
  const [content, setContent] = useState(pitch?.email_content ?? "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setContent(pitch?.email_content ?? "");
    setCopied(false);
  }, [pitch]);

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("[PitchOutput]", error);
    }
  }

  if (!pitch || !pitch.email_content) {
    return (
      // interactive card — hover lift intentional
      <div className="bg-surface border border-border rounded-xl shadow-sm p-6 flex flex-col items-center text-center gap-3 py-16 hover:shadow-md hover:border-border-strong transition-all duration-200">
        <Sparkles size={32} className="text-text-muted" />
        <p className="text-sm text-text-muted text-center">
          Paste a URL above and click Generate Pitch to get started
        </p>
      </div>
    );
  }

  return (
    // interactive card — hover lift intentional
    <div className="bg-surface border border-border rounded-xl shadow-sm p-6 flex flex-col gap-4 hover:shadow-md hover:border-border-strong transition-all duration-200">
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        className="font-mono text-sm text-text-primary bg-surface border border-border rounded-xl p-4 min-h-64 resize-none w-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="bg-accent hover:bg-accent-hover text-accent-foreground rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isRegenerating && <Loader2 size={16} className="animate-spin" />}
          {isRegenerating ? "Regenerating..." : "Regenerate"}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="bg-surface border border-border hover:bg-surface-secondary text-text-primary rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 flex items-center gap-2"
        >
          <Copy size={16} />
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
    </div>
  );
}
