import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { FREE_PLAN } from "@/lib/constants";
import { ensureProfile, getUserOrRedirect } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ResumeRecord } from "@/types/resume";

export default async function DashboardPage() {
  const user = await getUserOrRedirect();
  const profile = await ensureProfile();
  const supabase = await createClient();

  const { data } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const resumes = (data ?? []) as ResumeRecord[];
  const isPro = Boolean(profile?.is_pro);
  const canCreate = isPro || resumes.length < FREE_PLAN.maxResumes;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <DashboardClient initialResumes={resumes} canCreate={canCreate} />
    </main>
  );
}
