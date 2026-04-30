import { NextResponse } from "next/server";
import { FREE_PLAN } from "@/lib/constants";
import { ensureProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { canUseSectionType, isTemplateLocked } from "@/lib/features";
import type { ResumeDocumentData, TemplateId } from "@/types/resume";

interface ResumeUpdateBody {
  title: string;
  slug: string;
  template_id: TemplateId;
  data: ResumeDocumentData;
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await ensureProfile();
  const isPro = Boolean(profile?.is_pro);

  const body = (await request.json()) as ResumeUpdateBody;
  const { id } = await context.params;

  if (!isPro) {
    if (isTemplateLocked(body.template_id, false)) {
      return NextResponse.json({ error: "Template locked for free plan" }, { status: 403 });
    }

    if (body.data.sections.length > FREE_PLAN.maxSections) {
      return NextResponse.json({ error: "Section limit exceeded on free plan" }, { status: 403 });
    }

    const hasLockedSection = body.data.sections.some(
      (section) => !canUseSectionType(section.type, false),
    );

    if (hasLockedSection) {
      return NextResponse.json({ error: "Some sections are locked for free plan" }, { status: 403 });
    }
  }

  const { error } = await supabase
    .from("resumes")
    .update({
      title: body.title,
      slug: body.slug,
      template_id: body.template_id,
      data: body.data,
      is_pro: isPro,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
