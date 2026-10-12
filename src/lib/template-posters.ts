const posters = new Set([
  "2e1171ae-aab1-4889-904d-8b5190d39f10.html",
  "516de1c5-0060-4e76-8223-0c3f4ef239d1.html",
  "anniversary-invitation (1).html",
  "baby-shower-invitation.html",
  "birthday-invitation.html",
  "birthday-red-gold.html",
  "griha-pravesh-invitation.html",
  "invitation (2).html",
  "pooja-invitation.html",
  "summit-invitation.html",
  "temple-invitation.html"
]);

const UPLOADED = /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.html$/;

/** Storage object, next to the uploaded HTML in the base-templates bucket, holding its cover image. */
export function posterObjectName(id: string) {
  return `posters/${id}`;
}

/**
 * Bundled templates use a poster from public/template-posters. Templates uploaded from the admin
 * panel point at the cover stored with them, which may not exist; callers fall back to the live page.
 */
export function getTemplatePoster(filename: string): string | null {
  let name: string;
  try { name = decodeURIComponent(filename.split("/").pop()!.split("?")[0]); } catch { return null; }
  if (posters.has(name)) return `/template-posters/${encodeURIComponent(name.replace(/\.html$/, ""))}.webp`;
  const uploaded = UPLOADED.exec(name);
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return uploaded && base ? `${base.replace(/\/$/, "")}/storage/v1/object/public/base-templates/${posterObjectName(uploaded[1])}` : null;
}
