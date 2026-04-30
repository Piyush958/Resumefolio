import type { ResumeSectionType } from "@/types/resume";
import { SECTION_LABELS } from "@/lib/constants";
import { canUseSectionType } from "@/lib/features";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SectionPaletteProps {
  isPro: boolean;
  onAdd: (type: ResumeSectionType) => void;
}

const sectionTypes = Object.keys(SECTION_LABELS) as ResumeSectionType[];

export function SectionPalette({ isPro, onAdd }: SectionPaletteProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm">Available Sections</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {sectionTypes.map((type) => {
          const locked = !canUseSectionType(type, isPro);
          return (
            <Button
              key={type}
              variant="outline"
              className="justify-between"
              disabled={locked}
              onClick={() => onAdd(type)}
            >
              {SECTION_LABELS[type]}
              {locked ? <span className="text-xs text-muted-foreground">PRO</span> : null}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
