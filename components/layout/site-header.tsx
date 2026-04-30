import { FileText } from "lucide-react";
import Link from "next/link";
import { AuthControls } from "@/components/layout/auth-controls";
import { ThemeToggle } from "@/components/layout/theme-toggle";

interface SiteHeaderProps {
  isAuthenticated: boolean;
}

export function SiteHeader({ isAuthenticated }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="rounded-md bg-primary p-2 text-primary-foreground">
            <FileText className="size-4" />
          </span>
          ResumeLink
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground md:inline-flex"
          >
            Dashboard
          </Link>
          <ThemeToggle />
          <AuthControls isAuthenticated={isAuthenticated} />
        </nav>
      </div>
    </header>
  );
}
