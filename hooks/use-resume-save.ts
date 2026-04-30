"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useEditorStore } from "@/store/editorStore";

export function useResumeAutosave(resumeId: string) {
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const payload = useEditorStore((state) => ({
    data: state.data,
    templateId: state.templateId,
    slug: state.slug,
    title: state.title,
    username: state.username,
    dirty: state.dirty,
  }));

  const debouncedPayload = useDebounce(payload, 900);

  useEffect(() => {
    const canSave = debouncedPayload.dirty && resumeId;
    if (!canSave) return;

    const save = async () => {
      setSaving(true);
      try {
        const response = await fetch(`/api/resumes/${resumeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: debouncedPayload.title,
            slug: debouncedPayload.slug,
            template_id: debouncedPayload.templateId,
            data: {
              ...debouncedPayload.data,
              username: debouncedPayload.username,
              updatedAt: new Date().toISOString(),
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Auto-save failed");
        }

        useEditorStore.getState().markClean();
        setLastSavedAt(new Date().toISOString());
      } catch {
        // silent failure to avoid interruption during editing
      } finally {
        setSaving(false);
      }
    };

    void save();
  }, [debouncedPayload, resumeId]);

  return { saving, lastSavedAt };
}
