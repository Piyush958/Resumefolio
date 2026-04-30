import { CheckCircle2, Link2, Palette, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  {
    icon: Palette,
    title: "Drag & Drop Editor",
    description: "Add, reorder, duplicate, and customize resume sections instantly.",
  },
  {
    icon: Link2,
    title: "Shareable Link",
    description: "Publish your resume on a clean public link for recruiters.",
  },
  {
    icon: Sparkles,
    title: "Premium Templates",
    description: "Use modern templates and unlock portfolio-style layouts.",
  },
  {
    icon: Shield,
    title: "Own Your Data",
    description: "Secure authentication and storage powered by Supabase.",
  },
];

export function Landing() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-4 py-10 md:px-8">
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-background via-background to-muted p-8 md:p-14">
        <div className="max-w-3xl space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <CheckCircle2 className="size-3.5" /> Launch Fast, Spend Zero
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
            Build a premium resume + portfolio in minutes.
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            ResumeLink helps you create a modern, ATS-safe resume and public profile without design stress.
            Start free, upgrade only after you start earning.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <a href="/dashboard">Start Building</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="/login">Login with Google</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item) => (
          <Card key={item.title}>
            <CardContent className="space-y-3 p-5">
              <item.icon className="size-5 text-primary" />
              <h2 className="text-base font-semibold">{item.title}</h2>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
