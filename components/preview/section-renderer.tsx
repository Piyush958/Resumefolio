import { Badge } from "@/components/ui/badge";
import type {
  AchievementsContent,
  CertificationsContent,
  CustomContent,
  EducationContent,
  ExperienceContent,
  LanguagesContent,
  PersonalInfoContent,
  ProjectsContent,
  ResumeSection,
  SkillsContent,
  SummaryContent,
} from "@/types/resume";

interface SectionRendererProps {
  section: ResumeSection;
  showHeading: boolean;
  accent: string;
}

function SectionHeading({ title, accent }: { title: string; accent: string }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
      <h3 className="text-sm font-semibold uppercase tracking-wider">{title}</h3>
    </div>
  );
}

export function SectionRenderer({ section, showHeading, accent }: SectionRendererProps) {
  if (section.hidden) return null;

  switch (section.type) {
    case "personal": {
      const content = section.content as PersonalInfoContent;
      return (
        <section>
          {showHeading ? <SectionHeading title={section.title} accent={accent} /> : null}
          <h1 className="text-2xl font-bold">{content.fullName}</h1>
          <p className="text-base text-muted-foreground">{content.title}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {[content.location, content.email, content.phone].filter(Boolean).join(" | ")}
          </p>
          {content.website ? (
            <a
              className="mt-1 inline-flex text-sm underline"
              href={content.website}
              target="_blank"
              rel="noreferrer"
            >
              {content.website}
            </a>
          ) : null}
        </section>
      );
    }

    case "summary":
      {
      const content = section.content as SummaryContent;
      return (
        <section>
          {showHeading ? <SectionHeading title={section.title} accent={accent} /> : null}
          <p className="text-sm leading-6 text-muted-foreground">{content.text}</p>
        </section>
      );
    }

    case "experience":
      {
      const content = section.content as ExperienceContent;
      return (
        <section>
          {showHeading ? <SectionHeading title={section.title} accent={accent} /> : null}
          <div className="space-y-4">
            {content.items.map((item) => (
              <article key={item.id}>
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-semibold">{item.role}</h4>
                  <span className="text-xs text-muted-foreground">
                    {item.startDate} - {item.endDate}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{item.company}</p>
                <p className="mt-1 text-sm leading-6">{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      );
    }

    case "education":
      {
      const content = section.content as EducationContent;
      return (
        <section>
          {showHeading ? <SectionHeading title={section.title} accent={accent} /> : null}
          <div className="space-y-3">
            {content.items.map((item) => (
              <article key={item.id}>
                <h4 className="font-semibold">{item.degree}</h4>
                <p className="text-sm text-muted-foreground">{item.institution}</p>
                <p className="text-xs text-muted-foreground">
                  {item.startDate} - {item.endDate}
                  {item.gpa ? ` | GPA ${item.gpa}` : ""}
                </p>
              </article>
            ))}
          </div>
        </section>
      );
    }

    case "skills":
      {
      const content = section.content as SkillsContent;
      return (
        <section>
          {showHeading ? <SectionHeading title={section.title} accent={accent} /> : null}
          <div className="flex flex-wrap gap-2">
            {content.items.map((item) => (
              <Badge key={item.id} variant="secondary" className="text-xs">
                {item.name}
                {item.level ? ` (${item.level})` : ""}
              </Badge>
            ))}
          </div>
        </section>
      );
    }

    case "projects":
      {
      const content = section.content as ProjectsContent;
      return (
        <section>
          {showHeading ? <SectionHeading title={section.title} accent={accent} /> : null}
          <div className="space-y-3">
            {content.items.map((item) => (
              <article key={item.id}>
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <p className="text-xs">{item.techStack}</p>
                {item.link ? (
                  <a className="text-xs underline" href={item.link} target="_blank" rel="noreferrer">
                    {item.link}
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      );
    }

    case "certifications":
      {
      const content = section.content as CertificationsContent;
      return (
        <section>
          {showHeading ? <SectionHeading title={section.title} accent={accent} /> : null}
          <ul className="space-y-2 text-sm">
            {content.items.map((item) => (
              <li key={item.id}>
                <strong>{item.name}</strong> - {item.issuer}
                {item.year ? ` (${item.year})` : ""}
              </li>
            ))}
          </ul>
        </section>
      );
    }

    case "achievements":
      {
      const content = section.content as AchievementsContent;
      return (
        <section>
          {showHeading ? <SectionHeading title={section.title} accent={accent} /> : null}
          <ul className="space-y-2 text-sm">
            {content.items.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong> - {item.description}
              </li>
            ))}
          </ul>
        </section>
      );
    }

    case "languages":
      {
      const content = section.content as LanguagesContent;
      return (
        <section>
          {showHeading ? <SectionHeading title={section.title} accent={accent} /> : null}
          <div className="flex flex-wrap gap-2">
            {content.items.map((item) => (
              <Badge key={item.id} variant="outline">
                {item.name} - {item.proficiency}
              </Badge>
            ))}
          </div>
        </section>
      );
    }

    case "custom":
      {
      const content = section.content as CustomContent;
      return (
        <section>
          {showHeading ? <SectionHeading title={section.title} accent={accent} /> : null}
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p>{content.text}</p>
          </div>
        </section>
      );
    }

    default:
      return null;
  }
}
