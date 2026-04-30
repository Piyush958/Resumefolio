import { notFound, redirect } from "next/navigation";
import { EditorShell } from "@/components/editor/editor-shell";
import { ensureProfile, getUserOrRedirect } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ResumeRecord } from "@/types/resume";

interface EditorPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
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

  if (!profile) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-6 md:px-6">
      <EditorShell
        resume={data}
        user={{
          id: user.id,
          email: user.email ?? null,
          fullName: profile.full_name,
          isPro: profile.is_pro,
        }}
      />
    </main>
  );
}
