import { z } from 'zod';
const color = z.string().regex(/^(#[0-9a-fA-F]{6})?$/);
const image = z.string().max(7_000_000).regex(/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/);
export const editorSchema = z.object({
  texts: z.record(z.string().max(500), z.string().max(10000)),
  images: z.partialRecord(z.enum(['then', 'now', 'couplePhoto', 'photo', 'logo']), image),
  primaryColor: color, bgColor: color,
  musicUrl: z.string().max(14_000_000).refine(s => !s || /^data:audio\/[\w.+-]+;base64,[A-Za-z0-9+/=]+$/.test(s)),
});
export const settingsSchema = z.object({
  studio_name: z.string().trim().min(1).max(150), contact_email: z.email(),
  whatsapp_number: z.string().regex(/^\+?[\d ()-]{7,25}$/), location: z.string().max(200),
  email_notifications: z.boolean().optional(), whatsapp_tracking: z.boolean().optional(),
});
export const templateSchema = z.object({ title: z.string().trim().min(1).max(150), category: z.string().trim().min(1).max(80), badge: z.string().max(80), enabled: z.boolean().optional() });
