# UI Registry

Living document. Updated after every component is built using /imprint.
Read this before building any new component — match existing patterns exactly.

---

## How to Use

Before building any component:
1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here via /imprint

---

## Components

### Auth Card

File: app/(auth)/login/page.tsx
Last updated: 2026-06-29

| Property         | Class                                          |
| ---------------- | ---------------------------------------------- |
| Background       | bg-surface                                     |
| Border            | border border-border                          |
| Border radius    | rounded-xl                                     |
| Text — primary   | text-2xl font-bold text-text-primary (heading) |
| Text — secondary | text-sm text-text-secondary (subtext)          |
| Spacing          | p-6, w-full max-w-sm, heading mb-2, subtext mb-6 |
| Hover state      | none                                            |
| Shadow           | shadow-sm                                       |
| Accent usage     | none directly — accent lives in the child action (e.g. `GoogleSignInButton`), not the card shell |

**Pattern notes:**
This is the standard centered single-card auth/empty-page layout — `min-h-screen flex items-center justify-center bg-background px-6` wrapping one `max-w-sm` card. The card itself holds no interactive elements — buttons/forms are separate child components dropped inside it. Reused verbatim by `app/error.tsx` (error boundary, "Try again" reset button) and `app/not-found.tsx` (404 page, link back to `/generate`) — both are one-off single-action pages in exactly this shape. **As of 2026-06-30, `app/(auth)/login/page.tsx` no longer uses this shell** — login was redesigned with its own distinct shape (orbs, `rounded-2xl`, `p-8`, custom shadow); see the new "Login Card" entry. Any future single-action page (password-reset, invite-accept, etc.) should still default to reusing this exact Auth Card shell, not the Login Card pattern, unless it specifically wants the same visual weight as the homepage/login marketing surfaces.

### Login Card

File: components/auth/LoginCard.tsx + components/auth/LoginOrbs.tsx (extracted Session 17)
Last updated: 2026-07-01 (Glass Card migration, stagger entrance, orb drift, pulsing logo, fixed shadows)

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | `bg-[rgba(25,25,35,0.6)] backdrop-blur-[12px]` Glass Card (card); `bg-accent opacity-[0.13] blur-3xl` (top-left orb); `bg-accent-light opacity-55 blur-3xl` (bottom-right orb) |
| Border            | `border border-[rgba(255,255,255,0.08)]` Glass Card border (card only — orbs have none) |
| Border radius    | `rounded-2xl` (card); `rounded-xl` (logo mark)  |
| Text — primary   | `text-2xl font-semibold tracking-tight text-text-primary text-balance` (heading) |
| Text — secondary | `text-sm text-text-secondary leading-relaxed` (subtext); `text-xs text-text-muted` (trust line) |
| Spacing          | card `p-8`; heading `mt-6`; subtext `mt-2`; error banner `mt-4` (conditional); button wrapper `mt-8`; trust line `mt-5` |
| Hover state      | Google button: `whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}` + `hover:shadow-[0_4px_16px_rgba(255,255,255,0.15)]` |
| Shadow           | card `shadow-[0_20px_50px_rgba(108,71,255,0.1)]`; logo mark `shadow-[0_8px_20px_rgba(108,71,255,0.3)]` (pulsing to `rgba(108,71,255,0.7)`) |
| Accent usage     | logo mark `bg-accent` + `Zap` icon `text-accent-foreground`; both orbs use accent tokens |

**Pattern notes:**
The card itself is now a **Glass Card** (`bg-[rgba(25,25,35,0.6)] border-[rgba(255,255,255,0.08)] backdrop-blur-[12px]`), replacing the old opaque `bg-surface + border-border` treatment. Same `rounded-2xl p-8` layout. Shadow values corrected from the old `rgba(91,78,232,...)` (light-theme accent) to `rgba(108,71,255,...)` per ui-tokens.md's Glow & Shadow Reference.

The card interior staggers in on mount via `staggerContainer`/`staggerItem` from `lib/motionVariants.ts` — 5 children fade up sequentially (logo, heading, subtext, Google button, trust line). Reduced motion reads from `useLazyReducedMotion()` from `lib/useLazyReducedMotion.ts`; when true, `initial="show"` skips animation entirely.

