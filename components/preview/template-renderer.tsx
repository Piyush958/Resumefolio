import { cn } from "@/lib/utils";
import type { ResumeDocumentData, TemplateId } from "@/types/resume";
import { SectionRenderer } from "@/components/preview/section-renderer";

interface TemplateRendererProps {
  data: ResumeDocumentData;
  templateId: TemplateId;
  isPro: boolean;
}

function patternClass(pattern: ResumeDocumentData["style"]["backgroundPattern"]) {
  switch (pattern) {
    case "dots":
      return "bg-[radial-gradient(circle,_rgba(15,23,42,0.08)_1px,_transparent_1px)] bg-[size:14px_14px]";
    case "grid":
      return "bg-[linear-gradient(to_right,rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.08)_1px,transparent_1px)] bg-[size:16px_16px]";
    case "gradient":
      return "bg-gradient-to-br from-background via-background to-muted";
    default:
      return "";
  }
}

function fontClass(fontFamily: ResumeDocumentData["style"]["fontFamily"]) {
  if (fontFamily === "poppins") return "font-[Poppins]";
  if (fontFamily === "playfair") return "font-[Playfair_Display]";
  return "font-[Inter]";
}

export function TemplateRenderer({ data, templateId, isPro }: TemplateRendererProps) {
  const locked = !isPro && templateId !== "classic";
  const effectiveTemplate = locked ? "classic" : templateId;

  const wrapperClass = cn(
    "mx-auto w-full max-w-4xl rounded-2xl border bg-card p-6 shadow-sm",
    patternClass(data.style.backgroundPattern),
    fontClass(data.style.fontFamily),
  );

  const spacing = `${data.style.sectionSpacing}px`;

  if (effectiveTemplate === "creative") {
    return (
      <div className={wrapperClass} style={{ backgroundColor: data.style.backgroundColor }}>
        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          <aside className="rounded-xl p-4" style={{ backgroundColor: `${data.style.primaryColor}14` }}>
            {data.sections.slice(0, 3).map((section) => (
              <div key={section.id} style={{ marginBottom: spacing }}>
                <SectionRenderer
                  section={section}
                  showHeading={data.style.showHeadings}
                  accent={data.style.primaryColor}
                />
              </div>
            ))}
          </aside>
          <main>
            {data.sections.slice(3).map((section) => (
              <div key={section.id} style={{ marginBottom: spacing }}>
                <SectionRenderer
                  section={section}
                  showHeading={data.style.showHeadings}
                  accent={data.style.primaryColor}
                />
              </div>
            ))}
          </main>
        </div>
      </div>
    );
  }

  if (effectiveTemplate === "portfolio") {
    return (
      <div className={wrapperClass} style={{ backgroundColor: data.style.backgroundColor }}>
        <div className="mb-8 rounded-2xl p-6" style={{ backgroundColor: `${data.style.primaryColor}12` }}>
          {data.sections
            .filter((section) => section.type === "personal" || section.type === "summary")
            .map((section) => (
              <div key={section.id} style={{ marginBottom: spacing }}>
                <SectionRenderer
                  section={section}
                  showHeading={data.style.showHeadings}
                  accent={data.style.primaryColor}
                />
              </div>
            ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {data.sections
            .filter((section) => section.type !== "personal" && section.type !== "summary")
            .map((section) => (
              <div key={section.id} className="rounded-xl border p-4" style={{ borderColor: `${data.style.primaryColor}40` }}>
                <SectionRenderer
                  section={section}
                  showHeading={data.style.showHeadings}
                  accent={data.style.primaryColor}
                />
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (effectiveTemplate === "executive") {
    return (
      <div className={cn(wrapperClass, "bg-zinc-950 text-zinc-100")}>
        {data.sections.map((section) => (
          <div key={section.id} style={{ marginBottom: spacing }}>
            <SectionRenderer
              section={section}
              showHeading={data.style.showHeadings}
              accent={data.style.primaryColor}
            />
          </div>
        ))}
      </div>
    );
  }

  if (effectiveTemplate === "tech") {
    return (
      <div className={wrapperClass} style={{ backgroundColor: data.style.backgroundColor }}>
        <div className="grid gap-5 md:grid-cols-[1fr_2fr]">
          <aside className="rounded-xl border p-4">
            {data.sections
              .filter((section) => ["personal", "skills", "languages"].includes(section.type))
              .map((section) => (
                <div key={section.id} style={{ marginBottom: spacing }}>
                  <SectionRenderer
                    section={section}
                    showHeading={data.style.showHeadings}
                    accent={data.style.primaryColor}
                  />
                </div>
              ))}
          </aside>
          <main>
            {data.sections
              .filter((section) => !["personal", "skills", "languages"].includes(section.type))
              .map((section) => (
                <div key={section.id} style={{ marginBottom: spacing }}>
                  <SectionRenderer
                    section={section}
                    showHeading={data.style.showHeadings}
                    accent={data.style.primaryColor}
                  />
                </div>
              ))}
          </main>
        </div>
      </div>
    );
  }

  if (effectiveTemplate === "fresh") {
    return (
      <div className={cn(wrapperClass, "border-dashed")} style={{ backgroundColor: data.style.backgroundColor }}>
        {data.sections.map((section) => (
          <div key={section.id} className="rounded-xl p-3" style={{ marginBottom: spacing, backgroundColor: `${data.style.primaryColor}10` }}>
            <SectionRenderer
              section={section}
              showHeading={data.style.showHeadings}
              accent={data.style.primaryColor}
            />
          </div>
        ))}
      </div>
    );
  }

  if (effectiveTemplate === "modern") {
    return (
      <div className={wrapperClass} style={{ backgroundColor: data.style.backgroundColor }}>
        {data.sections.map((section) => (
          <div key={section.id} className="border-l-2 pl-4" style={{ marginBottom: spacing, borderColor: data.style.primaryColor }}>
            <SectionRenderer
              section={section}
              showHeading={data.style.showHeadings}
              accent={data.style.primaryColor}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={wrapperClass} style={{ backgroundColor: data.style.backgroundColor }}>
      {data.sections.map((section) => (
        <div key={section.id} style={{ marginBottom: spacing }}>
          <SectionRenderer
            section={section}
            showHeading={data.style.showHeadings}
            accent={data.style.primaryColor}
          />
        </div>
      ))}
    </div>
  );
}
