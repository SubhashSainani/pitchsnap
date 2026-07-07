# UI Rules

Visual and structural rules for PitchSnap UI — Dark Theme.
These rules keep the interface consistent without over-specifying every detail.

This file replaces the original light-theme rules entirely. PitchSnap
is now a dark-theme product with motion as a first-class part of the
design system, not an afterthought.

---

## Font

Always import Inter via `next/font/google` in the root layout.

```typescript
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
```

Apply the font class to the `<html>` tag. Never use system fonts.

---

## Layout

- Page max-width: 1280px, centered with `mx-auto`
- Main content padding: `px-6 py-8`
- Gap between page sections: `gap-8` (32px)
- Header height: 64px, full width, dark surface background, `px-6`
- All pages use top navbar only — no sidebar

---

## Navbar

- Logo left, nav links center, plan badge + sign-out right
- Logo mark: `size-9 rounded-lg` accent-gradient square with a white
  `Zap` icon (lucide-react) — same icon/treatment family as the Login
  Card's logo mark (`size-12 rounded-xl bg-accent` + `Zap`), just
  smaller and inline. Never a letter/initial inside the mark.
- Active item: rendered via Framer Motion's `layoutId` technique — a
  shared animated pill/background slides between nav items as the
  user navigates, rather than each item independently changing color
