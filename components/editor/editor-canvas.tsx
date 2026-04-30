"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy, Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ResumeSection } from "@/types/resume";

interface EditorCanvasProps {
  sections: ResumeSection[];
  selectedSectionId: string | null;
  onSelect: (id: string) => void;
  onReorder: (activeId: string, overId: string) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

interface SortableSectionItemProps {
  section: ResumeSection;
  active: boolean;
  onSelect: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

function SortableSectionItem({
  section,
  active,
  onSelect,
  onDuplicate,
  onRemove,
  onToggleVisibility,
}: SortableSectionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={active ? "border-primary" : ""}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-left"
              onClick={() => onSelect(section.id)}
            >
              <span className="cursor-grab text-muted-foreground" {...attributes} {...listeners}>
                <GripVertical className="size-4" />
              </span>
              <CardTitle className="text-sm">{section.title}</CardTitle>
            </button>
            <Badge variant="outline" className="text-[10px] uppercase">
              {section.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => onDuplicate(section.id)}>
              <Copy className="size-4" /> Duplicate
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onToggleVisibility(section.id)}>
              {section.hidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              {section.hidden ? "Show" : "Hide"}
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onRemove(section.id)}>
              <Trash2 className="size-4" /> Remove
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function EditorCanvas({
  sections,
  selectedSectionId,
  onSelect,
  onReorder,
  onDuplicate,
  onRemove,
  onToggleVisibility,
}: EditorCanvasProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    onReorder(String(active.id), String(over.id));
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm">Drag & Drop Canvas</CardTitle>
      </CardHeader>
      <CardContent>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {sections.map((section) => (
                <SortableSectionItem
                  key={section.id}
                  section={section}
                  active={selectedSectionId === section.id}
                  onSelect={onSelect}
                  onDuplicate={onDuplicate}
                  onRemove={onRemove}
                  onToggleVisibility={onToggleVisibility}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}
