import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

import { planForPriceId, stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-admin";

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
): Promise<void> {
  const userId = session.metadata?.user_id;
  const plan = session.metadata?.plan;
  const subscriptionId =
    typeof session.subscription === "string" ? session.subscription : null;
  const stripeCustomerId =
    typeof session.customer === "string" ? session.customer : null;

  if (!userId || !plan || !subscriptionId) {
    console.error(
      "[webhooks/stripe] checkout.session.completed missing metadata or subscription",
      { userId, plan, subscriptionId },
    );
    return;
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        user_id: userId,
        plan,
        stripe_subscription_id: subscriptionId,
        subscription_status: "active",
        stripe_customer_id: stripeCustomerId,
      },
      { onConflict: "user_id", ignoreDuplicates: false },
    );
  if (error) {
    console.error("[webhooks/stripe] checkout.session.completed upsert failed", error);
  }
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
): Promise<void> {
  const supabase = createAdminClient();

  // subscription.cancel_at_period_end does not reflect Portal-driven
  // cancel-at-period-end actions in this API version — confirmed by
  // diagnostic logging, it stayed false on a real, dashboard-confirmed
  // cancellation. subscription.cancel_at (a direct timestamp) is the field
  // that's actually populated, so it's used directly instead.
  const updates: Record<string, string | null> = {
    subscription_status: subscription.status,
    cancel_at: subscription.cancel_at
      ? new Date(subscription.cancel_at * 1000).toISOString()
      : null,
  };

  if (subscription.status === "active") {
    const priceId = subscription.items.data[0]?.price.id;
    const plan = priceId ? planForPriceId(priceId) : null;
    if (plan) {
      updates.plan = plan;
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("stripe_subscription_id", subscription.id);
  if (error) {
    console.error("[webhooks/stripe] customer.subscription.updated failed", error);
  }
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      plan: "free",
      subscription_status: "canceled",
      stripe_subscription_id: null,
      cancel_at: null,
    })
    .eq("stripe_subscription_id", subscription.id);
  if (error) {
    console.error("[webhooks/stripe] customer.subscription.deleted failed", error);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.error("[webhooks/stripe] signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        // Stripe's Event.data.object type isn't discriminated by event.type,
        // so the cast is required here even though `event.type` already
        // guarantees this object is a Checkout Session at runtime.
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
        );
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        break;
      default:
        break;
    }
  } catch (error) {
    console.error("[webhooks/stripe] event handling failed", error);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
