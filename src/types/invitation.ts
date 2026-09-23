import { z } from "zod";
import { designKeys, type Design } from "@/data/designs";
export const occasions = [
  "wedding",
  "birthday",
  "engagement",
  "baby",
  "housewarming",
  "anniversary",
  "pooja",
  "corporate",
] as const;
export type Occasion = (typeof occasions)[number];
export const invitationSchema = z.object({
  templateId: z.string().max(80),
  design: z.enum(designKeys).optional(),
  occasion: z.enum(occasions),
  names: z.string().trim().min(1).max(100),
  tagline: z.string().max(180),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine(
      (v) =>
        Number.isFinite(Date.parse(v + "T00:00:00Z")) &&
        new Date(v + "T00:00:00Z").toISOString().slice(0, 10) === v,
    ),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  timezone: z.enum([
    "+05:30",
    "+00:00",
    "-04:00",
    "-05:00",
    "+01:00",
    "+08:00",
  ]),
  venue: z.string().max(120),
  location: z.string().max(220),
  story: z.string().max(2000),
  theme: z.enum(["ivory", "forest", "rose", "midnight"]),
  palette: z
    .enum(["original", "sage", "lavender", "blush", "sand", "midnight"])
    .optional(),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  font: z.enum(["classic", "modern", "romantic"]),
  gallery: z
    .array(
      z.union([
        z.enum(["garden", "palace", "flowers"]),
        z.string().regex(/^local:[0-9a-f-]{36}$/),
      ]),
    )
    .max(12),
  music: z.enum(["none", "piano", "bells", "ambient", "custom"]),
  entrance: z.enum(["palace", "celestial", "garden"]).default("palace"),
  musicVolume: z.number().min(0).max(1).default(0.55),
  customAudioUrl: z
    .string()
    .max(2048)
    .refine((v) => {
      if (v === "") return true;
      try {
        const u = new URL(v);
        return u.protocol === "https:" && !u.username && !u.password;
      } catch {
        return false;
      }
    }, "Use a public HTTPS audio URL without embedded credentials")
    .default(""),
  rsvpEnabled: z.boolean(),
  countdownEnabled: z.boolean(),
});
export type Invitation = z.infer<typeof invitationSchema>;
export interface Template {
  id: string;
  name: string;
  category: Occasion;
  theme: Invitation["theme"];
  accent: string;
  motif: string;
  label: string;
  design: Design;
  description: string;
  font: Invitation["font"];
}