The logo mark has an independent infinite boxShadow pulse (0.3→0.7→0.3 alpha, 2.5s) running on a nested inner `motion.div`. This uses a boxShadow keyframe directly (resting/peak values from ui-tokens.md's Icon pulse glow table) rather than a generic opacity tween — animating opacity on the solid logo box would read as flickering, not glowing. The two techniques (stagger entrance outer, boxShadow pulse inner) intentionally live on separate nested elements to avoid conflicts between variants-driven and independent infinite animate props.

The two background orbs are now rendered by `<LoginOrbs />` (`components/auth/LoginOrbs.tsx`), which animates them with Orb drift (x/y translation loop, 18s, easeInOut) via Framer Motion, gated by the same `useLazyReducedMotion()` hook. Orbs use `-z-10` against `<main>` as the stacking context; LoginOrbs renders a `<>` Fragment (no extra wrapper div) — structural prerequisite for the stacking to work. `app/(auth)/login/page.tsx` itself stays a Server Component (auth check + redirect logic), rendering `<LoginOrbs />` and `<LoginCard error={error} />` as siblings inside `<main>`.

The Google sign-in button is now a `motion.button` (whileHover scale 1.02/whileTap 0.98 + white hover-glow shadow), gated by reduced motion. Everything else about the button (SVG Google icon, loading text swap, hasError banner, disabled states) is unchanged.

Note: the page-level `error` prop in LoginCard and GoogleSignInButton's own internal `hasError` state are independent error sources that can both be true simultaneously (URL-level redirect error + fresh client-side OAuth failure). They show byte-identical copy; both can appear at once in the unusual case where a server-redirected error is shown AND the retry also fails client-side — cosmetically redundant, functionally correct, pre-existing as of Session 10, not a regression of this session.

### Inline Error Banner

File: app/(auth)/login/page.tsx
Last updated: 2026-06-29

| Property         | Class                                  |
| ---------------- | --------------------------------------- |
| Background       | bg-error-light                          |
| Border            | none                                    |
| Border radius    | rounded-lg                              |
| Text — primary   | text-sm text-error-foreground           |
| Text — secondary | n/a                                     |
| Spacing          | px-3 py-2 (margin varies by placement — `mb-4` above an action, `mt-4` below content) |
| Hover state      | n/a (static, non-interactive)           |
| Shadow           | none                                    |
| Accent usage     | none — uses error tokens, not accent    |

**Pattern notes:**
Generic human-readable error message shown inline, never raw error text (per code-standards.md). Same exact classes are reused in `app/(app)/generate/page.tsx` for the sign-out-failure banner and in `components/auth/GoogleSignInButton.tsx` for the client-side OAuth-init failure. Treat this as the one canonical error-banner pattern for the whole app — any new error state should match these classes rather than introducing a toast or a different color treatment.

### Inline Warning Banner

File: app/(app)/generate/page.tsx
Last updated: 2026-06-30

| Property         | Class                                  |
| ---------------- | --------------------------------------- |
| Background       | bg-warning-light                        |
| Border            | none                                     |
| Border radius    | rounded-lg                              |
| Text — primary   | text-sm text-warning-foreground         |
| Text — secondary | n/a                                     |
| Spacing          | px-3 py-2 mb-4                          |
| Hover state      | n/a (static, non-interactive container) |
| Shadow           | none                                     |
| Accent usage     | none — uses warning tokens, not accent  |

**Pattern notes:**
Same structure as the Inline Error Banner, with warning tokens swapped in — used for informational nudges that aren't failures (e.g. "your profile is incomplete"), as distinct from the error banner's "something broke" tone. First real use of the warning token set beyond the Direct tone badge. Shown server-side in `app/(app)/generate/page.tsx` when the user's `services` field is empty, with an inline `<Link href="/profile">` styled `font-medium underline text-warning-foreground`. Any future non-error informational banner should reuse this exact pattern rather than repurposing the error banner's red tokens.

### Navbar

File: components/layout/Navbar.tsx
Last updated: 2026-06-30 (dark theme rebuild — frosted glass removed, layoutId pill, entrance + hover motion)

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | bg-surface (header — frosted `bg-white/80` glass removed); bg-surface-secondary (active-link pill, and plan badge default); bg-warning-light (plan badge, canceling) |
| Border            | border-b border-border                         |
| Border radius    | none (header bar) — rounded-lg on the logo mark and active-link pill; rounded-full on the plan badge |
| Text — primary   | font-bold text-text-primary (wordmark); text-text-primary transition-colors duration-150 (active nav link) |
| Text — secondary | text-text-secondary transition-colors duration-150 (inactive nav link); text-text-secondary text-xs font-medium (plan badge, default); text-warning-foreground text-xs font-medium (plan badge, canceling) |
| Spacing          | px-6 (header), gap-2 (logo + wordmark), gap-1 (nav links, was gap-6 — links now carry their own px-3 py-1.5 hit area for the pill); gap-3 (badge-to-sign-out wrapper); px-2.5 py-1 (badge) |
| Hover state      | Sign-out — Ghost button: hover:text-text-primary hover:bg-surface-secondary; logo mark — spring scale (`whileHover={{ scale: 1.08 }}`, `{ type: "spring", stiffness: 400, damping: 10 }`), skipped when `prefers-reduced-motion` |
| Shadow           | none                                             |
| Accent usage     | active nav link text stays `text-text-primary` — the pill behind it is a neutral `bg-surface-secondary` elevation, not an accent tint (corrected in ui-tokens.md's Typography table, which previously said `text-accent`); logo mark background uses `linear-gradient(45deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)` via inline style (CSS-var reference, not hardcoded hex) |

**Pattern notes:**
Fixed 64px height (`h-16`), full viewport width, bottom border only, opaque `bg-surface` — the `bg-white/80` + `backdrop-blur-md` frosted-glass treatment from the light-theme polish pass is gone entirely, replaced per ui-rules.md's dark-theme Navbar spec. Logo mark is a `w-9 h-9 rounded-lg` accent-gradient square holding a white `Zap` icon (`lucide-react`, `size-5 text-accent-foreground`) — reuses the same icon/mark family as the Login Card's `size-12 rounded-xl bg-accent` + `Zap` logo, just smaller. **Corrected 2026-06-30 (same day as the dark theme rebuild):** the navbar originally shipped this session with a bold "P" letter inside the mark instead of the Zap icon — caught when the developer compared against a reference design and flagged the mismatch; the letter treatment is gone, Zap is now the only logo treatment in the app. Logo wraps in a `motion.div` for the hover-bounce spring.

**Active-link indicator (rebuilt 2026-06-30):** no longer a per-link className swap. Each `NAV_LINKS` item renders inside a `relative` `Link`; when active, a `motion.span` with `layoutId="navPill"` (`absolute inset-0 bg-surface-secondary rounded-lg`) renders behind the label text. Pill color was corrected from an initial `bg-accent-light` (purple-tinted) to `bg-surface-secondary` (neutral) per the same reference-design comparison — the active state reads as "elevated," not "accent-colored," matching the Free Plan badge's resting color. Framer Motion's shared-layout-id mechanism animates the pill smoothly between whichever link is active as `pathname` changes — only one pill element is ever mounted at a time, so there's nothing to manually animate or clean up. `isActive` is still exact `pathname === link.href` (no nested-route prefix matching) — fine today since none of the four nav routes have sub-routes, but a future nested route (e.g. `/profile/billing`) would need this changed to a prefix check. Nav links are `Generate / History / Profile / Pricing`.

**Entrance + reduced motion:** the whole header is a `motion.header` that slides down on mount (`initial={{ y: -100, opacity: 0 }}` → `animate={{ y: 0, opacity: 1 }}`, `duration: 0.4`). `prefers-reduced-motion` is read via `useLazyReducedMotion()` from `lib/useLazyReducedMotion.ts` — a project-owned hook using the lazy-`useState` technique, not a post-mount `useEffect` like `BrowserDemo.tsx`, because framer-motion only honors a `motion` component's `initial` prop on its very first commit and a `useEffect` would fire too late. When true: `initial={false}` (header), `whileHover={undefined}` (logo), pill `transition={{ duration: 0 }}`. `suppressHydrationWarning` sits on `motion.header` only (server always renders the non-reduced-motion branch since `window` is unavailable there). See `ui-rules.md`'s Motion Patterns section for the full lazy-useState-vs-useEffect decision tree.

**Plan badge:** unchanged from before — `bg-surface-secondary text-text-secondary text-xs font-medium rounded-full px-2.5 py-1`, sitting in a `flex items-center gap-3` wrapper to the left of the sign-out form. Text is the plan value capitalized (`"Free"`/`"Standard"`/`"Pro"`). Renders nothing if `plan` is null. Canceling variant swaps to `bg-warning-light text-warning-foreground` + `" · Canceling"` suffix when `cancelAt` is non-null.

**Data flow:** unchanged — Navbar is a Client Component (`usePathname`, holds the sign-out form) accepting `plan: Plan | null` and `cancelAt: string | null` props, supplied by `app/(app)/layout.tsx`'s own `getUser()` + `profiles.plan, cancel_at` fetch.

### Hero Section

File: app/page.tsx + components/marketing/HeroContent.tsx (left column extracted Session 17)
Last updated: 2026-07-01 (gradient tokens, stagger entrance, CTA button spring, orb reconciliation)

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | `bg-background` page + 4-layer depth treatment (gradient wash, 3 orbs, bottom fade) — all `absolute pointer-events-none aria-hidden z-0`; orbs recolored to canonical spec: `bg-accent opacity-25 blur-[120px]` (×2) and `bg-accent-gradient-btn-end opacity-20 blur-[120px]` |
| Border            | none                                            |
| Border radius    | n/a                                              |
| Text — primary   | H1: `text-5xl sm:text-6xl font-semibold leading-[1.05] tracking-tight`; gradient span: `bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end bg-clip-text text-transparent`; plain span: `text-text-primary block` |
| Text — secondary | `text-lg leading-relaxed text-text-secondary max-w-lg` (subhead) |
| Spacing          | section: `relative isolate overflow-hidden pt-24 lg:pt-32 pb-24`; content: `max-w-6xl mx-auto px-6`; two-column grid: `grid grid-cols-1 lg:grid-cols-2 items-center gap-14 lg:gap-10` |
| Hover state      | Primary CTA: `whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}` + `hover:bg-accent-hover hover:shadow-[0_4px_28px_rgba(108,71,255,0.6)]`; reduced-motion: scale disabled |
| Shadow           | Primary CTA: `shadow-[0_4px_20px_rgba(108,71,255,0.3)]` at rest |
| Accent usage     | 2-stop gradient headline (dedicated gradient tokens); eyebrow Sparkles icon; Pill CTAs `bg-accent`; avatar uses `bg-accent` for one dot; social proof stars `fill-amber-400 text-amber-400` (sanctioned decorative exception, explicitly commented) |

**Pattern notes:**
Left column (copy stack) extracted to `components/marketing/HeroContent.tsx` (Client Component) for Framer Motion stagger entrance. Right column (`<BrowserDemo />`) stays in place in `app/page.tsx` (already its own Client Component). The page.tsx server component still renders the static 4-layer orb background and the two-column grid shell; `<HeroContent />` populates the left slot.

**Gradient headline:** migrated from the old 3-stop `from-accent via-purple-500 to-violet-400` (mixed Tailwind built-in colors with token) to the new 2-stop `from-accent-gradient-start to-accent-gradient-end` — the two gradient token utilities generated by `@theme`. Same migration applied to the CTA section's gradient H2. Always use these two token utilities for gradient headline text going forward — never re-introduce `via-purple-500` or `to-violet-400` raw Tailwind classes.

**Background orbs (reconciled Session 17):** hero preserves its established 3-orb depth layout (Session 8) but recolors all three to match ui-tokens.md's canonical Orb spec exactly. Orb 1 (`bg-accent opacity-25 blur-[120px]`) and the 3rd orb both use the canonical Orb 1 value — reusing it avoids inventing an undocumented third opacity level (prohibited by ui-tokens.md Invariants). The 3rd (bottom) orb uses Orb 2's color (`bg-accent-gradient-btn-end`, which is exactly `rgba(77,43,230,...)` — same RGB as the spec's Orb 2 value, now expressible via token rather than a raw rgba). Static, no drift animation (homepage orbs are not animated; only Login's orbs drift per spec).

**Stagger entrance (HeroContent.tsx):** hero left column staggers in using `staggerContainer`/`staggerItem` from `lib/motionVariants.ts`, 5 children (badge, H1, subtext, button row, social proof). Reduced motion reads from `useLazyReducedMotion()` from `lib/useLazyReducedMotion.ts`; when true, `initial="show"` skips all entrance animation.

**Primary CTA buttons:** updated shadow rgba from old-accent `rgba(91,78,232,...)` to current `rgba(108,71,255,...)` per ui-tokens.md's Generate button shadow spec. Spring hover/tap scale added via `motion(Link)` wrapper (`MotionLink = motion(Link)`). Gated by reduced motion.

**Decorative social proof colors (bg-rose-400/emerald-400/amber-400, fill-amber-400):** sanctioned exception, confirmed under the dark theme token system. Inline comment in HeroContent.tsx documents this explicitly so it won't be re-flagged in future reviews.

**Pill CTA buttons:** still `rounded-full px-7 h-12 text-base font-medium` (see Pill Button entry), distinct from app-interior buttons. Never mix.

### Step Card (How It Works)

File: components/marketing/StepCards.tsx (extracted Session 17)
Last updated: 2026-07-01 (whileInView stagger, framer-motion hover lift, shadow rgba fix)

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | `bg-surface`                                     |
| Border            | `border border-border`                          |
| Border radius    | `rounded-2xl`                                   |
| Text — primary   | `text-xl font-semibold text-text-primary` (title); `text-sm font-semibold text-accent uppercase tracking-wider` (step label) |
| Text — secondary | `text-text-secondary leading-relaxed text-sm` (description) |
| Spacing          | `p-8`; `mb-6` (icon chip to label); `mb-2` (label to title); `mb-3` (title to desc); container: `grid md:grid-cols-3 gap-6` inside `relative div` with `mt-16` |
| Hover state      | `whileHover={{ y: -4 }}` (framer-motion, not CSS translate) + `hover:shadow-[0_8px_30px_rgba(108,71,255,0.1)] transition-shadow duration-300` |
| Shadow           | none at rest; glow on hover only |
| Accent usage     | Icon chip `bg-accent-light rounded-xl`, icon `text-accent h-6 w-6`; step label `text-accent` |

**Pattern notes:**
Extracted to `components/marketing/StepCards.tsx` (Client Component) for framer-motion entrance and hover animations. The `STEPS` array moved into this component (was in `app/page.tsx`). The connector `ArrowRight` divs and the wrapping `<div className="mt-16 relative">` stayed in `app/page.tsx` as siblings to `<StepCards />` — the connector arrows are absolutely positioned relative to that wrapper, so this separation is structural.

**Stagger entrance (whileInView):** `motion.ol` with `staggerContainer` from `lib/motionVariants.ts` + `whileInView="show" viewport={{ once: true }}` — the one legitimate use of scroll-triggered `whileInView` in this project per ui-rules.md's "below-the-fold content effectively mounts when first visible" carve-out. Each `motion.li` gets `staggerItem` variants. Reduced motion (from `useLazyReducedMotion()`) sets `initial="show"` to skip; `whileInView` becomes a no-op on the already-settled element, which is harmless.

**Hover lift:** migrated from CSS `hover:-translate-y-1` to `whileHover={{ y: -4 }}` (framer-motion). This migration was forced by a technical constraint: once framer-motion's entrance variants own the `transform` property on an element, a separate CSS hover pseudo-class `transform` would be silently overridden by framer-motion's persistent inline `transform` style — the CSS hover would never visually apply. Solution: move the hover lift into framer-motion too. Shadow hover stays as a Tailwind CSS class (`hover:shadow-[...]`) since box-shadow doesn't conflict with framer-motion's transform ownership. Shadow rgba corrected from old-accent `rgba(91,78,232,0.1)` to `rgba(108,71,255,0.1)` (Pro card outer glow value per ui-tokens.md). Hover gated by reduced motion.

Semantic `<ol>`/`<li>` structure preserved (same as before extraction). `h-full` on each `<li>` ensures equal-height grid cards. Icon chip pattern (`h-12 w-12 rounded-xl bg-accent-light`, icon `h-6 w-6 text-accent`) is the canonical marketing-card icon chip — reuse for any future feature grid.

### Page Heading (interior pages)

File: app/(app)/profile/page.tsx
Last updated: 2026-06-29

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | none                                             |
| Border            | none                                            |
| Border radius    | n/a                                              |
| Text — primary   | text-2xl font-bold text-text-primary             |
| Text — secondary | n/a                                              |
| Spacing          | mb-6 (gap before page content below)             |
| Hover state      | n/a                                              |
| Shadow           | none                                              |
| Accent usage     | none                                              |

**Pattern notes:**
Left-aligned page title at the top of an authenticated interior page (`/profile`, and any future `/history`-style page), sitting directly inside the standard `max-w-[1280px] mx-auto px-6 py-8` main wrapper — distinct from the homepage's Hero heading, which is centered and part of a marketing section, not an app interior page. Any future authenticated page should open with this exact heading class before its content, rather than inventing a new title treatment.

**Deviation flagged 2026-06-30:** the Generate page redesign's heading spec used `text-2xl font-semibold tracking-tight text-text-primary` (no `mb-6`, `font-semibold` not `font-bold`, plus `tracking-tight`) instead of this documented pattern — see the new "Generate Page Shell" entry. This was built per the literal spec given for that session and not cross-checked against this entry at build time. Not corrected automatically since it's unclear whether this was an intentional new direction for interior headings or an oversight — flagged for the developer to decide whether Generate should be brought back in line with `/profile`, or whether this entry's pattern should be updated to match Generate going forward.

### Generate Page Shell

File: app/(app)/generate/page.tsx
Last updated: 2026-06-30

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | bg-background (page); bg-accent opacity-[0.08] (top-left orb); bg-accent-light opacity-50 (bottom-right orb) |
| Border            | none                                            |
| Border radius    | n/a                                              |
| Text — primary   | text-2xl font-semibold tracking-tight text-text-primary (heading — see Page Heading entry's flagged deviation) |
| Text — secondary | n/a                                              |
| Spacing          | wrapper relative min-h-screen overflow-hidden; inner container relative z-10 max-w-5xl mx-auto px-4 sm:px-8 py-10; grid mt-6 |
| Hover state      | n/a                                              |
| Shadow           | none                                            |
| Accent usage     | both background orbs use accent tokens          |

**Pattern notes:**
First authenticated interior page to use the homepage's background-orb depth treatment — two `absolute -z-10 aria-hidden pointer-events-none` orbs (top-left `bg-accent`, bottom-right `bg-accent-light`), same sanctioned ui-rules.md exception as the homepage/login orbs. Unlike the homepage hero (`z-0` + `isolate`) or the login page (`-z-10` + a `relative z-10` card), here only the inner content container carries `relative z-10` — there's no per-element z-10 needed since everything else is a normal in-flow descendant of that one positioned container. Grid is `grid grid-cols-1 lg:grid-cols-5 gap-5` with a single `<PitchForm profile={...} usage={...} />` as its only direct child — `PitchForm` itself returns the two grid-item divs (`lg:col-span-2` / `lg:col-span-3`) via a Fragment; see Pitch Form's entry. `max-w-5xl` here is wider than the project's standard `max-w-[1280px] mx-auto px-6 py-8` interior-page wrapper (Page Heading entry) — this page intentionally diverges from that shell to fit the two-column layout; any future two-column interior page should likely match this wrapper instead of the single-column one.

### Pricing Card

File: components/billing/PricingCards.tsx (extracted Session 19)
Last updated: 2026-07-01 (Pro card premium treatment, stagger entrance, hover lift)

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | Free/Standard: `bg-surface`; Pro: `bg-accent-light` (`#1E1736`) |
| Border            | Free/Standard: `border border-border`; Pro: no border (outer glow via shadow instead) |
| Border radius    | `rounded-2xl`                                    |
| Text — primary   | `text-xl font-semibold text-text-primary` (plan name); `text-3xl font-semibold text-text-primary` (price) |
| Text — secondary | `text-sm text-text-secondary` (pitch allowance + feature items) |
| Spacing          | Free/Standard: `p-6`; Pro: `p-8`; `mt-6 gap-2.5` (feature list); `mt-6` (CTA button) |
| Hover state      | `whileHover={{ y: -4 }}` (Free/Standard), `whileHover={{ y: -6 }}` (Pro); all cards: `boxShadow: "0 20px 40px rgba(108,71,255,0.1)"` on hover; spring stiffness:300/damping:20 |
| Shadow           | Free/Standard: `shadow-sm`; Pro: `shadow-[0_0_40px_rgba(108,71,255,0.1)]` at rest |
| Accent usage     | Check icons `text-accent`; Pro card `bg-accent-light` fill; "Best value" badge `bg-accent`; Pro glow blob `rgba(108,71,255,...)` |

**Pattern notes:**
Three-card grid extracted to `components/billing/PricingCards.tsx` (Client Component) for stagger entrance (0.1s staggerChildren — slightly longer than the 0.08s used elsewhere; deliberate, heavier cards benefit from a more deliberate reveal). Page-level orbs removed entirely (confirmed decision: orbs only on Login, Homepage, Pro card). The page shell (`max-w-5xl mx-auto px-4 sm:px-8 py-16`) stays in the server component.

**Pro card treatment (Session 19):** The premium card shifted from Standard (old `border-2 border-accent "Most popular"`) to Pro (`bg-accent-light` fill, "Best value" badge, pulsing glow blob). `bg-accent-light` (`#1E1736`) is a deep purple-navy that visually separates Pro from the flat `bg-surface` of Free/Standard — same value as `--color-accent-light` in the dark token system. The Pro card has no border (removed in favor of the outer glow shadow). Inside the Pro card, a `motion.div` blob (`absolute top-0 right-0, w-48 h-48, rounded-full, blur-[60px]`) pulses opacity `[0.15,0.25,0.15]` at 2.5s — matching the Pulsing glow pattern from ui-rules.md. The blob is wrapped in its own inner `overflow-hidden rounded-2xl` div so it clips to card bounds without also clipping the `-top-3` "Best value" badge which is a sibling of that container. Content (all text, features, CTA) sits in a `relative z-10` wrapper above the blob.

CTA button branches are unchanged in logic: `isCurrentPlan` → disabled "Current plan"; Free for logged-out → same disabled button; Standard/Pro for logged-in → `<UpgradeButton plan={card.id} />` (now has shadow + spring from Session 18); logged-out → `Link href="/login"` Primary pill. Feature checklist uses `Check` (16px, `text-accent shrink-0`) + text rows in `flex flex-col gap-2.5`.

### Upgrade Button / Manage Portal Button

Files: components/billing/UpgradeButton.tsx, components/billing/ManagePortalButton.tsx
Last updated: 2026-07-01 (motion spring + shadows added Sessions 18–19)

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | UpgradeButton: `bg-accent hover:bg-accent-hover` (Primary); ManagePortalButton: `bg-surface border border-border hover:bg-surface-secondary` (Secondary) |
| Border            | UpgradeButton: none; ManagePortalButton: `border border-border` |
| Border radius    | `rounded-lg`                                     |
| Text — primary   | `text-sm font-medium` — `text-accent-foreground` (Upgrade); `text-text-primary` (Manage) |
| Spacing          | UpgradeButton: `h-11 w-full`; ManagePortalButton: `h-9 px-4` |
| Hover state      | Both: `whileHover={{scale:1.02}} whileTap={{scale:0.98}}` spring via `motion.button`; UpgradeButton also: `hover:shadow-[0_4px_28px_rgba(108,71,255,0.6)]` |
| Shadow           | UpgradeButton: `shadow-[0_4px_20px_rgba(108,71,255,0.3)]` at rest (Upgrade button shadow from ui-tokens.md); ManagePortalButton: none |
| Accent usage     | UpgradeButton only — full accent background      |

**Pattern notes:**
Both are small, self-contained Client Components following the exact same fetch → redirect-or-error shape already established by `GoogleSignInButton` and `DemoForm`: local `isLoading`/`error` state, a `Loader2 animate-spin` + "Redirecting..." swap while in flight, an inline error banner reusing the canonical Inline Error Banner classes, and on success a hard `window.location.href` redirect to a Stripe-hosted URL (Checkout or the Customer Portal) rather than a Next.js route — deliberately not `router.push`, since the destination is an external Stripe-hosted page. Kept as two separate components rather than one shared "redirect button" abstraction with an endpoint prop — both are small enough that code-standards.md's "three similar lines is better than a premature abstraction" applies; do not merge them into a shared base unless a third near-identical button appears. `UpgradeButton` takes a `plan: "standard" | "pro"` prop and POSTs `{ plan }` to `/api/checkout`; `ManagePortalButton` takes no props and POSTs (empty body) to `/api/billing-portal`.

### Billing Section (Profile page)

File: app/(app)/profile/page.tsx
Last updated: 2026-06-30

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | bg-surface                                       |
| Border            | border border-border                            |
| Border radius    | rounded-xl (matches this page's existing Profile Form card — app-interior tier, not the marketing rounded-2xl tier used on /pricing) |
| Text — primary   | text-sm font-medium text-text-primary (heading)  |
| Text — secondary | text-sm text-text-secondary (plan summary line); text-sm text-warning-foreground (cancellation date line) |
| Spacing          | p-6, max-w-lg (matches Profile Form card exactly); mt-6 (gap from the form card above); mt-2 (summary line); mt-1 (cancellation line, directly under summary); mt-4 (action slot) |
| Hover state      | n/a on the card — lives in the child Link/button |
| Shadow           | shadow-sm                                        |
| Accent usage     | "View plans" link only — text-accent hover:underline |

**Pattern notes:**
Sits directly below the existing Profile Form card, same `max-w-lg` width cap and exact same card token set (`bg-surface border border-border rounded-xl shadow-sm p-6`) — a second standalone card on the page, not merged into the form. Action slot branches on plan: `free` → a plain text link to `/pricing` ("View plans", no button chrome, since there's nothing to manage yet); any paid plan → `<ManagePortalButton />`. Plan name in the summary line is capitalized to match the Navbar badge's capitalization convention (`plan.charAt(0).toUpperCase() + plan.slice(1)`) even though the spec's literal copy didn't specify casing — any future plan-name display should default to this same capitalized convention rather than showing the raw lowercase DB value.

**Cancellation line (added 2026-06-30):** when `cancel_at` is non-null, a `text-sm text-warning-foreground mt-1` line renders directly under the plan summary: "Your plan will end on {formatDate(cancel_at)} and revert to Free." Uses the shared `formatDate()` helper from `lib/utils.ts` (`"July 30, 2026"` style, no date library) — the same helper used by the Generate page's renewal banner. Always guarded by `cancelAt &&`, never called with a possibly-null value.

### Profile Page Layout

File: components/profile/ProfileLayout.tsx (new Session 18) + app/(app)/profile/page.tsx
Last updated: 2026-07-01

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | bg-surface (both cards)                          |
| Border            | border border-border (both cards)               |
| Border radius    | rounded-xl (both cards)                          |
| Spacing          | `max-w-lg` on both cards; `mt-6` between them; `p-6` inside each |
| Shadow           | shadow-sm (both cards)                           |
| Motion           | Left card slides in from left (`x: -24`), right card from right (`x: 24`); both use `panelTransition` (0.4s easeOut) from `lib/motionVariants.ts`; gated by `useLazyReducedMotion()` |

**Pattern notes:**
`app/(app)/profile/page.tsx` stays a Server Component (auth check + DB fetch). Both card wrappers and the billing card content (which previously lived inline in the page) were extracted into `components/profile/ProfileLayout.tsx` (Client Component) to enable the slide-in entrance animations — same extraction pattern used on the Generate page (where `PitchForm` is the Client Component owning the column wrappers).

Cards are stacked vertically (not side-by-side) but enter from opposite horizontal directions — the visual effect reads as "two things appearing from opposite sides" even in a vertical layout, which is the same `Page/panel slide-in` pattern from `ui-rules.md`.

### Profile Form

File: components/profile/ProfileForm.tsx
Last updated: 2026-07-01 (field stagger, Save button spring+ripple+shadow)

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | bg-surface (wrapping card, set by ProfileLayout) |
| Border            | none on the form itself                          |
| Border radius    | none on the form itself                          |
| Text — primary   | text-sm font-medium text-text-secondary mb-1 block (labels) |
| Text — secondary | n/a                                              |
| Spacing          | flex flex-col gap-4 (form), min-h-24 (textareas) |
| Hover state      | Save button: `whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}` (spring, gated by reducedMotion) |
| Shadow           | Save button: `shadow-[0_4px_20px_rgba(108,71,255,0.2)] hover:shadow-[0_4px_28px_rgba(108,71,255,0.5)]` (Save Changes values from ui-tokens.md) |
| Accent usage     | focus:ring-accent focus:border-accent on all fields; Save button bg-accent |

**Pattern notes:**
**Field stagger (added Session 18):** the three field groups (Services, Tone, Target Client) are wrapped in `motion.div variants={staggerContainer}`, each field in `motion.div variants={staggerItem}` — uses `staggerContainer`/`staggerItem` from `lib/motionVariants.ts`, same pattern as hero entrance and step cards.

**Save button (updated Session 18):** now a `motion.button` with relative `overflow-hidden` for ripple containment. Added Save Changes shadow values from `ui-tokens.md`'s Glow & Shadow Reference. `whileHover`/`whileTap` spring scale gated by `useLazyReducedMotion()`. Button keeps `self-start` (aligns left within the flex-col form, not full-width) and `flex items-center gap-2` on the inner `<span className="relative z-10">` content wrapper — required by the shimmer-and-ripple layering pattern (same two-layer structure as Generate button).

**Save ripple (added Session 18):** clicking Save (via `onClick` on the `motion.button`, separate from the `handleSubmit` on the form) records the click coordinates in a `Ripple` state. A `motion.span` renders absolutely at those coordinates (`left: x-50, top: y-50`, 100px diameter) and animates `scale 0 → 2.5, opacity 0.3 → 0` over 0.5s (`easeOut`), then `onAnimationComplete` clears the state. Key uses a monotonic `useRef` counter (not coordinates) to ensure each click creates a fresh mount even if clicked at the same pixel twice before the previous ripple finishes. When `reducedMotion` is true, `handleRipple` returns immediately without setting state — zero ripple renders.

Native `<select>` (not shadcn) for Tone is unchanged — still the correct choice for 3 fixed options. Inline success/error banners are unchanged. `saveProfile` server action, `handleSubmit`, all state management: byte-identical to before Session 18.

### Pitch Form

File: components/pitch/PitchForm.tsx
Last updated: 2026-07-01 (panel slide-in, badge stagger, generate button spring+shimmer+shadow fix)

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | bg-surface (form card + profile summary card)    |
| Border            | border border-border                            |
| Border radius    | rounded-2xl (upgraded from rounded-xl — Generate page redesign) |
| Text — primary   | text-sm font-medium text-text-primary (label, was text-text-secondary) |
| Text — secondary | text-xs text-text-secondary (usage indicator caption, profile summary captions) |
| Spacing          | form card p-6; profile summary card p-5; flex flex-col gap-4 (form internals); gap-5 (left column stack, between form/banner/summary card) |
| Hover state      | n/a on cards — handled by individual field/button/link states |
| Shadow           | shadow-sm                                        |
| Accent usage     | focus rings on the URL input; Primary button for Generate; accent-light badges in profile summary card; accent-light/accent-bordered Upgrade link when limit reached |

**Pattern notes:**
As of 2026-06-30 (Generate page redesign), `PitchForm` returns a React Fragment with **two top-level grid-item `motion.div`s** (as of Session 18, previously plain `div`s) — `lg:col-span-2` for the form + profile-card-or-banner stack, `lg:col-span-3` for `<PitchOutput>` — landing as direct children of the parent page's `grid grid-cols-1 lg:grid-cols-5` container. Any future component needing to populate multiple grid cells from one Client Component should use this Fragment pattern.

**Panel slide-in (added Session 18):** left column uses `panelTransition` (0.4s easeOut from `lib/motionVariants.ts`) with `initial={{ opacity: 0, x: -24 }}`, right column with `initial={{ opacity: 0, x: 24 }}`. Both gated by `useLazyReducedMotion()` (`initial={false}` when true, fully skipping framer-motion's animation machinery).

**Generate button (updated Session 18):**  
- Shadow corrected from old-accent `rgba(91,78,232,0.4)` to `rgba(108,71,255,0.3)` rest / `rgba(108,71,255,0.6)` hover (Generate button shadow values from ui-tokens.md).  
- Now a `motion.button` with `whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}` (spring, gated by reducedMotion).  
- Has `relative overflow-hidden flex items-center justify-center` — `overflow-hidden` contains the shimmer; `flex items-center justify-center` vertically centers the icon+text within the 44px height (the layout classes must stay on the button element, not only on the inner span).  
- Shimmer overlay (isLoading && !reducedMotion): a `motion.div aria-hidden absolute inset-0 z-0` with `background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)` animated `x: SHIMMER_X` (`["-100%","100%"]` module-level constant — stable reference to prevent animation restart on re-render) over 1.2s linear loop.  
- Button content wrapped in `<span className="relative z-10 flex items-center justify-center gap-2">` to sit above the shimmer.

**Service badge stagger (added Session 18):** the `flex flex-wrap gap-1.5` badge container in the Profile Summary Card is now a `motion.div variants={badgeContainer}`, each badge a `motion.span variants={badgeItem}` — uses `badgeContainer`/`badgeItem` from `lib/motionVariants.ts` (0.06s stagger, overshoot spring at stiffness 400/damping 10). Gated by `useLazyReducedMotion()` (`initial="show"` when true).

**Streaming (updated Session 22):** `generate()` no longer calls `response.json()`. Instead it reads the response as a stream via `response.body!.getReader()` + `TextDecoder`. Chunks arrive via `reader.read()` loop; each chunk is checked for the `__STREAM_ERROR__` sentinel (throws if found) **before** being appended to `fullText`. `setPitch` is called on every chunk to update the textarea in real time — `prev ? { ...prev, email_content: fullText }` keeps the existing pitch id while content grows. `pitch` is cleared to `null` at the start of each generation so the empty state shows briefly before the first chunk, then the streaming id `"streaming"` kicks in. `router.refresh()` fires after the while loop exits (stream complete), not during. `setIsLoading(false)` lives in `finally` — always runs. Both `handleSubmit` and `handleRegenerate` call the same `generate()` — no separate code paths. `GenerateResponse` type removed; early error responses (non-ok HTTP) are JSON-parsed inline. See route.ts for server-side sentinel emission and DB save logic.

**Streaming + metadata (updated Session 23):** The stream now includes a `__METADATA__` trailer as its last chunk (enqueued by the server after DB save). In the reader loop, when `chunk.includes("__METADATA__")`, the JSON is parsed and `setSubjectLines` is called. The trailer is stripped from `fullText` via `chunk.replace(/__METADATA__.*/, "")` before `continue`. Additionally, **post-loop split-chunk recovery**: after the while loop exits, `fullText` is checked for both sentinels again — necessary because a single `enqueue()` is not guaranteed to arrive as a single browser `read()` (proxies/edge runtimes can re-chunk). If `fullText.includes("__STREAM_ERROR__")` → throw. If `fullText.indexOf("__METADATA__") !== -1 && subjectLines.length === 0` → parse the embedded metadata and strip it from fullText. Then a final regex strips the `SUBJECT_LINES:/EMAIL:` markers: `const emailMatch = fullText.match(/EMAIL:\n([\s\S]*)/)` → `displayContent = emailMatch[1].trim() ?? fullText.trim()`. `setSubjectLines([])` is called at the start of `generate()` (same place as `setIsLoading(true)`) to clear stale subject lines from the previous generation before the new `__METADATA__` arrives.

### Usage Indicator (quota progress bar)

File: components/pitch/PitchForm.tsx
Last updated: 2026-06-30

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | bg-surface-secondary (track); bg-accent or bg-warning (fill, conditional) |
| Border            | none                                            |
| Border radius    | rounded-full (track and fill)                    |
| Text — primary   | text-xs font-medium ("N left" count, hidden at limit) |
| Text — secondary | text-xs text-text-secondary (usage caption)      |
| Spacing          | mt-4 (block from input above); mt-1.5 (bar from caption row) |
| Hover state      | none — static display                            |
| Shadow           | none                                            |
| Accent usage     | bg-accent fill under the limit; bg-warning fill at/over the limit |

**Pattern notes:**
Track is `h-1.5 w-full rounded-full bg-surface-secondary overflow-hidden`; fill is a child div with `style={{ width: '${percent}%' }}` — this is the project's one documented inline-style exception (see code-standards.md, added this session) since Tailwind has no className mechanism for a continuously-variable runtime percentage. The fill div carries `role="progressbar"` + `aria-valuenow`/`aria-valuemin`/`aria-valuemax` for accessibility. Fill color switches from `bg-accent` to `bg-warning` once the quota is reached — this is the first place in the app `bg-warning` (not `bg-warning-light`) is used directly as a fill/background color rather than a light tint. The "N left" count span is conditionally rendered (`hidden` entirely, not just visually hidden, once the limit is reached) rather than showing "0 left." Any future quota/limit indicator elsewhere in the app should reuse this exact track/fill/conditional-color pattern.

### Profile Summary Card

File: components/pitch/PitchForm.tsx
Last updated: 2026-06-30

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | bg-surface                                       |
| Border            | border border-border                            |
| Border radius    | rounded-2xl                                      |
| Text — primary   | text-sm font-medium text-text-primary ("Your profile" header; tone value) |
| Text — secondary | text-xs text-text-secondary (captions); text-xs font-medium text-accent (Edit link) |
| Spacing          | p-5 (card); mt-4 space-y-3 (body); mt-1.5 (badge wrapper) |
| Hover state      | Edit link only — hover:underline                 |
| Shadow           | shadow-sm                                        |
| Accent usage     | Edit link text-accent; service badges bg-accent-light text-accent |

**Pattern notes:**
Renders **only when the profile is complete** — mutually exclusive with the existing Inline Warning Banner (which still renders, unchanged, when `!profile || !profile.services?.trim()`). Lives inside `PitchForm`'s left-column stack, directly below the form card. Header row is `flex justify-between items-center` with the "Your profile" label on the left and a `Pencil` (12px) + "Edit" link to `/profile` on the right — this Edit-link pattern (small icon + text, `text-accent hover:underline`, no button styling) is new to the project and should be reused for any future "summary card with a link back to the source of truth" pattern. Services render as comma-split badges (`bg-accent-light text-accent text-xs font-medium rounded-md px-2 py-1`, `flex flex-wrap gap-1.5`) — falls back to a single badge if the free-text services field has no commas. This is a smaller `rounded-md` badge than the project's standard `rounded-full` Badge token from ui-tokens.md — intentional, this is a tag/chip pattern distinct from status badges (e.g. the Tone Badge), not a replacement for them.

### Demo Form

File: components/demo/DemoForm.tsx
Last updated: 2026-06-30

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | bg-surface (form card + output card)             |
| Border            | border border-border                            |
| Border radius    | rounded-2xl                                      |
| Text — primary   | text-sm font-medium text-text-primary (label, header) |
| Text — secondary | text-xs text-text-secondary (Copy button label)  |
| Spacing          | form card p-6; output card header px-6 py-4, body px-6 py-6; lg:col-span-2 / lg:col-span-3 grid split |
| Hover state      | Card: hover:shadow-md hover:border-border-strong; Copy: hover:text-text-primary hover:bg-surface-secondary |
| Shadow           | shadow-sm                                        |
| Accent usage     | Generate button bg-accent + glow-on-hover; Sign-up-CTA bg-accent-light/border-accent/30/text-accent |

**Pattern notes:**
A deliberately separate Client Component from `PitchForm`/`PitchOutput` — same Fragment two-grid-item structure (`lg:col-span-2` form stack / `lg:col-span-3` output card) and largely the same visual classes, but with **no shared imports or logic** between the authenticated and demo flows, per explicit instruction (the duplication is intentional, not drift — different lifecycles, different backing API route, different data model). If the real Pitch Form/Output patterns change visually in the future, `DemoForm` does not automatically inherit those changes and must be updated separately if parity is still wanted.

Differences from Pitch Form: no usage indicator, no profile summary card (no profile exists for anonymous visitors), no Regenerate button (one-shot, no regenerate concept), and the limit-reached state links to `/login` instead of `/pricing` with different copy ("Sign up to keep generating" / "You've used your free demo..."). `hasUsedDemo` is local state seeded from a server-passed `demoUsed` prop and flipped to `true` either by a successful generation or by the API returning `{ error: "demo_used" }` — never by re-querying the server, so the UI updates instantly off the existing fetch response.

The output card reuses the same "looks like static text, is actually an editable borderless textarea" technique as the corrected Pitch Output pattern (`border-0 outline-none bg-transparent whitespace-pre-wrap`) — content is editable before copying even though nothing here is ever persisted to a database. The empty state swaps its message based on `hasUsedDemo` (default: "Paste a URL above..."; already-used: "You've already tried the demo. Sign up to generate unlimited pitches.") — same Sparkles icon either way, only the copy changes.

### Pitch Output

File: components/pitch/PitchOutput.tsx
Last updated: 2026-07-07 (subject lines section, tone badge, token + key fixes)

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | bg-surface                                       |
| Border            | border border-border                            |
| Border radius    | rounded-2xl (upgraded from rounded-xl — Generate page redesign) |
| Text — primary   | text-sm font-medium text-text-primary (header label); text-sm leading-relaxed text-text-primary (textarea, subject line text) |
| Text — secondary | text-xs text-text-secondary (Copy/Regenerate button labels); text-xs font-medium text-text-muted uppercase tracking-wider (subject lines section heading); bg-surface-secondary text-text-muted text-xs rounded-full px-2.5 py-1 (tone badge) |
| Spacing          | header row px-6 py-4; divider border-b border-border; subject lines px-6 py-2 per row; body px-6 py-6; min-h-[28rem] flex flex-col h-full on the card itself |
| Hover state      | Card: hover:shadow-md hover:border-border-strong transition-all duration-200; Copy: hover:text-text-primary hover:bg-surface-secondary hover:shadow-[0_0_12px_rgba(255,255,255,0.1)]; Regenerate: hover:text-text-primary hover:bg-surface-secondary; Subject line row: hover:bg-surface-secondary transition-colors duration-150 cursor-pointer |
| Shadow           | shadow-sm                                        |
| Accent usage     | none directly — Copy/Regenerate/subject-copy are all Ghost-style; copied state uses text-success-foreground (Check icon) |

**Pattern notes:**
Restructured (2026-06-30) from a single `p-6` stacked card into a header/divider/body shell matching the new two-column Generate page layout: header row (`flex justify-between items-center px-6 py-4`) holds the "Generated email" label and a `flex gap-2` button cluster (Copy + Regenerate, both now `h-8 px-3 rounded-md text-xs` Ghost-style buttons — **this replaces the previous Primary-Regenerate/Secondary-Copy pairing**, the one place in the app that used to mix two button styles in one row). A `border-b border-border` divider separates the header from the body.

The body still uses a `<textarea>` for `email_content` — **do not replace this with static `<p>` tags**, even though it visually looks like plain paragraph text now (`border-0 outline-none bg-transparent`, `whitespace-pre-wrap`, no visible textarea chrome). This was deliberately restored after an initial redesign pass mistakenly rendered static paragraphs per a literal spec reading; the textarea's inline editability before copying is a load-bearing feature (`useState` seeded from `pitch.email_content`, reset via `useEffect` on a new `pitch` prop, edits never written back to Supabase per architecture.md's immutable-pitches-row rule). The "looks like text, is actually an editable textarea" treatment is the canonical pattern now — any future editable-content-that-should-look-static surface should use this same borderless/transparent textarea technique.

Copy uses `navigator.clipboard.writeText` with a 2-second "Copied ✓" label swap, no toast — unchanged. Regenerate shows `Loader2 animate-spin` while in flight — unchanged. Both buttons' core logic (`onClick`, disabled/loading state) is untouched from the pre-redesign version; only their visual treatment moved from Primary/Secondary to Ghost.

**Email reveal animation (added Session 18):** when `hasPitch` is true, the content area renders a `motion.div key={pitch?.id}` wrapping the textarea, with `initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}`. Keyed on `pitch.id` means every new pitch (initial generation or regeneration) re-mounts the motion.div and re-runs the entrance. When `reducedMotion` is true, `initial={false}` skips the animation. The motion.div has `className="h-full"` to preserve the height chain (outer card `h-full` → body `flex-1` → motion.div `h-full` → textarea `h-full min-h-full`). Empty state: no animation, no key.

**Copy button hover glow (added Session 18):** `hover:shadow-[0_0_12px_rgba(255,255,255,0.1)]` added alongside the existing `hover:bg-surface-secondary` — matches the "Copy button hover glow" value from ui-tokens.md's Glow & Shadow Reference table.

**Subject lines section (added Session 23):** renders only when `subjectLines.length > 0`. Appears between the header divider and the email body. Section label: `text-xs font-medium text-text-muted uppercase tracking-wider px-6 pt-4`. Each row: `flex items-center justify-between px-6 py-2 border-b border-border hover:bg-surface-secondary transition-colors duration-150 cursor-pointer`. The last row has `border-b-0` to avoid a double border above the body divider. Right side: a `Copy` icon (14px, `text-text-muted`) that turns `Check` (`text-success-foreground`, 14px) for 1.5s via a `copiedIndexTimer` ref. **Never use `text-green-500` for the copied check — always use `text-success-foreground` per ui-tokens.md invariant.** Subject line rows use `key={line}` (not `key={i}`) so React unmounts stale rows on regeneration. `copiedIndex` state is reset by a `useEffect` watching `subjectLines` to prevent a stale green check appearing on new lines after regeneration.

**Tone badge (added Session 23):** small pill in the header row between the "Generated email" label and the Copy/Regenerate cluster. Only renders when `hasPitch` is true. Classes: `bg-surface-secondary text-text-muted text-xs rounded-full px-2.5 py-1`. Content: `"{tone} · {wordCount} words"`. Word count is derived from `pitch.email_content.trim().split(/\s+/).length`. The component receives `tone` as an optional prop (default `"Professional"`) from `PitchForm`, which passes `profile?.tone ?? "Professional"`.

**Empty state:** unchanged in logic and classes from 2026-06-30.

### Dialog (Modal Overlay & Content Shell)

File: components/ui/dialog.tsx
Last updated: 2026-06-30 (dark theme — scrim token fix)

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | bg-surface (content shell); overlay uses bg-scrim |
| Border            | border border-border (content shell only — overlay has none) |
| Border radius    | rounded-xl (content shell only)                  |
| Text — primary   | text-lg font-semibold text-text-primary (DialogTitle) |
| Text — secondary | text-sm text-text-secondary (DialogDescription)  |
| Spacing          | p-6 (content shell), gap-4 (header-to-body), gap-2 (DialogHeader internal), gap-3 sm:flex-row sm:justify-end (DialogFooter) |
| Hover state      | Close button only — text-text-secondary hover:text-text-primary hover:bg-surface-secondary (Ghost button pattern) |
| Shadow           | shadow-sm (content shell only)                   |
| Accent usage     | none built into the primitive — any Primary action lives in the consumer's DialogFooter, same as Auth Card's "accent lives in the child, not the shell" precedent |

**Pattern notes:**
This is the only Dialog primitive in the project — every future modal must compose `Dialog`/`DialogContent`/`DialogHeader`/`DialogTitle`/`DialogDescription`/`DialogFooter` from this file rather than building a new overlay. Built on `@base-ui/react/dialog` (shadcn's "base-nova" style) — **not Radix**, correcting an assumption made when the Dialog decision was first proposed. `position: fixed` here is the one sanctioned use under `ui-rules.md`'s Do Nots exception added specifically for this component — `DialogOverlay` (`fixed inset-0`) and `DialogContent` (`fixed top-1/2 left-1/2 ... -translate-x-1/2 -translate-y-1/2`) are the only two places in the app permitted to use it. This file originated from `npx shadcn add dialog` and was fully restyled to strip every shadcn default token (`bg-popover`, `text-muted-foreground`, `bg-destructive`, `ring-foreground`, `font-heading`, etc.) — none of those tokens exist in this project's theme, so any future `shadcn add` for another primitive must get the same restyling treatment before use, never dropped in as-is. `DialogFooter` has no built-in button styling (unlike shadcn's original, which rendered its own `<Button>`) — every dialog supplies its own buttons using the existing Primary/Secondary/Ghost/Destructive token classes from `ui-rules.md`, exactly as Pitch History Row's delete-confirmation dialog does (Secondary for Cancel, Destructive for Delete). The Close button (`XIcon`, 16px) uses the Ghost button color/hover pair but with icon-only padding (`p-1.5`) rather than the text-button padding (`px-3 py-1.5`) — first icon-only ghost button in the app; any future icon-only dismiss/ghost action should match this exact sizing.

**Scrim fix (2026-06-30):** the overlay used to be `bg-text-primary/20` — under the old light theme that resolved to a dark, semi-transparent tint over a light backdrop (correct). After the dark theme conversion, `--color-text-primary` flipped to white, so the same class produced a translucent *white* wash over a dark backdrop — wrong direction for a modal scrim. Fixed by adding a dedicated `--color-scrim: rgba(0, 0, 0, 0.6)` token (documented in `ui-tokens.md`'s new "Modal Scrim" section) rather than dropping to a raw `bg-black/60` utility, consistent with this project's "tokens everywhere, no raw color classes" invariant. `bg-scrim` is now the only sanctioned way to darken a modal backdrop in this app.

### Pitch History Row

File: components/pitch/PitchHistoryRow.tsx
Last updated: 2026-06-30

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | none on the row itself — sits inside Pitch History List's Card |
| Border            | border-b border-border, last:border-0           |
| Border radius    | rounded-lg (hover background only)               |
| Text — primary   | text-sm text-text-primary (prospect URL)         |
| Text — secondary | text-xs text-text-muted (date · preview line)    |
| Spacing          | py-3 px-2 gap-4 (row), mt-0.5 (secondary line)   |
| Hover state      | Row: hover:bg-surface-secondary cursor-pointer transition-colors; Delete: Ghost button pattern (hover:text-text-primary hover:bg-surface-secondary) |
| Shadow           | none — shadow belongs to the parent Card         |
| Accent usage     | none directly — lives only in child dialogs' action buttons |

**Pattern notes:**
Matches `ui-rules.md`'s "Pitch History Row" spec verbatim (`flex items-center justify-between py-3 border-b border-border last:border-0 hover:bg-surface-secondary cursor-pointer px-2 rounded-lg transition-colors`), with one addition: `gap-4` between the text block and the Delete button, since the original spec predated the row having an inline action. The row's click target is a `div` with `role="button" tabIndex={0}` rather than a native `<button>`, because it needs to contain a real nested `<button>` for Delete — both the Delete button's `onClick` and `onKeyDown` call `event.stopPropagation()` so activating Delete (mouse or keyboard) never also fires the row's own open-detail handler. The row owns two independent `Dialog` instances directly (pitch detail + delete confirmation) rather than the parent list holding shared modal state, keeping each row fully self-contained — mirrors Pitch Output's pattern of owning all of its own interaction state. The detail dialog falls back to a muted "This pitch has no content." message instead of rendering an empty `<p>` when `email_content` is falsy — the same fail-safe-empty precedent as Pitch Output, applied to a dialog body instead of a whole-component `null` return, since a history row should stay visible and deletable even if its saved content is empty (unlike Pitch Output, which is showing an in-flight result that may not exist yet).

### Pitch History List

File: components/pitch/PitchHistoryList.tsx
Last updated: 2026-06-30

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | bg-surface (both the list Card and the empty-state Card) |
| Border            | border border-border                            |
| Border radius    | rounded-xl                                       |
| Text — primary   | n/a — no heading inside, the page supplies its own h1 |
| Text — secondary | text-sm text-text-muted (empty-state message)    |
| Spacing          | p-6 (card); empty state adds flex flex-col items-center text-center gap-3 py-16 |
| Hover state      | none on the container itself — hover lives on rows / the empty-state CTA |
| Shadow           | shadow-sm                                        |
| Accent usage     | bg-accent hover:bg-accent-hover text-accent-foreground on the empty-state CTA only (Primary button to /generate) |

**Pattern notes:**
Standard Card token set, identical to Auth Card / Step Card. This is the first empty state actually built anywhere in the app — instantiates `ui-rules.md`'s generic Empty States spec (muted message + optional lucide icon + CTA) using `Inbox` at the spec's exact 32px / `text-text-muted` sizing. Any future "empty list" state should reuse this same icon size/color/copy tone rather than inventing a new treatment. The non-empty branch is a single Card directly wrapping the mapped `PitchHistoryRow`s with no extra spacing between rows beyond what each row's own `border-b`/`py-3` already provides — do not add a wrapping `gap-*` here, the rows' own borders are the only separator.

### Stats Bar

File: app/page.tsx
Last updated: 2026-06-30

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | `bg-surface` per cell; `bg-border` on grid container (gap-px divider trick) |
| Border            | `border border-border` on container; 1px dividers via `gap-px bg-border` grid + `bg-surface` cells |
| Border radius    | `rounded-2xl` on container (with `overflow-hidden` to clip cells) |
| Text — primary   | `text-3xl sm:text-4xl font-semibold text-accent` (stat value) |
| Text — secondary | `text-sm text-text-secondary mt-1.5` (stat label) |
| Spacing          | container: `max-w-6xl mx-auto px-6 relative z-10 -mt-6`; cell: `px-6 py-8 flex flex-col items-center justify-center` |
| Hover state      | none |
| Shadow           | none — border provides the separation |
| Accent usage     | `text-accent` on stat values only |

**Pattern notes:**
The `gap-px bg-border` + `bg-surface` cell + `overflow-hidden` trick creates internal dividers without adding individual `border-r`/`border-b` utilities. The container's `rounded-2xl overflow-hidden` clips all four corners of the grid and rounds the dividers at the edges. The `z-10 -mt-6` on the wrapper creates a slight overlap with the hero section above, achieved via negative margin and a z-index above the hero's background layers. Any future grid-with-dividers layout (feature comparison table, pricing table) should use this same `gap-px bg-border` + cell `bg-surface` pattern rather than individual border utilities.

### CTA Section

File: components/marketing/CTAContent.tsx (extracted Session 17)
Last updated: 2026-07-01

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | `bg-surface` (card surface); glow orbs inside (`bg-accent opacity-10 blur-[80px]`/`blur-[60px]`) pulsing via framer-motion (opacity [0.3,0.7,0.3], 3.5s) |
| Border            | `border border-border` on card                  |
| Border radius    | `rounded-3xl` on card (24px — largest radius in the project, marketing-only) |
| Text — primary   | `text-3xl sm:text-5xl font-semibold leading-tight` H2; Line 1 `text-text-primary block`; Line 2 `bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end bg-clip-text text-transparent block` |
| Text — secondary | `text-lg text-text-secondary max-w-xl mx-auto mt-4 leading-relaxed` (subtext) |
| Spacing          | section: `py-20 lg:py-28 px-6`; card: `px-6 py-16 sm:px-12 sm:py-20`; badge `mb-6`; subtext `mt-4`; buttons `mt-8` |
| Hover state      | Primary CTA pill: `whileHover={{scale:1.03}} whileTap={{scale:0.97}}` spring via `motion(Link)`; secondary: `hover:bg-surface-secondary` |
| Shadow           | none |
| Accent usage     | badge `bg-accent-light text-accent`; H2 gradient uses dedicated gradient tokens; Primary pill CTA `bg-accent` with corrected shadow `rgba(108,71,255,0.3/0.6)` |

**Pattern notes:**
The CTA card uses `rounded-3xl` (24px) — the largest border radius in the project. This is a marketing-section-only value; interior app cards all use `rounded-xl` (12px) and marketing step cards use `rounded-2xl` (16px). The three-tier radius system is: `rounded-xl` (app interior) → `rounded-2xl` (marketing feature cards) → `rounded-3xl` (marketing CTA card, the single "hero" surface of the page). Never use `rounded-3xl` inside the authenticated app.

The CTA card holds two glow orbs (`bg-accent opacity-10` with extreme blur) as `absolute pointer-events-none aria-hidden` divs inside the card. The card is `relative overflow-hidden` and the content is `relative z-10`. These glows are the same depth treatment as the hero orbs (sanctioned exception per ui-rules.md) — the card's surface is still `bg-surface` (white), the orbs are decorative children. Badge before the H2 establishes the "no credit card required" trust signal — `inline-flex rounded-full border border-border bg-accent-light px-3 py-1 text-xs font-medium text-accent`.

### Browser Window Mock (animated)

File: components/marketing/BrowserDemo.tsx
Last updated: 2026-07-01 (Glass Card migration + shadow rgba fix)

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | `bg-[rgba(25,25,35,0.6)] backdrop-blur-[12px]` Glass Card (card); `bg-accent-light/30` (chrome bar); `bg-surface` (URL row); `bg-accent` (generate button, idle/typing); `bg-accent-light` (generate button, analyzing/writing); `bg-success-light` (generate button, done); `bg-accent-light/20` (email preview) |
| Border            | `border border-[rgba(255,255,255,0.08)]` Glass Card border on card; `border-b border-border` under chrome; `border border-border` on URL row and email preview |
| Border radius    | `rounded-2xl` (card); `rounded-lg` (URL row, generate button, email preview) |
| Text — primary   | `text-sm font-mono text-text-primary` (URL text); `text-sm text-text-secondary font-mono` (email preview lines); `font-medium` on first/last email lines |
| Text — secondary | `text-xs font-medium text-text-muted` (Prospect URL label); `text-xs font-medium text-text-secondary` (PitchSnap wordmark in chrome) |
| Spacing          | chrome: `px-4 py-3`; body: `p-5 flex flex-col gap-4`; URL row: `px-3 py-2`; email preview: `p-4 min-h-[10rem]` |
| Hover state      | none — decorative, `aria-hidden="true"` on the root |
| Shadow           | `shadow-[0_20px_60px_rgba(108,71,255,0.12)]` on card |
| Accent usage     | Sparkles icon `text-accent` in chrome; generate button `text-accent-foreground` (idle/typing) or `text-accent` (analyzing/writing); email preview `bg-accent-light/20` |

**Pattern notes:**
**Glass Card (migrated Session 17):** the outer card previously used `bg-surface/90 backdrop-blur-sm border-border` — now uses the canonical Glass Card Variant: `bg-[rgba(25,25,35,0.6)] border-[rgba(255,255,255,0.08)] backdrop-blur-[12px]`, consistent with the Login Card. Shadow rgba fixed from `rgba(91,78,232,...)` to `rgba(108,71,255,0.12)`. Nothing else in the component changed this session.

Promoted from a static inline mock in `app/page.tsx` to its own Client Component (`"use client"`) so it could carry a looping 5-phase animation (idle → typing → analyzing → writing → done) without forcing the homepage itself to become a Client Component — `app/page.tsx` still renders `<BrowserDemo />` from a Server Component, matching architecture.md's "UI state lives in Client Components only" boundary. Still every interactive-looking element is a `div`, never a real `button`/`input` — the animation drives visual state only, there is no real interactivity. The chrome bar's three traffic-light dots (`bg-red-400`, `bg-amber-400`, `bg-emerald-400`) remain the one sanctioned use of raw Tailwind color classes in the project (OS window-control semantics, not general UI tokens).

**Animation state machine:** single `phase` state (`"idle" | "typing" | "analyzing" | "writing" | "done"`) drives all conditional rendering — never split into per-phase sub-components. Durations: idle 1000ms, typing ~80ms/char, analyzing 2000ms, writing 400ms/line stagger + a 300ms settle gap before flipping to done, done 3000ms, then the whole cycle resets and loops indefinitely while mounted. Orchestrated by one root `useEffect` (empty deps) running an `async` loop that `await`s a `setTimeout`-backed `wait()` helper — not literal nested `setTimeout` calls — with a `cancelled` flag checked after every `await` plus `clearTimeout` in the cleanup function, so no timer fires and no `setState` runs after unmount. `prefers-reduced-motion` is checked once via `window.matchMedia` at the top of the same effect; if true, state is set directly to the done values and the loop never starts. The cursor blink (idle + typing phases only) uses a dedicated `.cursor-blink` keyframe class in `globals.css` (sharp on/off step, not `animate-pulse`'s smooth fade) — documented under a clearly commented section. Email lines reveal via opacity 0→1 + `translate-y-1.5`→`translate-y-0` with `transition-all duration-300`, staggered by incrementing a `visibleLines` count rather than animating each line's own characters. Any future component needing a similar "looping decorative demo" should reuse this exact orchestration pattern (single root effect, async/await timer wrapper, cancelled-flag + clearTimeout cleanup, reduced-motion short-circuit) rather than inventing a new one.

### Footer (Marketing)

File: app/page.tsx
Last updated: 2026-06-30

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | `bg-background` (page) — footer has no own background |
| Border            | `border-t border-border` (footer top); `border-t border-border` (bottom bar separator) |
| Border radius    | n/a — no card surface |
| Text — primary   | `text-lg font-semibold text-text-primary` (brand wordmark); `text-sm font-semibold text-text-primary` (column headings) |
| Text — secondary | `text-sm text-text-secondary hover:text-text-primary transition-colors duration-150` (footer links); `text-sm text-text-secondary` (brand tagline) |
| Spacing          | footer: `border-t border-border py-14 max-w-6xl mx-auto px-6`; top region: `flex flex-col lg:flex-row justify-between gap-10`; brand block: `max-w-xs`; link grid: `grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-14`; bottom bar: `mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between` |
| Hover state      | links: `hover:text-text-primary transition-colors duration-150` |
| Shadow           | none |
| Accent usage     | logo mark `bg-accent` background; Zap icon `text-accent-foreground` inside mark |

**Pattern notes:**
The footer `border-t border-border` is scoped within `max-w-6xl mx-auto` (not full-viewport-width), matching the spec. Brand logo mark uses `h-8 w-8 rounded-lg bg-accent flex items-center justify-center` with `Zap` icon `h-4 w-4 text-accent-foreground` — the same logo treatment specified in the design system (distinct from the Navbar's `h-9 w-9` gradient-based logo mark). Column headings use `mb-4` not a generic gap — list items below use `space-y-3` on `<ul>`. Bottom bar text `text-text-muted` (more faded than the link columns' `text-text-secondary`). All non-functional links use `href="#"` as placeholder — `/generate` (Features) and `/login` (Pricing) are the only wired links. Four column groups: Product, Company, Resources, Legal.

### Pill Button (Marketing CTA)

File: app/page.tsx
Last updated: 2026-06-30

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | Primary: `bg-accent hover:bg-accent-hover`; Secondary: `bg-transparent hover:bg-accent-light`; Outlined: `bg-surface hover:bg-surface-secondary border border-border` |
| Border            | Primary: none; Secondary: none; Outlined: `border border-border` |
| Border radius    | `rounded-full` (pill — marketing pages only) |
| Text — primary   | `text-accent-foreground` (Primary); `text-text-primary` (Secondary + Outlined) |
| Text — secondary | n/a |
| Spacing          | `px-7 h-12 text-base font-medium` — fixed height (48px), wider padding, larger text |
| Hover state      | Primary: `whileHover={{scale:1.03}} whileTap={{scale:0.97}}` spring via `motion(Link)` + `hover:bg-accent-hover` + `hover:shadow-[0_4px_28px_rgba(108,71,255,0.6)]`; Secondary: `hover:bg-accent-light`; Outlined: `hover:bg-surface-secondary` |
| Shadow           | Primary: `shadow-[0_4px_20px_rgba(108,71,255,0.3)]` at rest; corrected from old-accent per ui-tokens.md Glow & Shadow Reference |
| Accent usage     | Primary uses full accent background; Secondary hover uses `bg-accent-light` |

**Pattern notes:**
This is a **marketing-only** button variant — `rounded-full`, `h-12`, `text-base`, `px-7`. Never use it inside the authenticated app. The interior app uses `rounded-lg px-4 py-2 text-sm` per ui-rules.md. The pill shape signals "this is a landing page."

Shadow values corrected to dark-theme accent in Session 17: rest `rgba(108,71,255,0.3)` (Generate button shadow value) + hover `rgba(108,71,255,0.6)`. Three variants: Primary (solid accent + spring scale), Secondary (transparent + hover tint), Outlined (surface + border). Row layout: `flex flex-col sm:flex-row gap-4`, `justify-center` for CTA section, no `justify-center` for hero (left-aligned on desktop).

### Eyebrow Badge

File: app/page.tsx
Last updated: 2026-06-30

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | `bg-surface/70 backdrop-blur-sm` |
| Border            | `border border-border` |
| Border radius    | `rounded-full` |
| Text — primary   | `text-sm font-medium text-text-secondary` |
| Text — secondary | n/a |
| Spacing          | `inline-flex items-center gap-2 px-4 py-2 shadow-sm` |
| Hover state      | none (static label, not interactive) |
| Shadow           | `shadow-sm` |
| Accent usage     | Leading icon `text-accent` (Sparkles, `h-4 w-4`) |

**Pattern notes:**
Small pill-shaped label placed above the H1 in a hero section. The `bg-surface/70 backdrop-blur-sm` makes it semi-transparent over the hero gradient background — both classes are required together. Always has an icon before the text (`gap-2` between icon and label). Text is `text-text-secondary` not `text-text-primary` — intentionally muted, since the H1 is the primary visual target. Not interactive — do not add hover states or link wrapping. If used in a non-hero context (e.g. a feature section heading), the `backdrop-blur-sm` is optional (it only matters when there's a gradient behind it).

---

## Token Baseline — Established 2026-06-30 (Dark Theme Conversion, Session 1)

[Note: not from `/imprint audit` — there's no prior audit on record for this project. This is the new `@theme` token block from `app/globals.css`, captured as the registry's color baseline since every existing component entry above still documents its *class names* (`bg-surface`, `text-text-primary`, etc.) which are now backed by these dark values instead of the original light ones. Class names referenced throughout this registry did not change — only what they resolve to.]

| Token                              | Value                       |
| ----------------------------------- | ---------------------------- |
| `--color-background`                | `#0D0D18`                    |
| `--color-surface`                   | `#131320`                    |
| `--color-surface-secondary`         | `#1E1E2E`                    |
| `--color-surface-muted`             | `#1A1A28`                    |
| `--color-border`                    | `#252538`                    |
| `--color-border-strong`             | `#32324A`                    |
| `--color-scrim` (new)               | `rgba(0, 0, 0, 0.6)`         |
| `--color-text-primary`              | `#FFFFFF`                    |
| `--color-text-secondary`            | `#C4C4D8`                    |
| `--color-text-muted`                | `#9B9BB4`                    |
| `--color-accent`                    | `#6C47FF`                    |
| `--color-accent-hover`              | `#5A38E8`                    |
| `--color-accent-light`              | `#1E1736`                    |
| `--color-accent-muted`              | `#1A1530`                    |
| `--color-accent-foreground`         | `#FFFFFF`                    |
| `--color-accent-gradient-start` (new) | `#A88BFF`                  |
| `--color-accent-gradient-end` (new)   | `#6C47FF`                  |
| `--color-accent-gradient-btn-start` (new) | `#6C47FF`              |
| `--color-accent-gradient-btn-end` (new)   | `#4D2BE6`              |
| `--color-success` / `-light` / `-foreground` | `#12B76A` / `#0F2E22` / `#4ADE9C` |
| `--color-warning` / `-light` / `-foreground` | `#F59E0B` / `#2E2410` / `#FBBF55` |
| `--color-error` / `-light` / `-foreground`   | `#F24444` / `#2E1414` / `#FF8080` |

**Components fixed this session to match the baseline:** `components/ui/dialog.tsx` (scrim), `components/layout/Navbar.tsx` (frosted glass → `bg-surface`, logo text → `text-accent-foreground`).

**Dark theme conversion complete as of Session 19 (2026-07-01).** All old-accent `rgba(91,78,232,...)` values have been confirmed eliminated from the entire codebase (verified via grep — zero matches). All components below have been audited and updated during Sessions 16–19:

✅ Navbar, Dialog (scrim), globals.css token block — Session 16
✅ Login Card, LoginOrbs, GoogleSignInButton, Hero Section, HeroContent, Step Card (StepCards), CTA Section (CTAContent), Browser Window Mock (BrowserDemo), Hero gradient tokens — Session 17
✅ Pitch Form, Pitch Output, Profile Form, Profile Layout, UpgradeButton, lib/useLazyReducedMotion, lib/motionVariants — Sessions 17–18
✅ Pricing Card (PricingCards), History List (PitchHistoryList search/stagger), Demo Form, loading/error/not-found animations, ManagePortalButton — Session 19

**Remaining sanctioned exceptions** (not stale — intentional non-token values per prior decisions):
- Google "G" SVG brand hex fills (`#4285F4`/`#34A853`/`#FBBC05`/`#EA4335`) in `GoogleSignInButton.tsx` — third-party brand colors, documented exception
- Decorative avatar/star dot colors (`bg-rose-400`, `bg-emerald-400`, `bg-amber-400`, `fill-amber-400`) in `HeroContent.tsx` — sanctioned decorative exception per original design brief, commented inline
- Browser demo traffic-light dots (`bg-red-400`, `bg-amber-400`, `bg-emerald-400`) in `BrowserDemo.tsx` — OS chrome semantics, not UI tokens
- Glass Card raw rgba values (`bg-[rgba(25,25,35,0.6)]`, `border-[rgba(255,255,255,0.08)]`) — the Glass Card Variant is intentionally defined as raw rgba (multiple CSS properties, not a single color) and is documented in `ui-tokens.md`'s Glass Card Variant section and `ui-rules.md`'s Cards section
- Pro card glow blob `rgba(108,71,255,1)` with animated opacity — a sanctioned inline rgba per `ui-tokens.md`'s Glow & Shadow Reference ("glows require rgba for opacity control that flat tokens can't express")
