# UI Tokens

Design tokens for PitchSnap — Dark Theme.
Use these exact values everywhere. Never hardcode hex values.
Never use raw Tailwind color classes.

This file replaces the original light-theme token system entirely.
PitchSnap is now a dark-theme product across every page, including
the homepage and login.

---

## How to Use

This project uses Tailwind CSS v4 with the `@theme` directive in `app/globals.css`.
Tailwind automatically generates utility classes from every `--color-*` token.

```tsx
// Correct — uses generated utility classes
className="bg-surface text-text-primary border-border"

// Correct — references CSS variable directly
style={{ color: 'var(--color-text-primary)' }}

// Never — hardcoded hex
className="bg-[#0D0D18]"

// Never — raw Tailwind colors
className="bg-indigo-500 text-gray-700"
```

---

## globals.css — Complete Token Definition

```css
@import "tailwindcss";

@theme {
  /* Font */
  --font-sans: "Inter", sans-serif;

  /* Backgrounds */
  --color-background: #0D0D18;
  --color-surface: #131320;
  --color-surface-secondary: #1E1E2E;
  --color-surface-muted: #1A1A28;

  /* Borders */
  --color-border: #252538;
  --color-border-strong: #32324A;

  /* Modal scrim */
  --color-scrim: rgba(0, 0, 0, 0.6);

  /* Text */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #C4C4D8;
  --color-text-muted: #9B9BB4;

  /* Accent — violet */
  --color-accent: #6C47FF;
  --color-accent-hover: #5A38E8;
  --color-accent-light: #1E1736;
  --color-accent-muted: #1A1530;
  --color-accent-foreground: #FFFFFF;

  /* Gradient stops — headline/CTA gradient text */
  --color-accent-gradient-start: #A88BFF;
  --color-accent-gradient-end: #6C47FF;

  /* Gradient stops — button/bg gradients */
  --color-accent-gradient-btn-start: #6C47FF;
  --color-accent-gradient-btn-end: #4D2BE6;

  /* Success */
  --color-success: #12B76A;
  --color-success-light: #0F2E22;
  --color-success-foreground: #4ADE9C;

  /* Warning */
  --color-warning: #F59E0B;
  --color-warning-light: #2E2410;
  --color-warning-foreground: #FBBF55;

  /* Error / Destructive */
  --color-error: #F24444;
  --color-error-light: #2E1414;
  --color-error-foreground: #FF8080;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```

---

## Glow & Shadow Reference

These are intentional exceptions to the "no inline rgba" pattern — glows
require rgba for opacity control that flat tokens can't express. Always
use these exact values, never invent new opacity levels.

| Usage                              | Value                          |
|-------------------------------------|---------------------------------|
| Icon pulse glow — resting           | `rgba(108, 71, 255, 0.3)`      |
| Icon pulse glow — peak              | `rgba(108, 71, 255, 0.7)`      |
| Generate button shadow              | `rgba(108, 71, 255, 0.3)`      |
| Generate button shadow — hover      | `rgba(108, 71, 255, 0.6)`      |
| Save Changes button shadow          | `rgba(108, 71, 255, 0.2)`      |
| Save Changes button shadow — hover  | `rgba(108, 71, 255, 0.5)`      |
| Upgrade button shadow               | `rgba(108, 71, 255, 0.3)`      |
| Upgrade button shadow — hover       | `rgba(108, 71, 255, 0.6)`      |
| Pro card outer glow                 | `rgba(108, 71, 255, 0.1)`      |
| Google button hover glow            | `rgba(255, 255, 255, 0.15)`    |
| Copy button hover glow              | `rgba(255, 255, 255, 0.1)`     |

---

## Orb / Background Glow Elements

Used on Login, Homepage hero, and Profile (Pro card pulse). All
`pointer-events-none`, `aria-hidden`, positioned behind content.

| Element                          | Value                                                                  |
|-----------------------------------|--------------------------------------------------------------------------|
| Orb 1 (top-left drift)            | `rgba(108, 71, 255, 0.25)` — violet, `blur-[120px]`. Equals `--color-accent` at 25% — use `bg-accent opacity-25` (or `bg-accent/25`), not a raw rgba. |
| Orb 2 (bottom-right drift)        | `rgba(77, 43, 230, 0.2)` — deep indigo, `blur-[120px]`. Equals `--color-accent-gradient-btn-end` at 20% exactly — use `bg-accent-gradient-btn-end opacity-20`, not a raw rgba. |
| Center glow (`.pitchsnap-glow`)   | `radial-gradient(circle, rgba(108,71,255,0.15) → rgba(108,71,255,0) at 70%)` |
| Pro card pulse blob               | Animated between `rgba(108,71,255,0.15)` and `rgba(108,71,255,0.25)`  |

---

## Modal Scrim

`bg-scrim` (`--color-scrim: rgba(0, 0, 0, 0.6)`) is the only sanctioned
rgba color token (as opposed to the inline rgba glow/shadow values
above) — it's a real token, not an inline exception, because every
modal overlay in the app needs the exact same dark backdrop and a
token keeps it themeable in one place. Used by `DialogOverlay` in
`components/ui/dialog.tsx`. Never use `bg-black/NN` or
`bg-text-primary/NN` for an overlay — always `bg-scrim`.

