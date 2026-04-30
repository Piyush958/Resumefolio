import { FREE_PLAN } from "@/lib/constants";
import { templateMap } from "@/templates";
import type { ResumeDocumentData, ResumeSectionType, TemplateId } from "@/types/resume";

export function isTemplateLocked(templateId: TemplateId, isPro: boolean) {
  const template = templateMap[templateId];
  return !isPro && Boolean(template?.isPremium);
}

export function canUseSectionType(type: ResumeSectionType, isPro: boolean) {
  if (isPro) {
    return true;
  }

  return ["personal", "summary", "experience", "education", "skills", "projects"].includes(type);
}

export function exceedsFreeSectionLimit(data: ResumeDocumentData, isPro: boolean) {
  if (isPro) {
    return false;
  }

  return data.sections.length > FREE_PLAN.maxSections;
}
