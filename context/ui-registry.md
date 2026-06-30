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
This is the standard centered single-card auth/empty-page layout — `min-h-screen flex items-center justify-center bg-background px-6` wrapping one `max-w-sm` card. Any future single-action page (e.g. a future password-reset or invite-accept page) should reuse this exact shell rather than inventing a new container pattern. The card itself holds no interactive elements — buttons/forms are separate child components dropped inside it. Also reused verbatim by `app/error.tsx` (error boundary, "Try again" reset button) and `app/not-found.tsx` (404 page, link back to `/generate`) — both are one-off single-action pages in exactly this shape.

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
Last updated: 2026-06-30

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | backdrop-blur-md bg-white/80 (frosted glass — was bg-surface) |
| Border            | border-b border-border                         |
| Border radius    | none (header bar) — rounded-lg on the logo mark only |
| Text — primary   | font-bold text-text-primary (wordmark)          |
| Text — secondary | text-text-secondary font-medium text-sm (inactive nav link) |
| Spacing          | px-6 (header), gap-2 (logo + wordmark), gap-6 (nav links) |
| Hover state      | Sign-out only — Ghost button: hover:text-text-primary hover:bg-surface-secondary |
| Shadow           | none                                             |
| Accent usage     | text-accent font-medium text-sm (active nav link); logo mark background uses `linear-gradient(45deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)` via inline style (CSS-var reference, not hardcoded hex) |

**Pattern notes:**
Fixed 64px height (`h-16`), full viewport width, bottom border only — matches ui-rules.md's Navbar spec, with one upgrade: `bg-white/80` + `backdrop-blur-md` for a frosted-glass effect over scrolled content (Linear/Vercel-style polish pass), replacing the flat `bg-surface` it shipped with originally. Logo mark is a 36×36px (`w-9 h-9`) `rounded-lg` gradient square with a white bold "P", paired with the "PitchSnap" text wordmark — this is the one and only logo treatment, reuse it anywhere else the brand mark appears. Active nav state is color-only (no underline/background), determined by exact pathname match. Sign-out uses the Ghost button pattern from ui-rules.md (`text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded-lg px-3 py-1.5 text-sm`), not the Secondary button style it briefly had on the `/generate` stub. Navbar is a Client Component (`usePathname` for active state, holds the sign-out form) — the `app/(app)/layout.tsx` that renders it stays a Server Component, per code-standards.md's "never `use client` in layout files" rule.

### Hero Section

File: app/page.tsx
Last updated: 2026-06-30

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | `bg-background` page + 4-layer depth treatment (gradient wash, 3 floating orbs, bottom fade) — all `absolute pointer-events-none aria-hidden z-0` |
| Border            | none                                            |
| Border radius    | n/a                                              |
| Text — primary   | `text-5xl sm:text-6xl font-semibold leading-[1.05] tracking-tight` H1; gradient span: `bg-gradient-to-r from-accent via-purple-500 to-violet-400 bg-clip-text text-transparent`; plain span: `text-text-primary block` |
| Text — secondary | `text-lg leading-relaxed text-text-secondary max-w-lg` (subhead) |
| Spacing          | section: `relative isolate overflow-hidden pt-24 lg:pt-32 pb-24`; content: `max-w-6xl mx-auto px-6`; two-column grid: `grid grid-cols-1 lg:grid-cols-2 items-center gap-14 lg:gap-10` |
| Hover state      | n/a — handled by child button/link classes |
| Shadow           | none on section; browser window mock: `shadow-[0_20px_60px_rgba(91,78,232,0.12)]` |
| Accent usage     | Gradient headline; eyebrow badge Sparkles icon; browser window bg-accent-light/30 chrome; Pill CTAs (`bg-accent hover:bg-accent-hover text-accent-foreground`); avatar uses `bg-accent` for one dot; social proof stars `fill-amber-400 text-amber-400` |

