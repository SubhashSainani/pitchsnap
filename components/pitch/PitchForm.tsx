"use client";

import { useState } from "react";

import { Loader2 } from "lucide-react";

import { PitchOutput } from "@/components/pitch/PitchOutput";
import type { Pitch } from "@/types";

type GenerateResponse =
  | { success: true; pitch: Pitch }
  | { success: false; error: string };

export function PitchForm() {
  const [url, setUrl] = useState("");
  const [pitch, setPitch] = useState<Pitch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(targetUrl: string): Promise<void> {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });
      const result: GenerateResponse = await response.json();

      if (result.success) {
        setPitch(result.pitch);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error("[PitchForm]", error);
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
    if (!pitch) return;
    void generate(pitch.prospect_url);
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleSubmit}
        className="bg-surface border border-border rounded-xl shadow-sm p-6 flex flex-col gap-4"
      >
        {error && (
          <p className="bg-error-light text-error-foreground text-sm rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div>
          <label className="text-sm font-medium text-text-secondary mb-1 block">
            Prospect website URL
          </label>
          <input
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com"
            disabled={isLoading}
            className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent w-full disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="bg-accent hover:bg-accent-hover text-accent-foreground rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 hover:shadow-[0_0_20px_rgba(91,78,232,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none self-start flex items-center gap-2"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          {isLoading ? "Generating..." : "Generate Pitch"}
        </button>
      </form>

      <PitchOutput
        pitch={pitch}
        onRegenerate={handleRegenerate}
        isRegenerating={isLoading}
      />
    </div>
  );
}
