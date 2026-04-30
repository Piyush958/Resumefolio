import { notFound } from "next/navigation";
import { SharePanel } from "@/components/dashboard/share-panel";
import { ensureProfile, getUserOrRedirect } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import type { ResumeRecord } from "@/types/resume";

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const user = await getUserOrRedirect();
  const profile = await ensureProfile();
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single<ResumeRecord>();

  if (error || !data) {
    notFound();
  }

  const username = data.data.username || profile?.username || "user";
  const publicUrl = `${env.appUrl.replace(/\/$/, "")}/r/${username}/${data.slug}`;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <SharePanel publicUrl={publicUrl} />
    </main>
  );
}