**Pattern notes:**
Full two-column marketing hero: left column holds copy stack (eyebrow badge → H1 → subtext → button row → social proof), right column holds a static browser window mock. Left column is `flex flex-col items-center text-center lg:items-start lg:text-left` — centered on mobile, left-aligned on desktop. Content wrapper is `relative z-10` over the 4-layer background depth treatment — this z-layering is **required**: in-flow static content paints before `z-index: 0` positioned siblings, so without it the orbs render on top of text.

**Background layers (Session 8):** upgraded from 2 orbs to a 4-layer system: (1) full-bleed gradient wash `bg-gradient-to-b from-accent-light/40 to-transparent`, (2) three orbs of varying sizes/opacities using `bg-accent` and `bg-accent-light` with `blur-[120px]`/`blur-[100px]`/`blur-[80px]`, (3) bottom fade `bg-gradient-to-t from-background to-transparent h-48`. All layers carry `pointer-events-none aria-hidden z-0`. The hero section itself uses `isolate` (creates stacking context) + `overflow-hidden` (clips orbs) + `relative` (establishes positioning context for all layers). This is the sanctioned exception to ui-rules.md's no-gradient rule — page depth only, never on card surfaces.

**Pill CTA buttons:** hero uses a new `rounded-full px-7 h-12 text-base font-medium` button variant (see Pill Button entry), distinct from the app's interior `rounded-lg px-4 py-2 text-sm` Primary button. Never mix these styles — pill buttons are marketing-only, rounded-lg buttons are app-interior only.

**Social proof row:** avatar stack (`flex -ml-2` overlap on non-first items, `ring-2 ring-surface` creates the bordered-circle look), 5× `Star` lucide icons `fill-amber-400 text-amber-400`, caption with `font-semibold text-text-primary` on the count. The `ring-surface` trick requires `ring-2` to work — both classes required together.

**Browser window mock:** see Browser Window Mock entry — purely static HTML, zero JS.

### Step Card (How It Works)

File: app/page.tsx
Last updated: 2026-06-30

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | bg-surface                                       |
| Border            | border border-border                            |
| Border radius    | rounded-2xl (upgraded from rounded-xl in Session 8) |
| Text — primary   | `text-xl font-semibold text-text-primary` (title); `text-sm font-semibold text-accent uppercase tracking-wider` (step label) |
| Text — secondary | `text-text-secondary leading-relaxed text-sm` (description) |
| Spacing          | `p-8` (upgraded from p-6); `mb-6` (icon chip to label gap); `mb-2` (label to title); `mb-3` (title to description); container: `grid md:grid-cols-3 gap-6` inside `relative div` with `mt-16` |
| Hover state      | `hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(91,78,232,0.1)] transition-all duration-300` — no border color change (replaces old shadow-md + border-strong pattern) |
| Shadow           | none at rest (no `shadow-sm`); custom glow on hover only |
| Accent usage     | Icon chip: `bg-accent-light rounded-xl` container, icon `text-accent h-6 w-6`; step label `text-accent` |

**Pattern notes:**
Semantic `<li>` inside `<ol>` (not `<div>`) — first time a non-div is used for a card in this project. The `h-full` on each `<li>` keeps cards equal height within the grid row. Icon chip is always `h-12 w-12 rounded-xl bg-accent-light` with the feature icon at `h-6 w-6 text-accent` inside — this is the canonical icon-chip pattern for any future marketing feature card.

Step label renders as `text-sm font-semibold text-accent uppercase tracking-wider` (e.g. "STEP 1") above the title — this replaces the old plain `text-accent font-bold text-sm` step number. Uppercase + tracking-wider is the new convention for marketing section step labels; do not use this style inside the app (interior pages use the Page Heading + Section Heading hierarchy from ui-rules.md instead).

Hover lift uses `-translate-y-1` + a custom `rgba()` shadow — same color as the accent but at low opacity, giving a glow-lift rather than the border-darkening pattern used by app-interior interactive cards (Pitch Output, history rows). The `-translate-y-1` is homepage-only; do not apply translate transforms to cards in the authenticated app.

