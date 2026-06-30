# UI Rules

Visual and structural rules for PitchSnap UI.
These rules keep the interface consistent without over-specifying every detail.

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
- Header height: 64px, full width, white background, `px-6`
- All pages use top navbar only — no sidebar

---

## Navbar

- Logo left, nav links center, sign-out right
- Active item: `text-accent font-medium`
- Inactive item: `text-text-secondary font-medium`
- Active state is color only — no underline, no background
- Always white background, full viewport width
- Bottom border: `border-b border-border`

---

## Cards

Every content section lives inside a card.

```
background:    bg-surface
border:        border border-border
border-radius: rounded-xl
padding:       p-6
shadow:        shadow-sm
```

Never colored card backgrounds — always white.
Color goes inside cards via badges, buttons, and text — never on the card surface.

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

---

## Buttons

**Primary** — one per page section, main action only
```
bg-accent hover:bg-accent-hover text-accent-foreground
rounded-lg px-4 py-2 text-sm font-medium
transition-colors duration-150
```

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
- Full-page loading: centered spinner only — no skeleton screens for this app
- The generate button specifically shows "Generating..." text while in progress

---

## Pitch History Row

Each row in history:
```
flex items-center justify-between
py-3 border-b border-border last:border-0
hover:bg-surface-secondary cursor-pointer
px-2 rounded-lg transition-colors
```

---

## Do Nots

- Never use Tailwind built-in color classes (`bg-indigo-500`, `text-gray-600`)
- Never add gradients to card backgrounds
- Never use `position: fixed` for UI elements
  - Exception: `position: fixed` is permitted for modal overlays only. All other UI elements must use normal flow layout.
- Never show raw error messages to users
- Never use more than two font weights in one UI element
- Never stack more than two nested border-radius elements
- Never use `!important` in Tailwind classes
