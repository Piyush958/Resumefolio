export type ResumeSectionType =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "achievements"
  | "languages"
  | "custom";

export type TemplateId =
  | "classic"
  | "modern"
  | "creative"
  | "executive"
  | "tech"
  | "fresh"
  | "portfolio";

export interface PersonalInfoContent {
  fullName: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  photoUrl: string;
  photoShape: "circle" | "square";
}

export interface SummaryContent {
  text: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ExperienceContent {
  items: ExperienceItem[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface EducationContent {
  items: EducationItem[];
}

export interface SkillItem {
  id: string;
  name: string;
  level?: "beginner" | "intermediate" | "advanced";
}

export interface SkillsContent {
  items: SkillItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  link?: string;
  techStack?: string;
}

export interface ProjectsContent {
  items: ProjectItem[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year?: string;
}

export interface CertificationsContent {
  items: CertificationItem[];
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
}

export interface AchievementsContent {
  items: AchievementItem[];
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: string;
}

export interface LanguagesContent {
  items: LanguageItem[];
}

export interface CustomContent {
  text: string;
}

export interface SectionContentMap {
  personal: PersonalInfoContent;
  summary: SummaryContent;
  experience: ExperienceContent;
  education: EducationContent;
  skills: SkillsContent;
  projects: ProjectsContent;
  certifications: CertificationsContent;
  achievements: AchievementsContent;
  languages: LanguagesContent;
  custom: CustomContent;
}

export interface ResumeSection<T extends ResumeSectionType = ResumeSectionType> {
  id: string;
  type: T;
  title: string;
  hidden: boolean;
  content: SectionContentMap[T];
}

export interface ResumeStyleSettings {
  primaryColor: string;
  backgroundColor: string;
  backgroundPattern: "none" | "dots" | "grid" | "gradient";
  fontFamily: "inter" | "poppins" | "playfair";
  sectionSpacing: number;
  showHeadings: boolean;
}

export interface ResumeDocumentData {
  username: string;
  headline: string;
  style: ResumeStyleSettings;
  sections: ResumeSection[];
  updatedAt: string;
}

export interface ResumeRecord {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  template_id: TemplateId;
  is_pro: boolean;
  data: ResumeDocumentData;
  created_at: string;
  updated_at: string;
  views_count: number;
}

export interface ProfileRecord {
  id: string;
  username: string;
  full_name: string | null;
  is_pro: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
  isPremium: boolean;
}
