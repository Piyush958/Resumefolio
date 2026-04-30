"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function LoginCard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) {
      toast.error(error.message);
    }
  };

  const signInWithPassword = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success("Logged in.");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login to ResumeLink</CardTitle>
        <CardDescription>
          Start free with Google login. Email login also works after you configure SMTP.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full" variant="secondary" onClick={signInWithGoogle}>
          <LogIn className="size-4" /> Continue with Google
        </Button>

        <div className="space-y-2 rounded-lg border p-3">
          <Label>Email</Label>
          <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          <Label>Password</Label>
          <Input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            type="password"
          />
          <Button className="w-full" onClick={signInWithPassword} disabled={loading || !email || !password}>
            {loading ? "Signing in..." : "Sign in with Email"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
