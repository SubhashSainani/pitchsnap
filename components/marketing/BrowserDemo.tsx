"use client";

import { useEffect, useState } from "react";
import { Globe, Wand2, Sparkles, Loader2, CheckCircle2 } from "lucide-react";

type Phase = "idle" | "typing" | "analyzing" | "writing" | "done";

type EmailLine = {
  text: string;
  emphasis: boolean;
};

const TARGET_URL = "https://linear.app";

const EMAIL_LINES: EmailLine[] = [
  { text: "Hi Sarah,", emphasis: true },
  { text: "Linear's focus on shipping with high velocity...", emphasis: false },
  { text: "I help DTC brands achieve similar speed...", emphasis: false },
  { text: "Best, Alex", emphasis: true },
];

const IDLE_MS = 1000;
const TYPE_CHAR_MS = 80;
const ANALYZING_MS = 2000;
const WRITE_LINE_STAGGER_MS = 400;
const WRITE_TO_DONE_GAP_MS = 300;
const DONE_MS = 3000;

export function BrowserDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [typedUrl, setTypedUrl] = useState("");
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timeoutId = setTimeout(resolve, ms);
      });

    const runLoop = async () => {
      while (!cancelled) {
        setPhase("idle");
        setTypedUrl("");
        setVisibleLines(0);
        await wait(IDLE_MS);
        if (cancelled) return;

        setPhase("typing");
        for (let i = 1; i <= TARGET_URL.length; i++) {
          await wait(TYPE_CHAR_MS);
          if (cancelled) return;
          setTypedUrl(TARGET_URL.slice(0, i));
        }

        setPhase("analyzing");
        await wait(ANALYZING_MS);
        if (cancelled) return;

        setPhase("writing");
        for (let i = 1; i <= EMAIL_LINES.length; i++) {
          await wait(WRITE_LINE_STAGGER_MS);
          if (cancelled) return;
          setVisibleLines(i);
        }
        await wait(WRITE_TO_DONE_GAP_MS);
        if (cancelled) return;

        setPhase("done");
        await wait(DONE_MS);
        if (cancelled) return;
      }
    };

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setPhase("done");
      setTypedUrl(TARGET_URL);
      setVisibleLines(EMAIL_LINES.length);
    } else {
      runLoop();
    }

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const showCursor = phase === "idle" || phase === "typing";
  const showPlaceholder =
    phase === "idle" || phase === "typing" || phase === "analyzing";

  return (
    <div
      aria-hidden="true"
      className="max-w-[28rem] w-full rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(25,25,35,0.6)] backdrop-blur-[12px] shadow-[0_20px_60px_rgba(108,71,255,0.12)] overflow-hidden"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-accent-light/30 px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-400" />
        <div className="h-3 w-3 rounded-full bg-amber-400" />
        <div className="h-3 w-3 rounded-full bg-emerald-400" />
        <div className="flex-1" />
        <Sparkles className="h-3.5 w-3.5 text-accent" />
        <span className="text-xs font-medium text-text-secondary">
          PitchSnap
        </span>
      </div>

      {/* Browser body */}
      <div className="p-5 flex flex-col gap-4">
        <p className="text-xs font-medium text-text-muted">Prospect URL</p>

        {/* URL field */}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
          <Globe className="h-4 w-4 text-text-muted" />
          <span className="text-sm font-mono text-text-primary">
            {phase === "typing" ? typedUrl : phase === "idle" ? "" : TARGET_URL}
            {showCursor && (
              <span className="cursor-blink ml-0.5 inline-block h-4 w-px -mb-0.5 bg-accent" />
            )}
          </span>
        </div>

        {/* Generate button */}
        {phase === "analyzing" ? (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-accent-light px-4 py-2 text-sm font-medium text-accent w-full">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing linear.app…
          </div>
        ) : phase === "writing" ? (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-accent-light px-4 py-2 text-sm font-medium text-accent w-full">
            <CheckCircle2 className="h-4 w-4" />
            Almost there…
          </div>
        ) : phase === "done" ? (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-success-light px-4 py-2 text-sm font-medium text-success w-full">
            <CheckCircle2 className="h-4 w-4" />
            Email ready to send
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground w-full">
            <Wand2 className="h-4 w-4" />
            Generate email
          </div>
        )}

        {/* Email preview panel */}
        <div className="min-h-[10rem] rounded-lg border border-border bg-accent-light/20 p-4 flex flex-col gap-1">
          {showPlaceholder ? (
            <p className="text-sm text-text-muted">
              Your personalized email will appear here...
            </p>
          ) : (
            EMAIL_LINES.map((line, i) => (
              <p
                key={line.text}
                className={`text-sm text-text-secondary font-mono transition-all duration-300 ${
                  line.emphasis ? "font-medium" : ""
                } ${
                  i < visibleLines
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-1.5"
                }`}
              >
                {line.text}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
