"use client";

import { useState } from "react";

import { Loader2 } from "lucide-react";

import { saveProfile } from "@/actions/profile";
import type { Profile, Tone } from "@/types";

const TONES: readonly Tone[] = ["Professional", "Friendly", "Direct"];

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

      <div>
        <label className="text-sm font-medium text-text-secondary mb-1 block">
          Services
        </label>
        <textarea
          value={services}
          onChange={(event) => setServices(event.target.value)}
          placeholder="e.g. I build Shopify stores for DTC brands"
          className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent w-full min-h-24 resize-none"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-text-secondary mb-1 block">
          Tone
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
      </div>

      <div>
        <label className="text-sm font-medium text-text-secondary mb-1 block">
          Target client
        </label>
        <textarea
          value={targetClient}
          onChange={(event) => setTargetClient(event.target.value)}
          placeholder="e.g. Small e-commerce brands doing $1M-$5M in revenue (optional)"
          className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent w-full min-h-24 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="bg-accent hover:bg-accent-hover text-accent-foreground rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed self-start flex items-center gap-2"
      >
        {isSaving && <Loader2 size={16} className="animate-spin" />}
        {isSaving ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
