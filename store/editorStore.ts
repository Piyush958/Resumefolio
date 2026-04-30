"use client";

import { create } from "zustand";
import { createDefaultResumeData, createSection } from "@/lib/resume-default";
import type {
  ResumeDocumentData,
  ResumeSection,
  ResumeSectionType,
  TemplateId,
} from "@/types/resume";

type PreviewDevice = "desktop" | "mobile";

interface EditorStore {
  title: string;
  slug: string;
  username: string;
  templateId: TemplateId;
  data: ResumeDocumentData;
  selectedSectionId: string | null;
  previewDevice: PreviewDevice;
  dirty: boolean;
  setFromResume: (input: {
    title: string;
    slug: string;
    templateId: TemplateId;
    data: ResumeDocumentData;
  }) => void;
  setTitle: (title: string) => void;
  setSlug: (slug: string) => void;
  setUsername: (username: string) => void;
  setTemplateId: (templateId: TemplateId) => void;
  setPreviewDevice: (device: PreviewDevice) => void;
  selectSection: (id: string | null) => void;
  addSection: (type: ResumeSectionType) => void;
  removeSection: (id: string) => void;
  duplicateSection: (id: string) => void;
  reorderSection: (activeId: string, overId: string) => void;
  renameSection: (id: string, title: string) => void;
  toggleSectionVisibility: (id: string) => void;
  updateSectionContent: (id: string, value: unknown) => void;
  updateStyle: (value: Partial<ResumeDocumentData["style"]>) => void;
  markClean: () => void;
}

function cloneSection(section: ResumeSection) {
  const copied = structuredClone(section);
  copied.id = `${section.type}_${Math.random().toString(36).slice(2, 9)}`;

  const content = copied.content as unknown as Record<string, unknown>;
  if (Array.isArray(content.items)) {
    content.items = content.items.map((item) => {
      if (typeof item === "object" && item !== null && "id" in item) {
        return {
          ...item,
          id: `itm_${Math.random().toString(36).slice(2, 8)}`,
        };
      }
      return item;
    });
  }

  return copied;
}

function reorderSections(sections: ResumeSection[], activeId: string, overId: string) {
  const fromIndex = sections.findIndex((s) => s.id === activeId);
  const toIndex = sections.findIndex((s) => s.id === overId);

  if (fromIndex === -1 || toIndex === -1) {
    return sections;
  }

  const next = [...sections];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

const fallbackResume = createDefaultResumeData();

export const useEditorStore = create<EditorStore>()((set) => ({
  title: "My Resume",
  slug: "my-resume",
  username: fallbackResume.username,
  templateId: "classic",
  data: fallbackResume,
  selectedSectionId: fallbackResume.sections[0]?.id ?? null,
  previewDevice: "desktop",
  dirty: false,
  setFromResume: ({ title, slug, templateId, data }) =>
    set(() => ({
      title,
      slug,
      templateId,
      data,
      username: data.username,
      selectedSectionId: data.sections[0]?.id ?? null,
      dirty: false,
    })),
  setTitle: (title) => set(() => ({ title, dirty: true })),
  setSlug: (slug) => set(() => ({ slug, dirty: true })),
  setUsername: (username) =>
    set((state) => ({
      username,
      data: {
        ...state.data,
        username,
      },
      dirty: true,
    })),
  setTemplateId: (templateId) => set(() => ({ templateId, dirty: true })),
  setPreviewDevice: (previewDevice) => set(() => ({ previewDevice })),
  selectSection: (selectedSectionId) => set(() => ({ selectedSectionId })),
  addSection: (type) =>
    set((state) => {
      const section = createSection(type);
      return {
        data: {
          ...state.data,
          sections: [...state.data.sections, section],
        },
        selectedSectionId: section.id,
        dirty: true,
      };
    }),
  removeSection: (id) =>
    set((state) => {
      const nextSections = state.data.sections.filter((section) => section.id !== id);

      return {
        data: {
          ...state.data,
          sections: nextSections,
        },
        selectedSectionId:
          state.selectedSectionId === id
            ? (nextSections[0]?.id ?? null)
            : state.selectedSectionId,
        dirty: true,
      };
    }),
  duplicateSection: (id) =>
    set((state) => {
      const index = state.data.sections.findIndex((section) => section.id === id);
      if (index === -1) return state;

      const copied = cloneSection(state.data.sections[index]);
      const nextSections = [...state.data.sections];
      nextSections.splice(index + 1, 0, copied);

      return {
        data: {
          ...state.data,
          sections: nextSections,
        },
        selectedSectionId: copied.id,
        dirty: true,
      };
    }),
  reorderSection: (activeId, overId) =>
    set((state) => ({
      data: {
        ...state.data,
        sections: reorderSections(state.data.sections, activeId, overId),
      },
      dirty: true,
    })),
  renameSection: (id, title) =>
    set((state) => ({
      data: {
        ...state.data,
        sections: state.data.sections.map((section) =>
          section.id === id
            ? {
                ...section,
                title,
              }
            : section,
        ),
      },
      dirty: true,
    })),
  toggleSectionVisibility: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        sections: state.data.sections.map((section) =>
          section.id === id
            ? {
                ...section,
                hidden: !section.hidden,
              }
            : section,
        ),
      },
      dirty: true,
    })),
  updateSectionContent: (id, value) =>
    set((state) => ({
      data: {
        ...state.data,
        sections: state.data.sections.map((section) =>
          section.id === id
            ? {
                ...section,
                content: value as ResumeSection["content"],
              }
            : section,
        ),
      },
      dirty: true,
    })),
  updateStyle: (value) =>
    set((state) => ({
      data: {
        ...state.data,
        style: {
          ...state.data.style,
          ...value,
        },
      },
      dirty: true,
    })),
  markClean: () => set(() => ({ dirty: false })),
}));
