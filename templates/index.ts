import type { TemplateDefinition } from "@/types/resume";

export const templates: TemplateDefinition[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Clean single-column ATS friendly layout.",
    isPremium: false,
  },
  {
    id: "modern",
    name: "Modern",
    description: "Minimal layout with bold accents and clean spacing.",
    isPremium: true,
  },
  {
    id: "creative",
    name: "Creative",
    description: "Colorful split layout with personality.",
    isPremium: true,
  },
  {
    id: "executive",
    name: "Executive",
    description: "Professional premium look for leadership roles.",
    isPremium: true,
  },
  {
    id: "tech",
    name: "Tech",
    description: "Developer-centric style with badges and project focus.",
    isPremium: true,
  },
  {
    id: "fresh",
    name: "Fresh",
    description: "Student friendly and vibrant presentation.",
    isPremium: true,
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Visual-first resume for freelancers and designers.",
    isPremium: true,
  },
];

export const templateMap = Object.fromEntries(
  templates.map((template) => [template.id, template]),
);
