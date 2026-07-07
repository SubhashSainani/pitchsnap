import { NextRequest, NextResponse } from "next/server";

import { PLAN_TO_PRICE_ID, stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase-server";

type PaidPlan = "standard" | "pro";

function parsePlan(body: unknown): PaidPlan | null {
  if (typeof body !== "object" || body === null || !("plan" in body)) {
    return null;
  }
  const value = (body as { plan: unknown }).plan;
  return value === "standard" || value === "pro" ? value : null;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 },
      );
    }
    if (!user.email) {
      return NextResponse.json(
        { success: false, error: "Could not determine account email" },
        { status: 500 },
      );
    }

    const body: unknown = await req.json();
    const plan = parsePlan(body);
    if (!plan) {
      return NextResponse.json(
        { success: false, error: "A valid plan (standard or pro) is required" },
        { status: 400 },
      );
    }

    const priceId = PLAN_TO_PRICE_ID[plan];
    const origin = req.nextUrl.origin;

    const { data: profileRow } = await supabase
      .from("profiles")
      .select("stripe_customer_id, stripe_subscription_id, subscription_status")
      .eq("user_id", user.id)
      .maybeSingle();

    // Already has an active subscription — switch its price in place
    // (Stripe prorates automatically) instead of creating a second,
    // duplicate subscription via a new Checkout Session.
    if (
      profileRow?.stripe_subscription_id &&
      profileRow.subscription_status === "active"
    ) {
      try {
        const existingSubscription = await stripe.subscriptions.retrieve(
          profileRow.stripe_subscription_id,
        );
        const existingItemId = existingSubscription.items.data[0]?.id;
        if (!existingItemId) {
          console.error("[api/checkout] existing subscription has no items", profileRow.stripe_subscription_id);
          return NextResponse.json(
            { success: false, error: "Could not update your subscription. Please contact support." },
            { status: 500 },
          );
        }
        await stripe.subscriptions.update(profileRow.stripe_subscription_id, {
          items: [{ id: existingItemId, price: priceId }],
          proration_behavior: "create_prorations",
        });

        // Immediate plan update — the webhook (customer.subscription.updated)
        // will also fire and do this, but it arrives asynchronously. This
        // ensures the DB reflects the new plan before the redirect lands.
        const { error: planUpdateError } = await supabase
          .from("profiles")
          .update({ plan, subscription_status: "active" })
          .eq("user_id", user.id);
        if (planUpdateError) {
          console.error("[api/checkout] immediate plan update failed", planUpdateError);
        }

        return NextResponse.json({ success: true, url: null, upgraded: true });
      } catch (error) {
        // Stored subscription ID is stale (e.g. deleted in Stripe directly) —
        // fall through to creating a fresh subscription below.
        console.error(
          "[api/checkout] failed to update existing subscription, falling back to new checkout",
          error,
        );
      }
    }

    let stripeCustomerId = profileRow?.stripe_customer_id ?? null;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({ email: user.email });
      stripeCustomerId = customer.id;

      const { error: customerUpdateError } = await supabase
        .from("profiles")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("user_id", user.id);
      if (customerUpdateError) {
        console.error("[api/checkout] failed to save customer id", customerUpdateError);
      }
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/generate?upgraded=true`,
      cancel_url: `${origin}/pricing`,
      metadata: { user_id: user.id, plan },
    });

    if (!session.url) {
      console.error("[api/checkout] Stripe returned a session with no URL", session.id);
      return NextResponse.json(
        { success: false, error: "Could not create checkout session. Please try again." },
        { status: 500 },
      );
    }
    return NextResponse.json({ success: true, url: session.url });
  } catch (error) {
    console.error("[api/checkout]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
