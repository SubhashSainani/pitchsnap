import { NextRequest, NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase-server";

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

    const { data: profileRow } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!profileRow?.stripe_customer_id) {
      return NextResponse.json(
        { success: false, error: "You don't have a subscription to manage yet" },
        { status: 400 },
      );
    }

    const origin = req.nextUrl.origin;
    const session = await stripe.billingPortal.sessions.create({
      customer: profileRow.stripe_customer_id,
      return_url: `${origin}/profile`,
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error) {
    console.error("[api/billing-portal]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
