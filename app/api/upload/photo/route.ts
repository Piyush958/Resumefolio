import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file found" }, { status: 400 });
  }

  const extension = file.name.split(".").pop() || "png";
  const path = `${user.id}/${Date.now()}.${extension}`;

  const { error } = await supabase.storage.from("profile-photos").upload(path, file, {
    contentType: file.type,
    upsert: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("profile-photos").getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl });
}
