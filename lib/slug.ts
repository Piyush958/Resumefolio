export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function createResumeSlug(title: string) {
  const base = slugify(title) || "resume";
  const random = Math.random().toString(36).slice(2, 7);
  return `${base}-${random}`;
}

export function createUsername(email?: string | null) {
  if (!email) {
    return `user-${Math.random().toString(36).slice(2, 6)}`;
  }

  const local = email.split("@")[0] || "user";
  return `${slugify(local)}-${Math.random().toString(36).slice(2, 5)}`;
}