---

## Glass Card Variant

Used for elevated/floating cards that sit above the orb glow (e.g. login
card, homepage browser demo mock). Distinct from the standard opaque
`bg-surface` card.

```
background:    rgba(25, 25, 35, 0.6)
border:        1px solid rgba(255, 255, 255, 0.08)
backdrop-filter: blur(12px)
```

---

## Color Usage Guide

### Page Layout

| Element           | Token                  |
|--------------------|--------------------------|
| Page background    | `bg-background`        |
| Card / surface     | `bg-surface`            |
| Secondary surface  | `bg-surface-secondary` |
| Default border     | `border-border`        |

### Typography

| Element                | Token                  |
|--------------------------|--------------------------|
| Headings, primary text  | `text-text-primary`    |
| Secondary / labels      | `text-text-secondary`  |
| Placeholder, muted      | `text-text-muted`      |

### Accent (Primary Violet)

Used for: primary buttons, active nav, focus rings, highlights, glows.

| Element              | Token                    |
|------------------------|----------------------------|
| Button background     | `bg-accent`               |
| Button hover           | `bg-accent-hover`        |
| Button text             | `text-accent-foreground` |
| Light badge bg          | `bg-accent-light`        |
| Subtle tint bg          | `bg-accent-muted`        |

---

## Typography

| Element          | Size  | Weight | Color                  |
|--------------------|-------|--------|--------------------------|
| Page heading       | 24px  | 700    | `text-text-primary`    |
| Section heading    | 18px  | 600    | `text-text-primary`    |
| Card title          | 16px  | 600    | `text-text-primary`    |
| Body text            | 14px  | 400    | `text-text-primary`    |
| Label / caption      | 14px  | 500    | `text-text-secondary` |
| Muted / hint          | 12px  | 400    | `text-text-muted`      |
| Nav item active        | 14px  | 500    | `text-text-primary` (the sliding `bg-accent-light` pill behind it carries the accent — see ui-rules.md's Navbar section) |
| Nav item default       | 14px  | 500    | `text-text-secondary` |

Font: **Inter** — import via `next/font/google`.

---

## Component Tokens

### Cards — Standard
```
background:    bg-surface
border:        1px solid var(--color-border)
border-radius: rounded-xl  (12px)
padding:       p-6  (24px)
shadow:        shadow-sm
```

### Cards — Glass (elevated/floating, see Glass Card Variant above)
Use only where the spec explicitly calls for a floating card over an
orb-glow background — not the default card style.

### Buttons — Primary
```
background:    bg-accent
hover:         hover:bg-accent-hover
text:          text-accent-foreground
border-radius: rounded-lg
padding:       px-4 py-2
font-weight:   font-medium
font-size:     text-sm
shadow:        0 4px 20px rgba(108, 71, 255, 0.3)
hover shadow:  0 4px 28px rgba(108, 71, 255, 0.6)
```

### Buttons — Secondary
```
background:    bg-surface
border:        border border-border
hover:         hover:bg-surface-secondary
text:          text-text-primary
border-radius: rounded-lg
padding:       px-4 py-2
```

### Input Fields
```
background:    bg-surface
border:        border border-border
focus:         focus:ring-2 focus:ring-accent focus:border-accent
border-radius: rounded-lg
padding:       px-3 py-2
text:          text-text-primary
placeholder:   placeholder:text-text-muted
font-size:     text-sm
```

### Textarea (for pitch output)
```
Same as input fields above
min-height:    min-h-64
resize:        resize-none
font-family:   font-mono (for email content display)
```

### Badges
```
border-radius: rounded-full
padding:       px-2 py-0.5
font-size:     text-xs
font-weight:   font-medium
```

### Tone Badge Colors
| Tone         | Background         | Text                       |
|--------------|----------------------|-------------------------------|
| Professional | `bg-accent-light`  | `text-accent`               |
| Friendly     | `bg-success-light` | `text-success-foreground` |
| Direct       | `bg-warning-light` | `text-warning-foreground` |

---

## Spacing

| Token   | Value | Usage                  |
|---------|-------|--------------------------|
| `gap-2` | 8px   | Tight inline gaps       |
| `gap-3` | 12px  | Form field gaps         |
| `gap-4` | 16px  | Section internal gaps  |
| `gap-6` | 24px  | Between card sections  |
| `gap-8` | 32px  | Between page sections  |
| `p-4`   | 16px  | Small card padding     |
| `p-6`   | 24px  | Standard card padding  |

---

## Animation Library

**framer-motion** — npm package `framer-motion`, version `^11.x`.

Standard import pattern across all components:
```tsx
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion";
```

This is now an approved dependency — add to `code-standards.md`'s
approved dependencies list.

---

## Invariants

- Never use hex values directly in components — use tokens, except for
  the documented glow/shadow rgba values above, which are sanctioned
  exceptions
- Never use Tailwind built-in color classes (`bg-indigo-500`, `text-gray-600`)
- `--color-accent` (#6C47FF) is the only violet — never use Tailwind's
  built-in violet/purple scale
- All borders default to `--color-border` — never use `border-gray-*`
- Font is Inter — always imported via next/font/google
- This is a dark-theme-only product — no light mode toggle, no
  `prefers-color-scheme` branching anywhere
