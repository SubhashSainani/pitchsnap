# Memory — Session 23: Prospect Name Extraction, Subject Lines, Tone Badge

Last updated: 2026-07-07

## What was built

Three features on the Generate page, all sharing a single Gemini prompt change as foundation.

### Feature 1 — Prospect Name Extraction (`lib/gemini.ts`)
`buildPrompt` updated with explicit STEP 1/2 instructions: scan for founder/CEO/co-founder/director/named contact, use first name if found ("Hi [First name],"), fall back to company name ("Hi [Company name] team,"), derive company name from domain if not in content. The OUTPUT FORMAT now uses structured SUBJECT_LINES:/EMAIL: section markers.

### Feature 2 — Subject Line Generator
**`lib/gemini.ts`:** `buildPrompt` now instructs Gemini to return 3 subject line options (curiosity-based, direct/benefit-based, personal) in the format:
```
SUBJECT_LINES:
1. ...
2. ...
3. ...
EMAIL:
[email body]
```
New exported function `parsePitchResponse(raw: string)` parses this format into `{ subjectLines: string[], emailContent: string }`. Defensive: regex uses `\n+EMAIL:\n` (not `\nEMAIL:\n`) to handle blank lines Gemini may emit. Falls back: if markers missing, `emailContent = raw.trim()`, `subjectLines = []`. Never throws.

**`app/api/generate/route.ts`:** After stream completes, calls `parsePitchResponse(fullText)` → saves only `emailContent` to pitches table (not the raw structured text). Insert failure is now **non-fatal**: logs the error but continues (user retains their generated email + subject lines; pitch simply won't appear in history). After DB work: enqueues `__METADATA__${JSON.stringify({ subjectLines })}` as the last stream chunk, then `controller.close()`.

**`app/api/demo-generate/route.ts`:** Fixed regression — now calls `parsePitchResponse(raw).emailContent` before returning JSON. (The shared `buildPrompt` now returns structured text; the demo route never needed subject lines but would have returned the raw markers as email_content without this fix.)

**`components/pitch/PitchForm.tsx`:** 
- Added `subjectLines` state (cleared at start of each `generate()`)
- Per-chunk: checks for `__METADATA__` → parses subjectLines, strips trailer from fullText via `continue`
- Post-loop split-chunk recovery: after while loop, checks `fullText` for `__STREAM_ERROR__` and `__METADATA__` (handles the case where sentinels were split across reads by proxies/edge runtimes; the `catch{}` in the per-chunk handler can silently miss them)
- Post-loop final parse: `fullText.match(/EMAIL:\n([\s\S]*)/)` → extracts clean email body for display
- Passes `subjectLines` and `tone={profile?.tone ?? "Professional"}` to `PitchOutput`

**`components/pitch/PitchOutput.tsx`:**
- New props: `subjectLines?: string[]` (default `[]`), `tone?: string` (default `"Professional"`)
- Subject lines section renders between header divider and email body when `subjectLines.length > 0`
- Each subject line row: `key={line}` (not index), copy button shows `Check` (14px, `text-success-foreground`) for 1.5s via `copiedIndexTimer` ref
- `copiedIndex` reset via `useEffect` watching `subjectLines` (prevents stale check after regeneration)
- Tone badge in header: `bg-surface-secondary text-text-muted text-xs rounded-full px-2.5 py-1`, shows `"{tone} · {wordCount} words"`, only when `hasPitch`

### Feature 3 — Tone Preview Badge
Described above under PitchOutput changes.

## Decisions made

- **`parsePitchResponse` stays in `lib/gemini.ts`** (server-side only). The client does its own inline `EMAIL:\n` regex after the stream ends — this duplication is intentional since `lib/gemini.ts` imports `@google/generative-ai` and cannot be bundled on the client.
- **Insert failure is non-fatal** — previously `if (insertError) throw insertError` sent `__STREAM_ERROR__` to the client, making the generated email disappear even though it was fully visible. Now logs and continues. Usage is only incremented if the insert succeeded.
- **Subject lines are ephemeral** — never saved to the `pitches` table, never shown in History, not added to the `Pitch` type.
- **`\n+EMAIL:\n` in parsePitchResponse** — `+` instead of literal single newline makes the parser robust to LLMs adding trailing blank lines after numbered lists (common behavior).
- **Demo route always parses** — demo route calls `generatePitch` (non-streaming, same `buildPrompt`), now wraps with `parsePitchResponse(...).emailContent` to strip the SUBJECT_LINES block before returning. Demo UI is unchanged.

## Problems solved

- Demo route regression: `buildPrompt` change broke the demo route (returned SUBJECT_LINES: markers as email_content). Fixed by importing and calling `parsePitchResponse` in the demo route.
- Split-chunk sentinel risk: per-chunk sentinel detection can miss if proxies re-chunk. Fixed by post-loop checks on the full assembled `fullText`.
- `text-green-500` token violation: replaced with `text-success-foreground` per ui-tokens.md invariant.
- Stale copiedIndex after regeneration: `key={i}` → `key={line}` + `useEffect` reset.

## Current state

- TypeScript clean (no source-file errors).
- All three features implemented and reviewed.
- Demo route unbroken (explicitly fixed this session).
- Subject lines: ephemeral, not persisted, not in Pitch type.
- Manual browser verification still needed (cannot be done headlessly):
  - Generate a pitch for https://linear.app — check greeting uses a real name or "Linear team"
  - Three subject lines appear above email with per-line copy buttons (green check on copy)
  - Tone badge shows in header: e.g. "Friendly · 67 words"
  - /history: saved pitch contains only email body, no subject lines, no markers
  - Regenerate: subject lines update, tone badge word count updates
  - Demo page: no SUBJECT_LINES markers in output

## Next session starts with

Phase 6, Feature 16: **RLS policies audit** — check that Supabase row-level security is correctly configured on `profiles`, `pitches`, and `demo_usage` tables before the Vercel deploy.

Secondary backlog (lower priority):
- BrowserDemo animation visual check (carried from Session 9)
- Hero "See how it works" button still unwired
- `TONES`/`VALID_TONES` triplication across the codebase
- SSRF `dns.lookup` check not tested against Vercel production runtime
- Duplicate-subscription prevention fix not yet manually re-tested
- Generate page heading deviation from interior-page pattern (Session 11, still unresolved)

## Open questions

- Whether the developer has manually verified the dark theme across all pages (Sessions 16–20 verification was always handed off, never confirmed back).
- Pricing page Pro card: "$25/month" vs Replit mockup's "$29/month" — no change made, confirm with developer.