Connectors: two `ArrowRight` icons (lucide, `h-7 w-7 text-text-muted`) are `hidden md:block absolute` divs placed **as siblings to** the `<ol>` inside a wrapping `relative div` — they cannot be `<li>` children (invalid HTML), so the wrapping `relative div` is required. Positioned at `left-1/3` and `left-2/3` with `-translate-x-1/2 top-1/2 -translate-y-1/2` to center them at the column boundaries.

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

### Profile Form

File: components/profile/ProfileForm.tsx
Last updated: 2026-06-29

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | bg-surface (wrapping card, set by the page, not the form) |
| Border            | none on the form itself — card border comes from the page wrapper |
| Border radius    | none on the form itself                          |
| Text — primary   | text-sm font-medium text-text-secondary mb-1 block (labels) |
| Text — secondary | n/a                                              |
| Spacing          | flex flex-col gap-4 (form), min-h-24 (textareas) |
| Hover state      | n/a — handled by individual field focus states  |
| Shadow           | none on the form itself                          |
| Accent usage     | focus:ring-accent focus:border-accent on all fields; Primary button for Save |

**Pattern notes:**
This is the first form in the app, and the first use of a native `<select>` — code-standards.md's dependency check (shadcn? Next.js native? simpler solution?) favored a plain `<select>` styled with the same token classes as text inputs over installing a shadcn primitive, since the field has only 3 fixed options. Textareas here use the standard "Forms and Inputs" token set (`min-h-24`, no `font-mono`) — NOT the "Textarea — Pitch Output" pattern, which is reserved specifically for editing generated email content. Inline success/error banners reuse the exact Inline Error Banner classes (swap `error-*` tokens for `success-*` on the success path). The form is always wrapped in a Card (`bg-surface border border-border rounded-xl shadow-sm p-6`) by its parent page — the form component itself carries no surface styling, so it can be dropped into any card-shaped container. The wrapping card in `app/(app)/profile/page.tsx` additionally constrains width with `max-w-lg` — any future single-form content card (not a multi-column grid like the homepage's Step Cards) should match this same width cap rather than stretching full-width. Server Component (`app/(app)/profile/page.tsx`) fetches the existing `profiles` row and passes it as `initialData` — the Client Component never reads the DB directly, per architecture.md's client/server boundary rule. `saveProfile` (`actions/profile.ts`) upserts on `user_id`, so this same form/action pair works identically for a brand-new user (no row yet) and a returning user (row exists).

### Pitch Form

File: components/pitch/PitchForm.tsx
Last updated: 2026-06-29

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | bg-surface (its own card, unlike Profile Form)   |
| Border            | border border-border                            |
| Border radius    | rounded-xl                                       |
| Text — primary   | text-sm font-medium text-text-secondary mb-1 block (label) |
| Text — secondary | n/a                                              |
| Spacing          | p-6, flex flex-col gap-4 (form), gap-6 (form + output stack) |
| Hover state      | n/a — handled by individual field/button states  |
| Shadow           | shadow-sm                                        |
| Accent usage     | focus:ring-accent on the URL input; Primary button for Generate |

**Pattern notes:**
Unlike Profile Form, this component owns its own Card shell (`bg-surface border border-border rounded-xl shadow-sm p-6`) directly rather than relying on the parent page to wrap it — there's no multi-section page layout here that needs the page to control card width, just a single stacked column (`max-w-2xl` on the page). It also owns all interaction state (URL value, current pitch result, loading, error) and unconditionally renders Pitch Output beneath itself (as of 2026-06-30 — previously only mounted once a result existed; Pitch Output itself now owns the empty-vs-filled branching, see its own entry) — this is the one component in the app responsible for both a form AND its result display, intentionally, to avoid introducing an undocumented third wrapper file beyond what architecture.md lists (`PitchForm.tsx` + `PitchOutput.tsx` only). Regenerate calls the identical `generate()` function used for the initial submit, but passes `pitch.prospect_url` explicitly — not whatever is currently sitting in the URL input — so editing the input after a successful generate without resubmitting can't silently redirect a "Regenerate" click to a different prospect. The URL input is also `disabled` (with the standard `disabled:opacity-50 disabled:cursor-not-allowed` treatment already used on buttons app-wide) for the duration of any request — first time that exact disabled treatment has been applied to a text input rather than a button; any future input that needs to lock during an async action should reuse this same pairing. The Generate button now shows a `Loader2 animate-spin` icon alongside its "Generating..." text (not replacing it) while loading, and gets an indigo glow on hover (`hover:shadow-[0_0_20px_rgba(91,78,232,0.4)]`) — this glow is Generate-button-only, not a token-level Primary button upgrade; Regenerate and other Primary buttons elsewhere don't get it.

