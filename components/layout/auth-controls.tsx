"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface AuthControlsProps {
  isAuthenticated: boolean;
}

export function AuthControls({ isAuthenticated }: AuthControlsProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (!isAuthenticated) {
    return (
      <Button asChild>
        <a href="/login">Login</a>
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={handleSignOut}>
      Logout
    </Button>
  );
}
