import { FREE_PLAN } from "@/lib/constants";
import { TemplateRenderer } from "@/components/preview/template-renderer";
import type { ResumeDocumentData, TemplateId } from "@/types/resume";

interface PreviewFrameProps {
  data: ResumeDocumentData;
  templateId: TemplateId;
  isPro: boolean;
  device?: "desktop" | "mobile";
}

export function PreviewFrame({ data, templateId, isPro, device = "desktop" }: PreviewFrameProps) {
  return (
    <div
      className={
        device === "mobile"
          ? "mx-auto w-full max-w-sm"
          : "mx-auto w-full max-w-4xl"
      }
      id="resume-preview"
    >
      <TemplateRenderer data={data} templateId={templateId} isPro={isPro} />
      {!isPro ? (
        <p className="mt-2 text-center text-xs text-muted-foreground">{FREE_PLAN.brandingLabel}</p>
      ) : null}
    </div>
  );
}
