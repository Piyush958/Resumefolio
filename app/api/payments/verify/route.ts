import crypto from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface VerifyBody {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as VerifyBody;

  if (!process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: "Payment configuration missing" }, { status: 500 });
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== body.razorpay_signature) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  await supabase.from("payments").insert({
    user_id: user.id,
    razorpay_order_id: body.razorpay_order_id,
    razorpay_payment_id: body.razorpay_payment_id,
    amount: 9900,
    status: "paid",
  });

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ is_pro: true })
    .eq("id", user.id);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  await supabase.from("resumes").update({ is_pro: true }).eq("user_id", user.id);

  return NextResponse.json({ ok: true });
}
