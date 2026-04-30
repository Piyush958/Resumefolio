"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ResumeCard } from "@/components/dashboard/resume-card";
import { Button } from "@/components/ui/button";
import type { ResumeRecord } from "@/types/resume";

interface DashboardClientProps {
  initialResumes: ResumeRecord[];
  canCreate: boolean;
}

export function DashboardClient({ initialResumes, canCreate }: DashboardClientProps) {
  const [resumes, setResumes] = useState(initialResumes);
  const isEmpty = useMemo(() => resumes.length === 0, [resumes]);

  const handleDelete = async (id: string) => {
    const optimistic = resumes.filter((item) => item.id !== id);
    setResumes(optimistic);

    const response = await fetch(`/api/resumes/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setResumes(resumes);
      toast.error("Delete failed. Please try again.");
      return;
    }

    toast.success("Resume deleted.");
  };

  const handleCreate = async () => {
    if (!canCreate) {
      toast.error("Free plan limit reached. Upgrade to create more resumes.");
      return;
    }

    const response = await fetch("/api/resumes", {
      method: "POST",
    });

    if (!response.ok) {
      toast.error("Could not create resume.");
      return;
    }

    const payload = (await response.json()) as { id: string };
    window.location.href = `/editor/${payload.id}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Resumes</h1>
          <p className="text-sm text-muted-foreground">
            Build, edit, share, and export your resume portfolio.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="size-4" /> Create New Resume
        </Button>
      </div>

      {isEmpty ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No resumes yet. Click Create New Resume to start.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
