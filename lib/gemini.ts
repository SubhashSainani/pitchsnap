import { GoogleGenerativeAI } from "@google/generative-ai";

import type { Profile } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function buildPrompt(
  websiteContent: string,
  profile: Profile,
  domain: string,
): string {
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

The prospect's company name may or may not be explicitly stated in the content above.
If you can confidently identify the real company name from the content, use it.
If you cannot, use this exact domain name instead: "${domain}".

Write a complete, ready-to-send cold email in a ${profile.tone.toLowerCase()} tone, structured as exactly three sentences plus a sign-off — nothing more:
1. One sentence making a specific, real observation about the prospect's business, drawn directly from the content above.
2. One sentence connecting that specific observation to how the sender's services could help. Do not spend more than this one sentence on the sender's own background — no multi-sentence paragraphs introducing or describing the sender.
3. One sentence that is a clear call to action.
Then a short sign-off line (no name needed, the sender will sign it themselves).

HARD LIMIT: the entire email, including the sign-off, must be no more than 80 words. Count the words before finalizing your answer and cut anything over the limit — trim the sentences, do not add a fourth one.

Other rules:
- No subject line, no markdown formatting — plain email body only.
- Exactly three body sentences as structured above. Do not add extra sentences or extra paragraphs.

CRITICAL RULE: Never use placeholder brackets like [Company Name], [Your Name], [Prospect Name], or any similar bracketed placeholder anywhere in the email. Every detail must be a real, concrete value — either pulled from the content above or the domain fallback. The email must read as fully complete and ready to send exactly as written.`;
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