### Pitch Output

File: components/pitch/PitchOutput.tsx
Last updated: 2026-06-30

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | bg-surface                                       |
| Border            | border border-border                            |
| Border radius    | rounded-xl                                       |
| Text — primary   | font-mono text-sm text-text-primary (textarea)   |
| Text — secondary | n/a                                              |
| Spacing          | p-6 (card), flex flex-col gap-4, gap-3 (button row); empty state adds flex flex-col items-center text-center gap-3 py-16 |
| Hover state      | Card: hover:shadow-md hover:border-border-strong transition-all duration-200 (added 2026-06-30); Regenerate: standard Primary hover; Copy: standard Secondary hover |
| Shadow           | shadow-sm                                        |
| Accent usage     | focus:ring-accent on textarea; Primary button for Regenerate |

**Pattern notes:**
Textarea uses the exact "Textarea — Pitch Output" token set from ui-tokens.md (`font-mono`, `min-h-64`, `resize-none`) — the only place in the app that pattern applies. The textarea is locally editable (`useState` seeded from `pitch.email_content`, reset via `useEffect` whenever a new `pitch` prop arrives) but edits are never written back to Supabase — `pitches` rows are immutable per architecture.md's schema comment, so editing is purely a pre-copy convenience. Regenerate is styled Primary (it's the main action of this card, distinct from the Generate card above it) while Copy is styled Secondary — the only place in the app two button styles sit side by side in one row. Copy uses `navigator.clipboard.writeText` with a 2-second "Copied ✓" label swap (changed from "Copied!" on 2026-06-30), no toast. Regenerate now also shows a `Loader2 animate-spin` icon alongside its "Regenerating..." text while in flight.

**Empty state (rewritten 2026-06-30):** the `pitch` prop is now `Pitch | null`, and `PitchForm` always mounts this component instead of conditionally rendering it. When `!pitch || !pitch.email_content`, it renders a Sparkles-icon (32px, `text-text-muted`) placeholder with the copy "Paste a URL above and click Generate Pitch to get started" — this **replaces** the previous behavior of returning `null` for both "no pitch yet" and "pitch with empty content." The card itself (both empty and filled branches) carries the same hover-lift treatment as Step Cards, with an inline "interactive card — hover lift intentional" comment marking it as a deliberate exception alongside Step Cards — see that entry's note on scoping hover lift to interactive/repeated cards only. Any future component that can be mounted before it has anything to show should follow this same "always mount, branch internally on emptiness" pattern rather than the old null-return approach.

### Dialog (Modal Overlay & Content Shell)

File: components/ui/dialog.tsx
Last updated: 2026-06-30

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | bg-surface (content shell); overlay uses bg-text-primary/20 |
| Border            | border border-border (content shell only — overlay has none) |
| Border radius    | rounded-xl (content shell only)                  |
| Text — primary   | text-lg font-semibold text-text-primary (DialogTitle) |
| Text — secondary | text-sm text-text-secondary (DialogDescription)  |
| Spacing          | p-6 (content shell), gap-4 (header-to-body), gap-2 (DialogHeader internal), gap-3 sm:flex-row sm:justify-end (DialogFooter) |
| Hover state      | Close button only — text-text-secondary hover:text-text-primary hover:bg-surface-secondary (Ghost button pattern) |
| Shadow           | shadow-sm (content shell only)                   |
| Accent usage     | none built into the primitive — any Primary action lives in the consumer's DialogFooter, same as Auth Card's "accent lives in the child, not the shell" precedent |

