import { notFound } from "next/navigation";
import { PreviewFrame } from "@/components/preview/preview-frame";
import { ensureProfile, getUserOrRedirect } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ResumeRecord } from "@/types/resume";

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
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

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Preview: {data.title}</h1>
        <a href={`/editor/${data.id}`} className="text-sm underline">
          Back to editor
        </a>
      </div>
      <PreviewFrame
        data={data.data}
        templateId={data.template_id}
        isPro={Boolean(profile?.is_pro || data.is_pro)}
      />
    </main>
  );
}
