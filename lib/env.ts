function getEnv(name: string, fallback = "") {
  return process.env[name] ?? fallback;
}

export const env = {
  appUrl: getEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  supabaseUrl: getEnv("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
  razorpayKeyId: getEnv("RAZORPAY_KEY_ID"),
  razorpayKeySecret: getEnv("RAZORPAY_KEY_SECRET"),
  razorpayWebhookSecret: getEnv("RAZORPAY_WEBHOOK_SECRET"),
};

export function assertRequiredEnv(keys: Array<keyof typeof env>) {
  const missing = keys.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing env keys: ${missing.join(", ")}`);
  }
}
