import { SECTION_LABELS } from "@/lib/constants";
import { createUsername } from "@/lib/slug";
import type {
  ResumeDocumentData,
  ResumeSection,
  ResumeSectionType,
  SectionContentMap,
} from "@/types/resume";

function sectionId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createSection<T extends ResumeSectionType>(
  type: T,
): ResumeSection<T> {
  const shared = {
    id: sectionId(type),
    type,
    title: SECTION_LABELS[type],
    hidden: false,
  };

  const contentMap: SectionContentMap = {
    personal: {
      fullName: "Your Name",
      title: "Your Role",
      location: "City, Country",
      email: "you@example.com",
      phone: "+91 XXXXX XXXXX",
      website: "https://yourportfolio.com",
      photoUrl: "",
      photoShape: "circle",
    },
    summary: {
      text: "Write a short summary focused on impact, skills, and goals.",
    },
    experience: {
      items: [
        {
          id: sectionId("exp"),
          company: "Company Name",
          role: "Role",
          startDate: "2023",
          endDate: "Present",
          description:
            "Built and shipped high-impact features, improved conversion, and collaborated across teams.",
        },
      ],
    },
    education: {
      items: [
        {
          id: sectionId("edu"),
          degree: "Degree",
          institution: "University",
          startDate: "2019",
          endDate: "2023",
          gpa: "8.6/10",
        },
      ],
    },
    skills: {
      items: [
        { id: sectionId("skill"), name: "JavaScript", level: "advanced" },
        { id: sectionId("skill"), name: "React", level: "advanced" },
      ],
    },
    projects: {
      items: [
        {
          id: sectionId("project"),
          title: "Project Name",
          description:
            "Created a robust project with measurable outcomes and clean UX.",
          link: "https://github.com/username/project",
          techStack: "Next.js, Supabase, TypeScript",
        },
      ],
    },
    certifications: {
      items: [
        {
          id: sectionId("cert"),
          name: "Certification",
          issuer: "Issuer",
          year: "2025",
        },
      ],
    },
    achievements: {
      items: [
        {
          id: sectionId("achievement"),
          title: "Achievement",
          description: "Describe the achievement and impact in one line.",
        },
      ],
    },
    languages: {
      items: [
        { id: sectionId("lang"), name: "English", proficiency: "Fluent" },
      ],
    },
    custom: {
      text: "Add your custom content.",
    },
  };

  return {
    ...shared,
    content: contentMap[type] as SectionContentMap[T],
  };
}

export function createDefaultResumeData(email?: string | null): ResumeDocumentData {
  const now = new Date().toISOString();

  return {
    username: createUsername(email),
    headline: "My Resume",
    updatedAt: now,
    style: {
      primaryColor: "#0f172a",
      backgroundColor: "#ffffff",
      backgroundPattern: "none",
      fontFamily: "inter",
      sectionSpacing: 18,
      showHeadings: true,
    },
    sections: [
      createSection("personal"),
      createSection("summary"),
      createSection("experience"),
      createSection("education"),
      createSection("skills"),
      createSection("projects"),
    ],
  };
}
