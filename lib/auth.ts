import { createUsername } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRecord } from "@/types/resume";
import { redirect } from "next/navigation";

export async function getUserOrRedirect() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function ensureProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: existing, error: selectError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<ProfileRecord>();

  if (!selectError && existing) {
    return existing;
  }

  const candidateUsername = createUsername(user.email);

  const { data: inserted, error: insertError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        full_name: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? null,
        username: candidateUsername,
        is_pro: false,
      },
      { onConflict: "id" },
    )
    .select("*")
    .single<ProfileRecord>();

  if (insertError) {
    throw new Error(insertError.message);
  }

  return inserted;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
