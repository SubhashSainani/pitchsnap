export type Tone = "Professional" | "Friendly" | "Direct";

export type Profile = {
  full_name: string;
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

export type Plan = "free" | "standard" | "pro";

export type UsageInfo = {
  plan: Plan;
  pitches_this_month: number;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
  cancel_at: string | null;
};

const PLANS: readonly string[] = ["free", "standard", "pro"];

export function isPlan(value: unknown): value is Plan {
  return typeof value === "string" && PLANS.includes(value);
}
