"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface UpgradeButtonProps {
  onSuccess: () => void;
}

async function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (document.querySelector("script[data-razorpay='true']")) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.dataset.razorpay = "true";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function UpgradeButton({ onSuccess }: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const ready = await loadRazorpayScript();
      if (!ready) {
        toast.error("Could not load payment SDK.");
        return;
      }

      const orderRes = await fetch("/api/payments/order", {
        method: "POST",
      });

      if (!orderRes.ok) {
        const errorText = await orderRes.text();
        throw new Error(errorText || "Unable to create payment order.");
      }

      const order = (await orderRes.json()) as {
        id: string;
        amount: number;
        currency: string;
      };

      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!key) {
        toast.error("Razorpay key is missing.");
        return;
      }

      const razorpay = new window.Razorpay({
        key,
        amount: order.amount,
        currency: order.currency,
        name: "ResumeLink",
        description: "Pro Lifetime Upgrade",
        order_id: order.id,
        theme: {
          color: "#0f172a",
        },
        handler: async (response) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(response),
          });

          if (!verifyRes.ok) {
            toast.error("Payment verification failed.");
            return;
          }

          toast.success("Pro unlocked successfully.");
          onSuccess();
        },
      });

      razorpay.open();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Payment failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleUpgrade} disabled={loading}>
      <Sparkles className="size-4" />
      {loading ? "Opening checkout..." : "Upgrade Pro (INR 99)"}
    </Button>
  );
}
