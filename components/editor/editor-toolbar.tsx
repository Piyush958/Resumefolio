"use client";

import { Download, Eye, Laptop, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { templates } from "@/templates";
import type { TemplateId } from "@/types/resume";
import { FREE_PLAN } from "@/lib/constants";
import { isTemplateLocked } from "@/lib/features";
import { exportResumePdf } from "@/lib/pdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UpgradeButton } from "@/components/editor/upgrade-button";

interface EditorToolbarProps {
  resumeId: string;
  isPro: boolean;
  title: string;
  slug: string;
  username: string;
  templateId: TemplateId;
  previewDevice: "desktop" | "mobile";
  saving: boolean;
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
  onTemplateChange: (value: TemplateId) => void;
  onPreviewDeviceChange: (value: "desktop" | "mobile") => void;
  onUpgrade: () => void;
}

export function EditorToolbar({
  resumeId,
  isPro,
  title,
  slug,
  username,
  templateId,
  previewDevice,
  saving,
  onTitleChange,
  onSlugChange,
  onUsernameChange,
  onTemplateChange,
  onPreviewDeviceChange,
  onUpgrade,
}: EditorToolbarProps) {
  const publicUrl = `/r/${username}/${slug}`;

  return (
    <div className="sticky top-16 z-30 space-y-4 rounded-xl border bg-background/95 p-4 backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        <div className="space-y-1">
          <Label>Resume Title</Label>
          <Input value={title} onChange={(event) => onTitleChange(event.target.value)} className="w-52" />
        </div>
        <div className="space-y-1">
          <Label>Username</Label>
          <Input
            value={username}
            disabled={!isPro}
            onChange={(event) => onUsernameChange(event.target.value)}
            className="w-44"
          />
        </div>
        <div className="space-y-1">
          <Label>Slug</Label>
          <Input
            value={slug}
            disabled={!isPro}
            onChange={(event) => onSlugChange(event.target.value)}
            className="w-44"
          />
        </div>
        <div className="space-y-1">
          <Label>Template</Label>
          <Select
            value={templateId}
            onValueChange={(value) => {
              const selected = value as TemplateId;
              if (isTemplateLocked(selected, isPro)) {
                toast.error("Template locked in free plan.");
                return;
              }
              onTemplateChange(selected);
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                  {!isPro && template.isPremium ? " (PRO)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant={previewDevice === "desktop" ? "default" : "outline"}
            size="sm"
            onClick={() => onPreviewDeviceChange("desktop")}
          >
            <Laptop className="size-4" /> Desktop
          </Button>
          <Button
            variant={previewDevice === "mobile" ? "default" : "outline"}
            size="sm"
            onClick={() => onPreviewDeviceChange("mobile")}
          >
            <Smartphone className="size-4" /> Mobile
          </Button>
          <Button asChild variant="secondary" size="sm">
            <a href={`/preview/${resumeId}`} target="_blank" rel="noreferrer">
              <Eye className="size-4" /> Full Preview
            </a>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={!isPro}
            onClick={() => {
              void exportResumePdf(title, "resume-preview");
            }}
          >
            <Download className="size-4" />
            Download PDF
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {!isPro ? <UpgradeButton onSuccess={onUpgrade} /> : null}
          <p className="text-xs text-muted-foreground">
            {saving ? "Saving..." : "Saved"}
          </p>
          {!isPro ? (
            <p className="text-xs text-muted-foreground">
              Free plan: templates {FREE_PLAN.allowedTemplates.join(", ")}, max {FREE_PLAN.maxSections} sections.
            </p>
          ) : (
            <a href={publicUrl} className="text-xs underline" target="_blank" rel="noreferrer">
              Public URL: {publicUrl}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
