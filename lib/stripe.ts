import Stripe from "stripe";

import type { Plan } from "@/types";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

export const PLAN_TO_PRICE_ID: Record<"standard" | "pro", string> = {
  standard: process.env.STRIPE_PRICE_ID_STANDARD!,
  pro: process.env.STRIPE_PRICE_ID_PRO!,
};

const PRICE_ID_TO_PLAN: Record<string, Plan> = {
  [process.env.STRIPE_PRICE_ID_STANDARD!]: "standard",
  [process.env.STRIPE_PRICE_ID_PRO!]: "pro",
};

export function planForPriceId(priceId: string): Plan | null {
  return PRICE_ID_TO_PLAN[priceId] ?? null;
}