- Active pill background: `bg-surface-secondary` (a neutral lift off
  the navbar surface, not an accent tint — keeps the active state
  understated, matching the Free Plan badge's resting color)
- Inactive item: `text-text-secondary font-medium`
- Active item text: `text-text-primary font-medium` (the sliding pill
  behind it carries the elevation, not an accent color)
- Navbar itself slides down from the top on initial mount
  (`y: -100 → 0`, fade in)
- Logo bounces (scale spring) on hover
- Background: `bg-surface`, bottom border `border-b border-border`

---

## Cards

Every content section lives inside a card. Two variants:

**Standard card:**
```
background:    bg-surface
border:        border border-border
border-radius: rounded-xl
padding:       p-6
shadow:        shadow-sm
```

**Glass card** (used for floating cards over orb-glow backgrounds —
Login card, homepage browser demo mock):
```
background:    rgba(25, 25, 35, 0.6)
border:        1px solid rgba(255, 255, 255, 0.08)
backdrop-filter: blur(12px)
border-radius: rounded-xl
```

Never colored card backgrounds on the standard variant — color goes
inside cards via badges, buttons, glows, and text, never as a flat
fill on the card surface itself. The one exception is the Pro plan
card, which uses a dedicated gradient background
(`#1E1736` base + pulsing glow blob) as a deliberate premium-tier
visual distinction — documented in `ui-tokens.md`.

---

## Typography Hierarchy

**Page headings** — top-level page titles
```
text-2xl font-bold text-text-primary
```

**Section headings** — card titles, section titles
```
text-lg font-semibold text-text-primary
```

**Body text**
```
text-sm text-text-primary
```

**Labels and captions**
```
text-sm font-medium text-text-secondary
```

**Muted hints and timestamps**
```
text-xs text-text-muted
```

**Gradient headline text** — used for hero/marketing headlines only
(homepage, login welcome heading), never for body copy or UI labels.
Always read from the dedicated gradient tokens in `ui-tokens.md`
(`--color-accent-gradient-start`/`-end`), never a raw hex pair or a
3-stop Tailwind built-in color chain — one gradient pair, used
consistently everywhere a gradient headline appears:
```
bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end
bg-clip-text text-transparent
```
(Tailwind v4 auto-generates `from-*`/`to-*` utilities for any
`--color-*` token in `@theme`, so these tokens work as plain utility
classes — no arbitrary-value syntax needed.)

---

## Buttons

**Primary** — one per page section, main action only
```
bg-accent hover:bg-accent-hover text-accent-foreground
rounded-lg px-4 py-2 text-sm font-medium
transition-colors duration-150
shadow-[0_4px_20px_rgba(108,71,255,0.3)]
hover:shadow-[0_4px_28px_rgba(108,71,255,0.6)]
```

Primary buttons also get a spring scale on hover/tap via Framer Motion
(`whileHover={{ scale: 1.03 }}`, `whileTap={{ scale: 0.97 }}`) — this
applies on top of the shadow glow, not instead of it.

**Secondary** — supporting actions
```
bg-surface border border-border hover:bg-surface-secondary
text-text-primary rounded-lg px-4 py-2 text-sm font-medium
```

**Ghost** — low-emphasis actions (delete, cancel)
```
text-text-secondary hover:text-text-primary hover:bg-surface-secondary
rounded-lg px-3 py-1.5 text-sm
```

**Destructive** — delete actions, confirmation dialogs only
```
bg-error-light text-error-foreground hover:bg-error
rounded-lg px-4 py-2 text-sm font-medium
```

---

## Forms and Inputs

```
bg-surface border border-border rounded-lg
px-3 py-2 text-sm text-text-primary
placeholder:text-text-muted
focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
```

Labels sit above inputs, never inside (use placeholder for hints only).
Label class: `text-sm font-medium text-text-secondary mb-1 block`

On pages with multiple form fields, fields stagger in on mount (see
Motion Patterns below) rather than appearing all at once.

---

## Textarea — Pitch Output

The generated email sits in a large textarea so the user can edit it.

```
font-mono text-sm text-text-primary
bg-surface border border-border rounded-xl
p-4 min-h-64 resize-none w-full
focus:outline-none focus:ring-2 focus:ring-accent
```

Monospace font reinforces "this is email content you're editing."

When content is generated, lines reveal with a typewriter-style
staggered fade-in (see Motion Patterns below) rather than appearing
instantly.

---

## Empty States

Every section that can be empty must show an empty state:
- Short message in `text-text-muted text-sm text-center`
- Optional icon above (lucide, 32px, `text-text-muted`)
- CTA button below if there's a logical next action

---

## Loading States

- Buttons show a spinner + disabled state while loading
- Use `opacity-50 cursor-not-allowed` on disabled buttons
- Full-page loading: centered spinner only — no skeleton screens
- The generate button shows "Generating..." text plus a moving
  shimmer overlay animation while in progress (see Motion Patterns)

---

## Pitch History Row

Each row in history:
```
flex items-center justify-between
py-3 border-b border-border last:border-0
hover:bg-surface-secondary cursor-pointer
px-2 rounded-lg transition-colors
```

Rows also lift slightly on hover via Framer Motion
(`whileHover={{ y: -2 }}`) — additive to the existing background
color transition, not a replacement for it.

---

## Motion Patterns

PitchSnap uses `framer-motion` throughout. These are the standard,
reusable animation patterns — reach for these first before inventing
a new one.

**Staggered entrance** — used for: history list rows, profile form
fields, pricing cards, step cards. Children fade up with a slight
delay between each:
```tsx
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 }
};
```

**Page/panel slide-in** — used for: Generate page's two columns
(slide from opposite sides), Profile page's two columns. Apply once
per panel, not per child inside it:
```tsx
// left panel
initial={{ opacity: 0, x: -24 }}
animate={{ opacity: 1, x: 0 }}
// right panel
initial={{ opacity: 0, x: 24 }}
animate={{ opacity: 1, x: 0 }}
```

**Pulsing glow** — used for: login logo mark, Pro plan card blob.
Infinite loop, slow, breathing quality:
```tsx
animate={{
  opacity: [0.3, 0.7, 0.3],
}}
transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
```

**Overshoot spring** — used for: badge/counter elements that should
feel like they "pop" into place (e.g. pitch count badge):
```tsx
transition={{ type: "spring", stiffness: 400, damping: 10 }}
```

**Orb drift** — used for: background orbs on Login and Homepage hero.
Slow, large-amplitude, looping translation:
```tsx
animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
```

**Ripple on click** — used for: Save Changes button, other confirm
actions. A radial scale+fade triggered on click, layered behind the
button label, not replacing the button's own click handler logic.

**Sliding active nav pill** — see Navbar section above. Uses
`layoutId` so Framer Motion automatically animates the shared element
between positions:
```tsx
{isActive && (
  <motion.div layoutId="navPill" className="..." />
)}
```

All entrance animations run once on mount — never re-trigger on every
re-render. Use `initial`/`animate` (not `whileInView` triggered
repeatedly) for one-time entrances, and gate any animation that reads
data with the data already resolved server-side before the component
mounts, so the animation doesn't run against empty/placeholder content
and then "pop" when real data arrives.

`prefers-reduced-motion` must be respected: skip straight to the final
animation state (no orb drift, no pulsing, no staggered delay) when
the user has this preference set. Check via
`window.matchMedia('(prefers-reduced-motion: reduce)').matches` and
branch animation config accordingly — this was already required
practice for the homepage browser demo (Session 8) and now applies
to every animated element project-wide.

Two valid timings for this check, pick based on what the animation needs:
- **Post-mount `useEffect`** (BrowserDemo.tsx) — for imperative,
  self-driven loops where a one-render delay before branching is fine.
- **`useLazyReducedMotion()` from `lib/useLazyReducedMotion.ts`** — for
  any `motion` component that gates `initial`/`whileHover` props, since
  framer-motion only honors `initial` on the very first commit; a
  `useEffect` would fire one render too late to skip the entrance
  animation. This is a project-owned hook wrapping the same lazy-`useState`
  technique; always import from here, never re-declare inline. Pair with
  `suppressHydrationWarning` on the one element whose first-render output
  actually depends on the check (the server always renders the
  non-reduced-motion branch, since `window` is unavailable there).

Similarly, always import the canonical stagger variants from
`lib/motionVariants.ts` (`staggerContainer`, `staggerItem`) rather than
re-declaring them inline — they're the same values, but a single source
makes project-wide tuning a one-line change.

---

## Do Nots

- Never use Tailwind built-in color classes (`bg-indigo-500`, `text-gray-600`)
- Never add gradients to standard card backgrounds — the gradient
  headline text and the Pro plan card are the only sanctioned
  exceptions, both documented above
- Never use `position: fixed` for UI elements
  - Exception: `position: fixed` is permitted for modal overlays only.
    All other UI elements must use normal flow layout.
- Never show raw error messages to users
- Never use more than two font weights in one UI element
- Never stack more than two nested border-radius elements
- Never use `!important` in Tailwind classes
- Never trigger entrance animations repeatedly on re-render — mount
  once, animate once
- Never skip the `prefers-reduced-motion` check on a new animated
  component — every animation added must account for it
