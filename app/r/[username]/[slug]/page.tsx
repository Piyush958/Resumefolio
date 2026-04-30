import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PreviewFrame } from "@/components/preview/preview-frame";
import { createClient } from "@/lib/supabase/server";
import type { ResumeRecord } from "@/types/resume";

interface PublicResumePageProps {
  params: Promise<{ username: string; slug: string }>;
}

async function getPublicResume(username: string, slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("slug", slug)
    .single<ResumeRecord>();

  if (error || !data) {
    return null;
  }

  if (data.data.username !== username) {
    return null;
  }

  return data;
}

export async function generateMetadata({ params }: PublicResumePageProps): Promise<Metadata> {
  const { username, slug } = await params;
  const resume = await getPublicResume(username, slug);

  if (!resume) {
    return {
      title: "Resume not found",
    };
  }

  return {
    title: `${resume.title} | ResumeLink`,
    description: `Public resume of ${resume.data.username}`,
  };
}

export default async function PublicResumePage({ params }: PublicResumePageProps) {
  const { username, slug } = await params;
  const resume = await getPublicResume(username, slug);

  if (!resume) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <PreviewFrame data={resume.data} templateId={resume.template_id} isPro={resume.is_pro} />
    </main>
  );
}
