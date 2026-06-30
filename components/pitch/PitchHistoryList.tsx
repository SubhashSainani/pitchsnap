import { Inbox } from "lucide-react";
import Link from "next/link";

import { PitchHistoryRow } from "@/components/pitch/PitchHistoryRow";
import type { Pitch } from "@/types";

type Props = {
  pitches: Pitch[];
};

export function PitchHistoryList({ pitches }: Props) {
  if (pitches.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl shadow-sm p-6 flex flex-col items-center text-center gap-3 py-16">
        <Inbox size={32} className="text-text-muted" />
        <p className="text-sm text-text-muted">
          No pitches yet — generate your first one to see it here.
        </p>
        <Link
          href="/generate"
          className="bg-accent hover:bg-accent-hover text-accent-foreground rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150"
        >
          Generate a pitch
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl shadow-sm p-6">
      {pitches.map((pitch) => (
        <PitchHistoryRow key={pitch.id} pitch={pitch} />
      ))}
    </div>
  );
}
