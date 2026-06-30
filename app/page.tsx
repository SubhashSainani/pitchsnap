import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Sparkles,
  Globe,
  Wand2,
  Star,
  Zap,
  UserCircle,
  Link as LinkIcon,
  Mail,
  ArrowRight,
} from "lucide-react";

import { createClient } from "@/lib/supabase-server";

const STEPS = [
  {
    icon: UserCircle,
    label: "STEP 1",
    title: "Set up your profile",
    description:
      "Describe your services, pick a tone, and tell us who your ideal client is. PitchSnap uses this as the foundation of every email it writes.",
  },
  {
    icon: LinkIcon,
    label: "STEP 2",
    title: "Paste a URL",
    description:
      "Drop in any prospect's website. PitchSnap reads it, understands what they do, and uses real details — no guessing, no generic filler.",
  },
  {
    icon: Mail,
    label: "STEP 3",
    title: "Get your email",
    description:
      "A fully personalized cold email lands in seconds. Review it, edit if you like, copy, and send. Done.",
  },
];

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

        {/* Layer 2 — floating orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 z-0 h-[32rem] w-[32rem] rounded-full bg-accent opacity-20 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 z-0 h-[28rem] w-[28rem] rounded-full bg-accent opacity-15 blur-[100px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/3 z-0 h-[24rem] w-[24rem] rounded-full bg-accent-light opacity-30 blur-[80px]"
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
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 backdrop-blur-sm px-4 py-2 text-sm font-medium text-text-secondary shadow-sm">
                <Sparkles className="h-4 w-4 text-accent" />
                AI cold emails that actually get replies
              </div>

              {/* H1 */}
              <h1 className="mt-6 text-5xl sm:text-6xl font-semibold leading-[1.05] tracking-tight">
                <span className="inline-block bg-gradient-to-r from-accent via-purple-500 to-violet-400 bg-clip-text text-transparent">
                  Cold emails,
                </span>
                <span className="block text-text-primary">
                  {" "}written in a snap.
                </span>
              </h1>

              {/* Subtext */}
              <p className="mt-6 text-lg leading-relaxed text-text-secondary max-w-lg">
                PitchSnap reads your prospect&apos;s website and writes a
                personalized pitch in seconds — no templates, no generic
                openers, no blank-page dread.
              </p>

              {/* Button row */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full bg-accent hover:bg-accent-hover text-accent-foreground px-7 h-12 text-base font-medium transition-colors duration-150 shadow-[0_4px_14px_rgba(91,78,232,0.25)] hover:shadow-[0_4px_20px_rgba(91,78,232,0.4)]"
                >
                  Start Free →
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-transparent hover:bg-accent-light text-text-primary px-7 h-12 text-base font-medium transition-colors duration-150"
                >
                  See how it works
                </button>
              </div>

              {/* Social proof */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                {/* Avatar stack */}
                <div className="flex" aria-hidden>
                  <div className="h-8 w-8 rounded-full bg-rose-400 ring-2 ring-surface" />
                  <div className="h-8 w-8 rounded-full bg-emerald-400 ring-2 ring-surface -ml-2" />
                  <div className="h-8 w-8 rounded-full bg-accent ring-2 ring-surface -ml-2" />
                  <div className="h-8 w-8 rounded-full bg-amber-400 ring-2 ring-surface -ml-2" />
                </div>
                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-text-secondary">
                  Loved by{" "}
                  <span className="font-semibold text-text-primary">3,000+</span>{" "}
                  founders
                </p>
              </div>
            </div>

            {/* Right column — browser window mock */}
            <div className="flex justify-center lg:justify-end">
              <div className="max-w-[28rem] w-full rounded-2xl border border-border bg-surface/90 backdrop-blur-sm shadow-[0_20px_60px_rgba(91,78,232,0.12)] overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 border-b border-border bg-accent-light/30 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-400" aria-hidden />
                  <div className="h-3 w-3 rounded-full bg-amber-400" aria-hidden />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" aria-hidden />
                  <div className="flex-1" />
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs font-medium text-text-secondary">
                    PitchSnap
                  </span>
                </div>

                {/* Browser body */}
                <div className="p-5 flex flex-col gap-4">
                  <p className="text-xs font-medium text-text-muted">
                    Prospect URL
                  </p>

                  {/* URL display (static — no JS) */}
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
                    <Globe className="h-4 w-4 text-text-muted" />
                    <span className="text-sm font-mono text-text-primary">
                      https://linear.app
                    </span>
                  </div>

                  {/* Generate button (static — no JS) */}
                  <div className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground w-full">
                    <Wand2 className="h-4 w-4" />
                    Generate email
                  </div>

                  {/* Email preview panel */}
                  <div className="min-h-[10rem] rounded-lg border border-border bg-accent-light/20 p-4 flex flex-col gap-1">
                    <p className="text-sm text-text-secondary font-mono font-medium">
                      Hi Sarah,
                    </p>
                    <p className="text-sm text-text-secondary font-mono">
                      Linear&apos;s focus on shipping with high velocity...
                    </p>
                    <p className="text-sm text-text-secondary font-mono">
                      I help DTC brands achieve similar speed...
                    </p>
                    <p className="text-sm text-text-secondary font-mono font-medium">
                      Best, Alex
                    </p>
                  </div>
                </div>
              </div>
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
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-text-primary text-balance">
            From blank page to perfect pitch in three steps
          </h2>
          <p className="text-lg text-text-secondary mt-4">
            No setup complexity, no learning curve. Just paste a URL and go.
          </p>
        </div>

        <div className="mt-16 relative">
          <ol className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                // interactive card — hover lift intentional
                <li
                  key={step.label}
                  className="h-full rounded-2xl border border-border bg-surface p-8 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(91,78,232,0.1)] transition-all duration-300"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <p className="mb-2 text-sm font-semibold text-accent uppercase tracking-wider">
                    {step.label}
                  </p>
                  <h3 className="mb-3 text-xl font-semibold text-text-primary">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed text-sm">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>

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
          {/* CTA glows — same permitted depth treatment as hero orbs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-accent opacity-10 blur-[80px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-accent opacity-10 blur-[60px]"
          />

          {/* CTA content */}
          <div className="relative z-10">
            <div className="inline-flex items-center rounded-full border border-border bg-accent-light px-3 py-1 text-xs font-medium text-accent mb-6">
              No credit card required
            </div>

            <h2 className="text-3xl sm:text-5xl font-semibold leading-tight">
              <span className="text-text-primary block">
                Stop staring at a blank
              </span>
              <span className="bg-gradient-to-r from-accent to-violet-400 bg-clip-text text-transparent block">
                compose window
              </span>
            </h2>

            <p className="text-lg text-text-secondary max-w-xl mx-auto mt-4 leading-relaxed">
              Your next great cold email is one URL away. PitchSnap does the
              research, writes the pitch, and gets you to send in under 60
              seconds.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-accent hover:bg-accent-hover text-accent-foreground px-7 h-12 text-base font-medium transition-colors duration-150 shadow-[0_4px_14px_rgba(91,78,232,0.25)] hover:shadow-[0_4px_20px_rgba(91,78,232,0.4)]"
              >
                Start Free →
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-border bg-surface hover:bg-surface-secondary text-text-primary px-7 h-12 text-base font-medium transition-colors duration-150"
              >
                Book a demo
              </button>
            </div>
          </div>
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
