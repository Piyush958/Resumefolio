"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { EditorCanvas } from "@/components/editor/editor-canvas";
import { PropertiesPanel } from "@/components/editor/properties-panel";
import { SectionPalette } from "@/components/editor/section-palette";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { PreviewFrame } from "@/components/preview/preview-frame";
import { FREE_PLAN } from "@/lib/constants";
import { canUseSectionType, exceedsFreeSectionLimit } from "@/lib/features";
import { useResumeAutosave } from "@/hooks/use-resume-save";
import { useEditorStore } from "@/store/editorStore";
import { useUserStore } from "@/store/userStore";
import type { ResumeRecord, TemplateId } from "@/types/resume";

interface EditorShellProps {
  resume: ResumeRecord;
  user: {
    id: string;
    email: string | null;
    fullName: string | null;
    isPro: boolean;
  };
}

export function EditorShell({ resume, user }: EditorShellProps) {
  const [isPro, setIsPro] = useState(user.isPro || resume.is_pro);

  const {
    data,
    title,
    slug,
    username,
    templateId,
    selectedSectionId,
    previewDevice,
    setFromResume,
    addSection,
    removeSection,
    duplicateSection,
    reorderSection,
    selectSection,
    updateSectionContent,
    updateStyle,
    renameSection,
    toggleSectionVisibility,
    setTemplateId,
    setSlug,
    setUsername,
    setTitle,
    setPreviewDevice,
  } = useEditorStore();

  const { saving } = useResumeAutosave(resume.id);

  useEffect(() => {
    setFromResume({
      title: resume.title,
      slug: resume.slug,
      templateId: resume.template_id,
      data: resume.data,
    });

    useUserStore.getState().setUser({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      isPro: user.isPro,
    });
  }, [resume, setFromResume, user]);

  const selectedSection = useMemo(
    () => data.sections.find((section) => section.id === selectedSectionId) ?? null,
    [data.sections, selectedSectionId],
  );

  const guardedAddSection = (type: Parameters<typeof addSection>[0]) => {
    if (!canUseSectionType(type, isPro)) {
      toast.error("This section is locked in free plan.");
      return;
    }

    addSection(type);

    const nextData = useEditorStore.getState().data;
    if (exceedsFreeSectionLimit(nextData, isPro)) {
      toast.error(`Free plan allows max ${FREE_PLAN.maxSections} sections.`);
      const lastId = nextData.sections[nextData.sections.length - 1]?.id;
      if (lastId) removeSection(lastId);
      return;
    }

    toast.success(`${type} section added.`);
  };

  const handleUpgradeSuccess = () => {
    setIsPro(true);
    useUserStore.getState().setPro(true);
    toast.success("All premium features are unlocked now.");
  };

  return (
    <div className="space-y-4">
      <EditorToolbar
        resumeId={resume.id}
        isPro={isPro}
        title={title}
        slug={slug}
        username={username}
        templateId={templateId}
        previewDevice={previewDevice}
        saving={saving}
        onTitleChange={setTitle}
        onSlugChange={setSlug}
        onUsernameChange={setUsername}
        onTemplateChange={setTemplateId as (value: TemplateId) => void}
        onPreviewDeviceChange={setPreviewDevice}
        onUpgrade={handleUpgradeSuccess}
      />

      <div className="grid gap-4 xl:grid-cols-[270px_1fr_320px]">
        <SectionPalette isPro={isPro} onAdd={guardedAddSection} />

        <div className="space-y-4">
          <EditorCanvas
            sections={data.sections}
            selectedSectionId={selectedSectionId}
            onSelect={selectSection}
            onReorder={reorderSection}
            onDuplicate={duplicateSection}
            onRemove={removeSection}
            onToggleVisibility={toggleSectionVisibility}
          />

          <PreviewFrame
            data={data}
            templateId={templateId}
            isPro={isPro}
            device={previewDevice}
          />
        </div>

        <PropertiesPanel
          section={selectedSection}
          style={data.style}
          onRenameSection={renameSection}
          onUpdateSectionContent={updateSectionContent}
          onUpdateStyle={updateStyle}
        />
      </div>
    </div>
  );
}
