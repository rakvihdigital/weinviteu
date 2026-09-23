import type { Invitation } from "@/types/invitation";
export const designKeys = [
  "palace",
  "botanical",
  "gazette",
  "ticket",
  "rainbow",
  "blueprint",
  "vinyl",
  "mandala",
  "swiss",
  "editorial",
  "disco",
  "celestial",
] as const;
export type Design = (typeof designKeys)[number];
export const designNames: Record<Design, string> = {
  palace: "Palace of Promises",
  botanical: "Botanical Conservatory",
  gazette: "The Love Gazette",
  ticket: "Midnight Pass",
  rainbow: "Over the Rainbow",
  blueprint: "A Place Called Home",
  vinyl: "Our Golden Record",
  mandala: "Marigold Mandala",
  swiss: "The Assembly",
  editorial: "Vows, Vol. 01",
  disco: "Disco After Dark",
  celestial: "Written in the Stars",
};
export const legacyDesigns: Record<string, Design> = {
  "royal-garden": "palace",
  "emerald-vows": "botanical",
  "rose-promise": "gazette",
  "golden-hour": "ticket",
  "little-moon": "rainbow",
  "open-doors": "blueprint",
  "always-us": "vinyl",
  "sacred-light": "mandala",
  "after-hours": "swiss",
  "ivory-sonnet": "editorial",
  "confetti-club": "disco",
  "moonlit-yes": "celestial",
  "birthday-bloom": "rainbow",
  "engagement-sonnet": "editorial",
  "baby-starlight": "celestial",
  "baby-garden": "botanical",
  "home-garden": "botanical",
  "home-gazette": "gazette",
  "anniversary-palace": "palace",
  "anniversary-stars": "celestial",
  "festival-palace": "palace",
  "pooja-botanical": "botanical",
  "corporate-pass": "ticket",
  "corporate-editorial": "editorial",
};
export function getDesign(
  value: Pick<Invitation, "templateId" | "design">,
): Design {
  return value.design ?? legacyDesigns[value.templateId] ?? "palace";
}
