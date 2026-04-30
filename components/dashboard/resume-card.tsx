import { ExternalLink, Pencil, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { ResumeRecord } from "@/types/resume";

interface ResumeCardProps {
  resume: ResumeRecord;
  onDelete: (id: string) => void;
}

export function ResumeCard({ resume, onDelete }: ResumeCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="line-clamp-1 text-lg">{resume.title}</CardTitle>
        <p className="text-xs text-muted-foreground">/{resume.data.username}/{resume.slug}</p>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
          Template: <strong>{resume.template_id}</strong>
          <br />
          Updated: {new Date(resume.updated_at).toLocaleDateString()}
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <Button asChild size="sm" variant="secondary">
          <a href={`/preview/${resume.id}`}>
            <ExternalLink className="size-4" /> View
          </a>
        </Button>
        <Button asChild size="sm" variant="secondary">
          <a href={`/editor/${resume.id}`}>
            <Pencil className="size-4" /> Edit
          </a>
        </Button>
        <Button asChild size="sm" variant="secondary">
          <a href={`/share/${resume.id}`}>
            <Share2 className="size-4" /> Share
          </a>
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(resume.id)}>
          <Trash2 className="size-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
