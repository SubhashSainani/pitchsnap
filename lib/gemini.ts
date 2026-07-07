import { GoogleGenerativeAI } from "@google/generative-ai";

import type { Profile } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function buildPrompt(
  websiteContent: string,
  profile: Profile,
  domain: string,
): string {
  const signOff = profile.tone === "Friendly" ? "Cheers," : "Best,";
  const fullName = profile.full_name.trim();

  return `You are writing a cold outreach email on behalf of a freelancer/indie hacker.

THE SENDER (who this email is from):
- Services offered: ${profile.services}
- Preferred tone: ${profile.tone}
- Ideal target client: ${profile.target_client || "not specified"}

THE PROSPECT (who this email is to):
Website content extracted from their site:
"""
${websiteContent}
"""

STEP 1 — Identify the company name:
The prospect's company name may or may not be explicitly stated in the content above.
If you can confidently identify the real company name from the content, use it.
If you cannot, derive it from this domain: "${domain}" (e.g. linear.app → Linear).

STEP 2 — Identify a named contact:
Scan the website content for any person's name associated with the company — founder, CEO, co-founder, director, or any named contact. If a name is found, use only their first name in the greeting: "Hi [First name],". If no name is found, use the company name: "Hi [Company name] team,".

STEP 3 — Write 3 subject line options:
Each subject line must be under 50 characters. Write three with different angles:
- One curiosity-based (makes the reader want to know more)
- One direct/benefit-based (states a clear outcome)
- One personal (references something specific about their business)
All three must match the sender's tone and reference something real from the website content.

STEP 4 — Write the email body following this structure:
- Hook: one focused sentence making a specific, real observation about the prospect's business drawn directly from the website content.
- Value: one sentence connecting that observation to how the sender's services could specifically help. Do not spend more than this on the sender's background.
- CTA: one direct sentence asking if they'd be open to a quick call or chat.

OUTPUT FORMAT — reproduce this structure exactly, with these exact markers and blank lines:

SUBJECT_LINES:
1. [subject line option 1]
2. [subject line option 2]
3. [subject line option 3]
EMAIL:
Hi [Name or Company team],

[Hook paragraph]

[Value paragraph]

[CTA paragraph]

${signOff}${fullName ? `\n${fullName}` : ""}

RULES:
- The SUBJECT_LINES: and EMAIL: section markers must appear exactly as shown.
- Subject lines must never use placeholder brackets — every value must be real and specific.
- The email greeting, body paragraphs, and sign-off must each be separated by blank lines.
- The email body (hook + value + CTA, not counting greeting and sign-off) must be under 100 words total.
- Never use placeholder brackets like [Name], [Company], [Your Name], or any bracketed placeholder anywhere — every value must be real and concrete, pulled from the content above or the domain fallback.
- The email must be fully ready to send as written.
- Return plain text only — no markdown, no asterisks, no bullet points.
- Reproduce the sign-off exactly as shown in the OUTPUT FORMAT above — do not add or remove any lines.`;
}

export function parsePitchResponse(raw: string): {
  subjectLines: string[];
  emailContent: string;
} {
  const subjectMatch = raw.match(/SUBJECT_LINES:\n([\s\S]*?)\n+EMAIL:\n/);
  const emailMatch = raw.match(/EMAIL:\n([\s\S]*)/);

  const subjectLines = subjectMatch
    ? subjectMatch[1]
        .split("\n")
        .filter((l) => l.match(/^\d\./))
        .map((l) => l.replace(/^\d\.\s*/, "").trim())
        .filter(Boolean)
    : [];

  const emailContent = emailMatch ? emailMatch[1].trim() : raw.trim();

  return { subjectLines, emailContent };
}

export async function generatePitch(
  websiteContent: string,
  profile: Profile,
  domain: string,
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = buildPrompt(websiteContent, profile, domain);
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

export async function generatePitchStream(
  websiteContent: string,
  profile: Profile,
  domain: string,
): Promise<AsyncGenerator<string>> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = buildPrompt(websiteContent, profile, domain);
  const result = await model.generateContentStream(prompt);

  async function* streamText(): AsyncGenerator<string> {
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield text;
    }
  }

  return streamText();
}
