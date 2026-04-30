"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { ResumeDocumentData, ResumeSection } from "@/types/resume";

interface PropertiesPanelProps {
  section: ResumeSection | null;
  style: ResumeDocumentData["style"];
  onRenameSection: (id: string, title: string) => void;
  onUpdateSectionContent: (id: string, content: unknown) => void;
  onUpdateStyle: (style: Partial<ResumeDocumentData["style"]>) => void;
}

function ItemCard({
  children,
  onDelete,
}: {
  children: React.ReactNode;
  onDelete: () => void;
}) {
  return (
    <div className="space-y-2 rounded-lg border p-3">
      {children}
      <Button variant="outline" size="sm" onClick={onDelete}>
        <Trash2 className="size-4" /> Remove
      </Button>
    </div>
  );
}

export function PropertiesPanel({
  section,
  style,
  onRenameSection,
  onUpdateSectionContent,
  onUpdateStyle,
}: PropertiesPanelProps) {
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handlePhotoUpload = async (targetSectionId: string, file: File, content: Record<string, unknown>) => {
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/photo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Photo upload failed");
      }

      const payload = (await response.json()) as { url: string };
      onUpdateSectionContent(targetSectionId, {
        ...content,
        photoUrl: payload.url,
      });
      toast.success("Photo uploaded.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Photo upload failed.";
      toast.error(message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const renderSectionEditor = () => {
    if (!section) {
      return <p className="text-sm text-muted-foreground">Select a section from canvas to edit.</p>;
    }

    const content = section.content as unknown as Record<string, unknown>;

    if (section.type === "personal") {
      return (
        <div className="space-y-2">
          {["fullName", "title", "location", "email", "phone", "website", "photoUrl"].map((field) => (
            <div key={field} className="space-y-1">
              <Label className="capitalize">{field}</Label>
              <Input
                value={String(content[field] ?? "")}
                onChange={(event) =>
                  onUpdateSectionContent(section.id, {
                    ...content,
                    [field]: event.target.value,
                  })
                }
              />
            </div>
          ))}
          <div className="space-y-1">
            <Label>Photo Shape</Label>
            <Select
              value={String(content.photoShape ?? "circle")}
              onValueChange={(value) =>
                onUpdateSectionContent(section.id, {
                  ...content,
                  photoShape: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="square">Square</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Upload Photo</Label>
            <Input
              type="file"
              accept="image/*"
              disabled={uploadingPhoto}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                void handlePhotoUpload(section.id, file, content);
              }}
            />
          </div>
        </div>
      );
    }

    if (section.type === "summary" || section.type === "custom") {
      return (
        <div className="space-y-1">
          <Label>Text</Label>
          <Textarea
            rows={6}
            value={String(content.text ?? "")}
            onChange={(event) =>
              onUpdateSectionContent(section.id, {
                ...content,
                text: event.target.value,
              })
            }
          />
        </div>
      );
    }

    if (
      [
        "experience",
        "education",
        "skills",
        "projects",
        "certifications",
        "achievements",
        "languages",
      ].includes(section.type)
    ) {
      const items = Array.isArray(content.items) ? content.items : [];

      const updateItem = (index: number, value: Record<string, unknown>) => {
        const nextItems = items.map((item: Record<string, unknown>, itemIndex: number) =>
          itemIndex === index ? value : item,
        );
        onUpdateSectionContent(section.id, {
          ...content,
          items: nextItems,
        });
      };

      const removeItem = (index: number) => {
        const nextItems = items.filter((_: unknown, itemIndex: number) => itemIndex !== index);
        onUpdateSectionContent(section.id, {
          ...content,
          items: nextItems,
        });
      };

      const addItem = () => {
        const baseByType: Record<string, Record<string, string>> = {
          experience: {
            id: `exp_${Math.random().toString(36).slice(2, 8)}`,
            company: "",
            role: "",
            startDate: "",
            endDate: "",
            description: "",
          },
          education: {
            id: `edu_${Math.random().toString(36).slice(2, 8)}`,
            degree: "",
            institution: "",
            startDate: "",
            endDate: "",
            gpa: "",
          },
          skills: {
            id: `skill_${Math.random().toString(36).slice(2, 8)}`,
            name: "",
            level: "",
          },
          projects: {
            id: `prj_${Math.random().toString(36).slice(2, 8)}`,
            title: "",
            description: "",
            link: "",
            techStack: "",
          },
          certifications: {
            id: `cert_${Math.random().toString(36).slice(2, 8)}`,
            name: "",
            issuer: "",
            year: "",
          },
          achievements: {
            id: `ach_${Math.random().toString(36).slice(2, 8)}`,
            title: "",
            description: "",
          },
          languages: {
            id: `lang_${Math.random().toString(36).slice(2, 8)}`,
            name: "",
            proficiency: "",
          },
        };

        const base = baseByType[section.type] || {
          id: `itm_${Math.random().toString(36).slice(2, 8)}`,
          title: "",
        };

        onUpdateSectionContent(section.id, {
          ...content,
          items: [...items, base],
        });
      };

      return (
        <div className="space-y-3">
          {items.map((item: Record<string, unknown>, index: number) => (
            <ItemCard key={String(item.id ?? index)} onDelete={() => removeItem(index)}>
              {Object.entries(item)
                .filter(([key]) => key !== "id")
                .map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <Label className="capitalize">{key}</Label>
                    {String(value).length > 60 || key.toLowerCase().includes("description") ? (
                      <Textarea
                        value={String(value ?? "")}
                        rows={3}
                        onChange={(event) =>
                          updateItem(index, {
                            ...item,
                            [key]: event.target.value,
                          })
                        }
                      />
                    ) : (
                      <Input
                        value={String(value ?? "")}
                        onChange={(event) =>
                          updateItem(index, {
                            ...item,
                            [key]: event.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                ))}
            </ItemCard>
          ))}

          <Button variant="secondary" size="sm" onClick={addItem}>
            <Plus className="size-4" /> Add item
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm">Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="content" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            {section ? (
              <div className="space-y-1">
                <Label>Section Title</Label>
                <Input
                  value={section.title}
                  onChange={(event) => onRenameSection(section.id, event.target.value)}
                />
              </div>
            ) : null}
            {renderSectionEditor()}
          </TabsContent>

          <TabsContent value="design" className="space-y-4">
            <div className="space-y-1">
              <Label>Primary Color</Label>
              <Input
                type="color"
                value={style.primaryColor}
                onChange={(event) => onUpdateStyle({ primaryColor: event.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Background Color</Label>
              <Input
                type="color"
                value={style.backgroundColor}
                onChange={(event) => onUpdateStyle({ backgroundColor: event.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Background Pattern</Label>
              <Select
                value={style.backgroundPattern}
                onValueChange={(value) =>
                  onUpdateStyle({ backgroundPattern: value as ResumeDocumentData["style"]["backgroundPattern"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="dots">Dots</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Font Family</Label>
              <Select
                value={style.fontFamily}
                onValueChange={(value) =>
                  onUpdateStyle({ fontFamily: value as ResumeDocumentData["style"]["fontFamily"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inter">Inter</SelectItem>
                  <SelectItem value="poppins">Poppins</SelectItem>
                  <SelectItem value="playfair">Playfair Display</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Section Spacing: {style.sectionSpacing}px</Label>
              <Slider
                value={[style.sectionSpacing]}
                min={8}
                max={40}
                step={1}
                onValueChange={(value) => onUpdateStyle({ sectionSpacing: value[0] })}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label>Show Section Headings</Label>
              <Switch
                checked={style.showHeadings}
                onCheckedChange={(checked) => onUpdateStyle({ showHeadings: checked })}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
