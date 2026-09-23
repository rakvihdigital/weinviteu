const PREFIX = "weinviteu-photo:";
export const PHOTO_EVENT = "weinviteu-photos-changed";
export const isLocalPhoto = (id: string) => id.startsWith("local:");
export function readPhoto(id: string): string | null {
  if (!isLocalPhoto(id)) return null;
  try {
    return localStorage.getItem(PREFIX + id);
  } catch {
    return null;
  }
}
export function savePhoto(data: string): string {
  const id = `local:${crypto.randomUUID()}`;
  localStorage.setItem(PREFIX + id, data);
  window.dispatchEvent(new Event(PHOTO_EVENT));
  return id;
}
export async function preparePhoto(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Choose JPG, PNG or WebP photos.");
  if (file.size > 20 * 1024 * 1024)
    throw new Error("Each photo must be smaller than 20 MB.");
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const scale = Math.min(
      1,
      1400 / Math.max(img.naturalWidth, img.naturalHeight),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser could not prepare this photo.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.8);
  } finally {
    URL.revokeObjectURL(url);
  }
}
