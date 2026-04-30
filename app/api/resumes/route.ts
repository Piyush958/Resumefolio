import { NextResponse } from "next/server";
import { createResumeSlug } from "@/lib/slug";
import { createDefaultResumeData } from "@/lib/resume-default";
import { ensureProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ResumeRecord } from "@/types/resume";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await ensureProfile();
  const username = profile?.username ?? "user";
  const baseData = createDefaultResumeData(user.email);

  const payload = {
    user_id: user.id,
    title: "New Resume",
    slug: createResumeSlug("new-resume"),
    template_id: "classic",
    is_pro: Boolean(profile?.is_pro),
    data: {
      ...baseData,
      username,
    },
  };

  const { data, error } = await supabase.from("resumes").insert(payload).select("id").single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Create failed" }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ resumes: (data ?? []) as ResumeRecord[] });
}
