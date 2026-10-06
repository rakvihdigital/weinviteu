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

export function getTemplatePoster(filename: string): string | null {
  let name: string;
  try { name = decodeURIComponent(filename.split("/").pop()!.split("?")[0]); } catch { return null; }
  return posters.has(name) ? `/template-posters/${encodeURIComponent(name.replace(/\.html$/, ""))}.webp` : null;
}
