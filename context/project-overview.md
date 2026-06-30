# Project Overview

## About PitchSnap

PitchSnap is an AI-powered cold email generator for freelancers and indie hackers.
The user sets up their profile once — describing their services, tone, and target
clients. They then paste any prospect's website URL. The AI fetches and reads that
website, extracts what the company does, and writes a fully personalized cold email
pitch tailored to the user's services and the prospect's actual business.

No generic templates. Every email is written from scratch based on real research.

---

## The Problem It Solves

Writing good cold emails is time-consuming. A generic template gets ignored.
A personalized email that shows you've done your homework gets replies.
PitchSnap does the research and the writing automatically — the user just reviews,
edits if needed, and sends.

---

## Pages

```
/                   → Homepage
/login              → Auth page (Google OAuth via Supabase)
/dashboard          → History of all generated pitches
/generate           → Main generation page — URL input + output
/profile            → User profile — services, tone, target client description
```

---

## Navigation

Top navbar. Minimal. Three items for logged-in users:

```
Generate    History    Profile
```

Logo on the left. Sign out button on the right. Full width layout. No sidebar.

---

## Core User Flow

### Homepage
- Hero section explaining what PitchSnap does
- "Start Free" CTA → redirects to /login if not authenticated
- Logged-in users → redirect to /generate

### Auth
- Google OAuth only via Supabase
- After login → redirect to /generate
- If profile not set up → show banner on /generate prompting profile completion

### Profile Setup
- User describes their freelance services (e.g. "I build Shopify stores for DTC brands")
- User sets their preferred tone: Professional / Friendly / Direct
- User describes their ideal target client (optional but improves output quality)
- Saved to `profiles` table in Supabase

### Generate Page — Core Feature
- User pastes a prospect's website URL
- Clicks "Generate Pitch" button
- App fetches the website content server-side
- Gemini AI reads the content + user profile → writes personalized cold email
- Email appears on screen with Copy and Regenerate buttons
- Each generation is saved to `pitches` table automatically
- User can edit the generated email inline before copying

### History Page (Dashboard)
- List of all previously generated pitches
- Each row: prospect URL, date generated, first line of email preview
- Click any row → opens full pitch in a modal
- Delete button per pitch

### Profile Page
- Edit services description
- Change tone preference
- Edit target client description
- Save button

---

## Data Architecture

### profiles table
- One row per user
- Fields: user_id, services, tone, target_client, created_at, updated_at
- Only updated when user explicitly saves profile

### pitches table
- One row per generated pitch
- Fields: id, user_id, prospect_url, prospect_summary, email_content, created_at
- Never modified after creation — immutable history

---

## Features In Scope

- Homepage with hero, how it works section, CTA
- Google OAuth via Supabase
- Profile setup — services, tone, target client
- Website fetching — server-side fetch of prospect URL
- Gemini AI pitch generation using profile + website content
- Inline email editing after generation
- Copy to clipboard button
- Regenerate button (generates a new variation)
- Pitch history — full list with preview
- Delete pitch from history
- Incomplete profile banner on /generate
- Top navbar with Generate, History, Profile links

---

## Features Out of Scope

- Email sending — PitchSnap only generates, never sends
- Multiple profile presets
- Team or multi-user accounts
- Chrome extension
- CRM integration
- Follow-up email sequences
- A/B testing of pitches
- Email open tracking
- Scheduling
- Mobile app
- Payment or subscription — free for now
- GitHub OAuth — Google only
- Bulk URL processing
