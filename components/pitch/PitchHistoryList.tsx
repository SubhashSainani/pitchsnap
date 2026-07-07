"use client";

import { useState } from "react";

import Link from "next/link";
import { Inbox, Search } from "lucide-react";
import { motion } from "framer-motion";

import { PitchHistoryRow } from "@/components/pitch/PitchHistoryRow";
import { useLazyReducedMotion } from "@/lib/useLazyReducedMotion";
import { staggerContainer, staggerItem } from "@/lib/motionVariants";
import type { Pitch } from "@/types";

type Props = {
  pitches: Pitch[];
};

const ROW_HOVER = { type: "spring" as const, stiffness: 300, damping: 20 };

export function PitchHistoryList({ pitches }: Props) {
  const [query, setQuery] = useState("");
  const reducedMotion = useLazyReducedMotion();

  const filtered =
    query.trim() === ""
      ? pitches
      : pitches.filter(
          (p) =>
            p.prospect_url.toLowerCase().includes(query.toLowerCase()) ||
            p.email_content.split("\n")[0]
              .toLowerCase()
              .includes(query.toLowerCase())
        );

  if (pitches.length === 0) {
    return (
      <>
        <h1 className="text-2xl font-bold text-text-primary mb-6">History</h1>
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
      </>
    );
  }

  const count = filtered.length;
  const countLabel = count === 1 ? "1 pitch" : `${count} pitches`;

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-text-primary">History</h1>
        <motion.span
          initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-surface-secondary text-text-muted text-xs font-medium rounded-full px-2.5 py-1"
        >
          {countLabel}
        </motion.span>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search domains..."
          className="h-10 w-full rounded-lg border border-border bg-background text-text-primary placeholder:text-text-muted pl-10 pr-3 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors duration-150"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl shadow-sm p-6 flex flex-col items-center text-center gap-3 py-16">
          <Inbox size={32} className="text-text-muted" />
          <p className="text-sm text-text-muted">
            No pitches match your search.
          </p>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl shadow-sm p-6">
          <motion.div
            variants={staggerContainer}
            initial={reducedMotion ? "show" : "hidden"}
            animate="show"
          >
            {filtered.map((pitch) => (
              <motion.div
                key={pitch.id}
                variants={staggerItem}
                whileHover={reducedMotion ? undefined : { y: -2 }}
                transition={ROW_HOVER}
              >
                <PitchHistoryRow pitch={pitch} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </>
  );
}
