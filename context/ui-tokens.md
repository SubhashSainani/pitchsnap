# UI Tokens

Design tokens for PitchSnap. Use these exact values everywhere.
Never hardcode hex values. Never use raw Tailwind color classes.

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
className="bg-[#F8F7FF]"

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
  --color-background: #F8F7FF;
  --color-surface: #FFFFFF;
  --color-surface-secondary: #F3F2FF;
  --color-surface-muted: #FAFAFE;

  /* Borders */
  --color-border: #E4E2F5;
  --color-border-strong: #C9C6E8;

  /* Text */
  --color-text-primary: #1A1830;
  --color-text-secondary: #5E5A7A;
  --color-text-muted: #9C99B8;

  /* Accent — indigo/violet */
  --color-accent: #5B4EE8;
  --color-accent-hover: #4A3ED4;
  --color-accent-light: #EAE8FF;
  --color-accent-muted: #F3F2FF;
  --color-accent-foreground: #FFFFFF;

  /* Success */
  --color-success: #12B76A;
  --color-success-light: #D1FAE5;
  --color-success-foreground: #065F46;

  /* Warning */
  --color-warning: #F59E0B;
  --color-warning-light: #FEF3C7;
  --color-warning-foreground: #92400E;

  /* Error */
  --color-error: #EF4444;
  --color-error-light: #FEE2E2;
  --color-error-foreground: #991B1B;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```

---

## Color Usage Guide

### Page Layout

| Element           | Token                  |
|-------------------|------------------------|
| Page background   | `bg-background`        |
| Card / surface    | `bg-surface`           |
| Secondary surface | `bg-surface-secondary` |
| Default border    | `border-border`        |

### Typography

| Element                | Token                    |
|------------------------|--------------------------|
| Headings, primary text | `text-text-primary`      |
| Secondary / labels     | `text-text-secondary`    |
| Placeholder, muted     | `text-text-muted`        |

### Accent (Primary Indigo)

Used for: primary buttons, active nav, focus rings, highlights.

| Element                | Token                    |
|------------------------|--------------------------|
| Button background      | `bg-accent`              |
| Button hover           | `bg-accent-hover`        |
| Button text            | `text-accent-foreground` |
| Light badge bg         | `bg-accent-light`        |
| Subtle tint bg         | `bg-accent-muted`        |

---

## Typography

| Element          | Size  | Weight | Color                  |
|------------------|-------|--------|------------------------|
| Page heading     | 24px  | 700    | `text-text-primary`    |
| Section heading  | 18px  | 600    | `text-text-primary`    |
| Card title       | 16px  | 600    | `text-text-primary`    |
| Body text        | 14px  | 400    | `text-text-primary`    |
| Label / caption  | 14px  | 500    | `text-text-secondary`  |
| Muted / hint     | 12px  | 400    | `text-text-muted`      |
| Nav item active  | 14px  | 500    | `text-accent`          |
| Nav item default | 14px  | 500    | `text-text-secondary`  |

Font: **Inter** — import via `next/font/google`.

---

## Component Tokens

### Cards
```
background:    bg-surface
border:        1px solid var(--color-border)
border-radius: rounded-xl  (12px)
padding:       p-6  (24px)
shadow:        shadow-sm
```

### Buttons — Primary
```
background:    bg-accent
hover:         hover:bg-accent-hover
text:          text-accent-foreground
border-radius: rounded-lg
padding:       px-4 py-2
font-weight:   font-medium
font-size:     text-sm
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
|--------------|--------------------|----------------------------|
| Professional | `bg-accent-light`  | `text-accent`              |
| Friendly     | `bg-success-light` | `text-success-foreground`  |
| Direct       | `bg-warning-light` | `text-warning-foreground`  |

---

## Spacing

| Token   | Value | Usage                    |
|---------|-------|--------------------------|
| `gap-2` | 8px   | Tight inline gaps        |
| `gap-3` | 12px  | Form field gaps          |
| `gap-4` | 16px  | Section internal gaps    |
| `gap-6` | 24px  | Between card sections    |
| `gap-8` | 32px  | Between page sections    |
| `p-4`   | 16px  | Small card padding       |
| `p-6`   | 24px  | Standard card padding    |

---

## Invariants

- Never use hex values directly in components
- Never use Tailwind built-in color classes (`bg-indigo-500`, `text-gray-600`)
- `--color-accent` (#5B4EE8) is the only indigo/violet — never use Tailwind's indigo scale
- All borders default to `--color-border` — never use `border-gray-*`
- Font is Inter — always imported via next/font/google
