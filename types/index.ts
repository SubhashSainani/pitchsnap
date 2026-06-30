export type Tone = "Professional" | "Friendly" | "Direct";

export type Profile = {
  services: string;
  tone: Tone;
  target_client: string;
};

const TONES: readonly string[] = ["Professional", "Friendly", "Direct"];

export function isTone(value: unknown): value is Tone {
  return typeof value === "string" && TONES.includes(value);
}

export type Pitch = {
  id: string;
  prospect_url: string;
  prospect_summary: string;
  email_content: string;
  created_at: string;
};
