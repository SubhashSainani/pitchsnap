"use client";

import { useState } from "react";

import { deletePitch } from "@/actions/pitches";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Pitch } from "@/types";

type Props = {
  pitch: Pitch;
};

export function PitchHistoryRow({ pitch }: Props) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formattedDate = new Date(pitch.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const previewLine = pitch.email_content.split("\n")[0] ?? "";

  async function handleDelete(): Promise<void> {
    setIsDeleting(true);
    setError(null);
    const result = await deletePitch(pitch.id);
    if (!result.success) {
      setError(result.error ?? "Failed to delete pitch.");
      setIsDeleting(false);
      return;
    }
    setConfirmOpen(false);
    setIsDeleting(false);
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setDetailOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") setDetailOpen(true);
        }}
        className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0 hover:bg-surface-secondary cursor-pointer px-2 rounded-lg transition-colors duration-150"
      >
        <div className="flex flex-col min-w-0">
          <span className="text-sm text-text-primary truncate">{pitch.prospect_url}</span>
          <span className="text-xs text-text-muted mt-0.5 truncate">
            {formattedDate} · {previewLine}
          </span>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setConfirmOpen(true);
          }}
          onKeyDown={(event) => event.stopPropagation()}
          className="text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded-lg px-3 py-1.5 text-sm transition-colors duration-150 shrink-0"
        >
          Delete
        </button>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{pitch.prospect_url}</DialogTitle>
            <DialogDescription>{formattedDate}</DialogDescription>
          </DialogHeader>
          {pitch.email_content ? (
            <p className="font-mono text-sm text-text-primary whitespace-pre-wrap">
              {pitch.email_content}
            </p>
          ) : (
            <p className="text-sm text-text-muted">This pitch has no content.</p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete this pitch?</DialogTitle>
            <DialogDescription>This can&apos;t be undone.</DialogDescription>
          </DialogHeader>
          {error && (
            <p className="bg-error-light text-error-foreground text-sm rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <DialogFooter>
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              disabled={isDeleting}
              className="bg-surface border border-border hover:bg-surface-secondary text-text-primary rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-error-light text-error-foreground hover:bg-error rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