**Pattern notes:**
This is the only Dialog primitive in the project — every future modal must compose `Dialog`/`DialogContent`/`DialogHeader`/`DialogTitle`/`DialogDescription`/`DialogFooter` from this file rather than building a new overlay. Built on `@base-ui/react/dialog` (shadcn's "base-nova" style) — **not Radix**, correcting an assumption made when the Dialog decision was first proposed. `position: fixed` here is the one sanctioned use under `ui-rules.md`'s Do Nots exception added specifically for this component — `DialogOverlay` (`fixed inset-0`) and `DialogContent` (`fixed top-1/2 left-1/2 ... -translate-x-1/2 -translate-y-1/2`) are the only two places in the app permitted to use it. This file originated from `npx shadcn add dialog` and was fully restyled to strip every shadcn default token (`bg-popover`, `text-muted-foreground`, `bg-destructive`, `ring-foreground`, `font-heading`, etc.) — none of those tokens exist in this project's theme, so any future `shadcn add` for another primitive must get the same restyling treatment before use, never dropped in as-is. The overlay's tint (`bg-text-primary/20`) deliberately reuses an existing token instead of shadcn's hardcoded `bg-black/10` default. `DialogFooter` has no built-in button styling (unlike shadcn's original, which rendered its own `<Button>`) — every dialog supplies its own buttons using the existing Primary/Secondary/Ghost/Destructive token classes from `ui-rules.md`, exactly as Pitch History Row's delete-confirmation dialog does (Secondary for Cancel, Destructive for Delete). The Close button (`XIcon`, 16px) uses the Ghost button color/hover pair but with icon-only padding (`p-1.5`) rather than the text-button padding (`px-3 py-1.5`) — first icon-only ghost button in the app; any future icon-only dismiss/ghost action should match this exact sizing.

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

File: app/page.tsx
Last updated: 2026-06-30

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | `bg-surface` (card surface); glow orbs inside via `bg-accent opacity-10 blur-[80px]`/`blur-[60px]` (depth only) |
| Border            | `border border-border` on card                  |
| Border radius    | `rounded-3xl` on card (24px — largest radius in the project, marketing-only) |
| Text — primary   | `text-3xl sm:text-5xl font-semibold leading-tight` H2; Line 1 `text-text-primary block`; Line 2 `bg-gradient-to-r from-accent to-violet-400 bg-clip-text text-transparent block` |
| Text — secondary | `text-lg text-text-secondary max-w-xl mx-auto mt-4 leading-relaxed` (subtext) |
| Spacing          | section: `py-20 lg:py-28 px-6`; card: `px-6 py-16 sm:px-12 sm:py-20`; badge `mb-6`; subtext `mt-4`; buttons `mt-8` |
| Hover state      | Pill CTAs — see Pill Button entry; secondary: `hover:bg-surface-secondary` |
| Shadow           | none |
| Accent usage     | badge `bg-accent-light text-accent`; H2 gradient `from-accent to-violet-400`; Primary pill CTA |

**Pattern notes:**
The CTA card uses `rounded-3xl` (24px) — the largest border radius in the project. This is a marketing-section-only value; interior app cards all use `rounded-xl` (12px) and marketing step cards use `rounded-2xl` (16px). The three-tier radius system is: `rounded-xl` (app interior) → `rounded-2xl` (marketing feature cards) → `rounded-3xl` (marketing CTA card, the single "hero" surface of the page). Never use `rounded-3xl` inside the authenticated app.

