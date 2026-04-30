import type { ResumeSectionType, TemplateId } from "@/types/resume";

export const APP_NAME = "ResumeLink";

export const FREE_PLAN = {
  maxResumes: 2,
  maxSections: 6,
  allowedTemplates: ["classic"] as TemplateId[],
  brandingLabel: "Made with ResumeLink",
};

export const PRO_PLAN = {
  priceInINR: 99,
};

export const SECTION_LABELS: Record<ResumeSectionType, string> = {
  personal: "Personal Info",
  summary: "Professional Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  achievements: "Achievements",
  languages: "Languages",
  custom: "Custom Section",
};

export const FONT_FAMILIES = {
  inter: "Inter, system-ui, sans-serif",
  poppins: "Poppins, system-ui, sans-serif",
  playfair: "'Playfair Display', Georgia, serif",
} as const;
