import { redirect } from "next/navigation";
import { LoginCard } from "@/components/marketing/login-card";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <LoginCard />
    </main>
  );
}
