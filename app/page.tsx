import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Zap, ArrowRight } from "lucide-react";

import { createClient } from "@/lib/supabase-server";
import { BrowserDemo } from "@/components/marketing/BrowserDemo";
import { HeroContent } from "@/components/marketing/HeroContent";
import { StepCards } from "@/components/marketing/StepCards";
import { CTAContent } from "@/components/marketing/CTAContent";

export const metadata: Metadata = {
  title: "PitchSnap — AI Cold Email Generator",
};

const FOOTER_LINKS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/generate" },
      { label: "Pricing", href: "/login" },
      { label: "Changelog", href: "#" },
      { label: "Roadmap", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Docs", href: "#" },
      { label: "Guides", href: "#" },
      { label: "Templates", href: "#" },
      { label: "Support", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/generate");

  return (
    <main className="min-h-screen bg-background">
      {/* ─── HERO ─── */}
      <section className="relative isolate overflow-hidden pt-24 lg:pt-32 pb-24">
        {/* Hero background treatment — permitted exception per ui-rules.md. Gradients on
            page background depth only, not card surfaces. */}

        {/* Layer 1 — base gradient wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-accent-light/40 to-transparent"
        />

        {/* Layer 2 — floating orbs. Values match ui-tokens.md's Orb spec exactly;
            extra orb reuses Orb 1's value to preserve depth without inventing
            a third opacity level (prohibited by ui-tokens.md Invariants). */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 z-0 h-[32rem] w-[32rem] rounded-full bg-accent opacity-25 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 z-0 h-[28rem] w-[28rem] rounded-full bg-accent opacity-25 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/3 z-0 h-[24rem] w-[24rem] rounded-full bg-accent-gradient-btn-end opacity-20 blur-[120px]"
        />

        {/* Layer 3 — bottom fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 h-48 bg-gradient-to-t from-background to-transparent"
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-14 lg:gap-10">
            {/* Left column — copy */}
            <HeroContent />

            {/* Right column — animated browser window demo */}
            <div className="flex justify-center lg:justify-end">
              <BrowserDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <div className="max-w-6xl mx-auto px-6 relative z-10 mt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl border border-border overflow-hidden">
          {[
            { value: "3.2×", label: "higher reply rate" },
            { value: "12s", label: "average draft time" },
            { value: "50k+", label: "emails generated" },
            { value: "40%", label: "less time prospecting" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface flex flex-col items-center justify-center px-6 py-8"
            >
              <span className="text-3xl sm:text-4xl font-semibold text-accent">
                {stat.value}
              </span>
              <span className="text-sm text-text-secondary mt-1.5">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24 max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-text-primary text-balance">
            From blank page to perfect pitch in three steps
          </h2>
          <p className="text-lg text-text-secondary mt-4">
            No setup complexity, no learning curve. Just paste a URL and go.
          </p>
        </div>

        <div className="mt-16 relative">
          <StepCards />

          {/* Connector arrows between step cards (desktop only) */}
          <div
            aria-hidden
            className="hidden md:block absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <ArrowRight className="h-7 w-7 text-text-muted" />
          </div>
          <div
            aria-hidden
            className="hidden md:block absolute left-2/3 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <ArrowRight className="h-7 w-7 text-text-muted" />
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="py-20 lg:py-28 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl border border-border bg-surface px-6 py-12 sm:px-12 sm:py-16 text-center overflow-hidden relative">
          <CTAContent />
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border py-14 max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          {/* Brand block */}
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <Zap className="h-4 w-4 text-accent-foreground" />
              </div>
              <span className="text-lg font-semibold text-text-primary">
                PitchSnap
              </span>
            </div>
            <p className="text-sm text-text-secondary">
              AI-powered cold emails that get replies. Built for founders who
              hate writing from scratch.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-14">
            {FOOTER_LINKS.map((group) => (
              <div key={group.heading}>
                <h3 className="text-sm font-semibold text-text-primary mb-4">
                  {group.heading}
                </h3>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between gap-2">
          <p className="text-sm text-text-muted">
            © 2026 PitchSnap. All rights reserved.
          </p>
          <p className="text-sm text-text-muted">
            Built for founders who hate writing cold emails.
          </p>
        </div>
      </footer>
    </main>
  );
}
