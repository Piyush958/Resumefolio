import { NextResponse } from "next/server";
import { PRO_PLAN } from "@/lib/constants";
import { ensureProfile } from "@/lib/auth";
import { getRazorpayClient } from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await ensureProfile();

  if (profile?.is_pro) {
    return NextResponse.json({ error: "Already upgraded" }, { status: 400 });
  }

  try {
    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: PRO_PLAN.priceInINR * 100,
      currency: "INR",
      receipt: `pro_${user.id.slice(0, 8)}_${Date.now()}`,
      notes: {
        user_id: user.id,
      },
    });

    await supabase.from("payments").insert({
      user_id: user.id,
      razorpay_order_id: order.id,
      amount: order.amount,
      status: "created",
    });

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Order creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