The CTA card holds two glow orbs (`bg-accent opacity-10` with extreme blur) as `absolute pointer-events-none aria-hidden` divs inside the card. The card is `relative overflow-hidden` and the content is `relative z-10`. These glows are the same depth treatment as the hero orbs (sanctioned exception per ui-rules.md) — the card's surface is still `bg-surface` (white), the orbs are decorative children. Badge before the H2 establishes the "no credit card required" trust signal — `inline-flex rounded-full border border-border bg-accent-light px-3 py-1 text-xs font-medium text-accent`.

### Browser Window Mock

File: app/page.tsx
Last updated: 2026-06-30

| Property         | Class                                          |
| ---------------- | ----------------------------------------------- |
| Background       | `bg-surface/90 backdrop-blur-sm` (card); `bg-accent-light/30` (chrome bar); `bg-surface` (URL row); `bg-accent` (generate button); `bg-accent-light/20` (email preview) |
| Border            | `border border-border` on card; `border-b border-border` under chrome; `border border-border` on URL row and email preview |
| Border radius    | `rounded-2xl` (card); `rounded-lg` (URL row, generate button, email preview) |
| Text — primary   | `text-sm font-mono text-text-primary` (URL text); `text-sm text-text-secondary font-mono` (email preview lines); `font-medium` on first/last email lines |
| Text — secondary | `text-xs font-medium text-text-muted` (Prospect URL label); `text-xs font-medium text-text-secondary` (PitchSnap wordmark in chrome) |
| Spacing          | chrome: `px-4 py-3`; body: `p-5 flex flex-col gap-4`; URL row: `px-3 py-2`; email preview: `p-4 min-h-[10rem]` |
| Hover state      | none — static HTML only, no JS |
| Shadow           | `shadow-[0_20px_60px_rgba(91,78,232,0.12)]` on card |
| Accent usage     | Sparkles icon `text-accent` in chrome; generate button `bg-accent text-accent-foreground`; email preview bg `bg-accent-light/20` |

**Pattern notes:**
Purely static HTML — zero JS, zero event handlers, zero state. Every interactive-looking element (`div` not `button`) is a visual prop. Used only in the homepage hero as a right-column illustration. The chrome bar uses three traffic-light dots (`bg-red-400`, `bg-amber-400`, `bg-emerald-400`) — the only place in the project Tailwind built-in color classes are used for specific semantic meaning (OS window controls), not general UI tokens. Globe icon (`h-4 w-4 text-text-muted`) for URL bar, Wand2 icon for generate button, Sparkles icon in chrome. If this mock is ever reused elsewhere, keep it as static HTML — never add JS interactivity to what is meant to be a visual illustration.

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
| Hover state      | Primary: `hover:bg-accent-hover` + `hover:shadow-[0_4px_20px_rgba(91,78,232,0.4)]`; Secondary: `hover:bg-accent-light`; Outlined: `hover:bg-surface-secondary` |
| Shadow           | Primary: `shadow-[0_4px_14px_rgba(91,78,232,0.25)]` at rest; elevated on hover |
| Accent usage     | Primary uses full accent background; Secondary hover uses `bg-accent-light` |

**Pattern notes:**
This is a **marketing-only** button variant — `rounded-full`, `h-12`, `text-base`, `px-7`. Never use it inside the authenticated app (`/generate`, `/history`, `/profile`). The interior app uses `rounded-lg px-4 py-2 text-sm` Primary/Secondary buttons per ui-rules.md. The pill shape signals "this is a landing page" — mixing pill and rounded-lg buttons in the same view would break visual consistency.

The Primary pill carries a two-state shadow: rest `rgba(91,78,232,0.25)` + hover `rgba(91,78,232,0.4)`. These `rgba()` values are the accent color expressed as RGB — not hex — and match the pattern already established for Generate button's glow in `PitchForm.tsx`. Three variants exist: Primary (solid accent), Secondary (transparent + hover tint), Outlined (surface + border). Row layout for multiple buttons: `flex flex-col sm:flex-row gap-4` (stacked mobile, side-by-side on sm+), `justify-center` for CTA section, no `justify-center` for hero (left-aligned on desktop).

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
