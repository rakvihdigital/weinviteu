import type { Invitation, Template } from "@/types/invitation";
export const demoInvitation: Invitation = {
  templateId: "royal-garden",
  design: "palace",
  occasion: "wedding",
  names: "Arjun & Priya",
  tagline:
    "Together with our families, we invite you to celebrate our wedding.",
  date: "2027-12-12",
  time: "18:00",
  timezone: "+05:30",
  venue: "The Leela Palace",
  location: "Bengaluru, Karnataka, India",
  story:
    "From a chance meeting to a thousand little moments, our story has always felt like coming home. Now, we begin our favourite chapter — and we would love for you to be part of it.",
  theme: "ivory",
  accent: "#98753f",
  font: "classic",
  gallery: ["garden", "palace", "flowers"],
  music: "piano",
  entrance: "palace",
  musicVolume: 0.55,
  customAudioUrl: "",
  rsvpEnabled: true,
  countdownEnabled: true,
};
const samples: Record<Invitation["occasion"], [string, string, string]> = {
  wedding: [
    "Arjun & Priya",
    "Together with our families, we invite you to celebrate our wedding.",
    "Every little moment brought us here. Join us as we begin our forever.",
  ],
  birthday: [
    "Aanya turns 25",
    "Good company, a little sparkle, and a night to remember.",
    "Another year of adventures deserves a beautiful celebration. Come make a memory with us.",
  ],
  engagement: [
    "Rohan & Meera",
    "Two hearts. One beautiful promise.",
    "We said yes to a lifetime together. Join our families as we celebrate the beginning.",
  ],
  baby: [
    "Oh, baby!",
    "A little wonder is on the way.",
    "Our family is growing, and so is our happiness. Join us for an afternoon of love and laughter.",
  ],
  housewarming: [
    "Our new beginning",
    "A new home is even better with you in it.",
    "We have found our little corner of the world. Help us fill it with wonderful memories.",
  ],
  anniversary: [
    "25 years of us",
    "A love worth celebrating, again and again.",
    "A lifetime of small moments, shared dreams, and choosing each other. Celebrate this chapter with us.",
  ],
  pooja: [
    "A celebration of light",
    "Join us for blessings, togetherness, and joy.",
    "We warmly invite you and your family to share in this auspicious celebration.",
  ],
  corporate: [
    "An evening together",
    "Connect. Celebrate. Be inspired.",
    "Join our community for an evening of conversation, new ideas, and meaningful connections.",
  ],
};
export function invitationForTemplate(t: Template): Invitation {
  const [names, tagline, story] = samples[t.category];
  return {
    ...demoInvitation,
    templateId: t.id,
    design: t.design,
    font: t.font,
    occasion: t.category,
    theme: t.theme,
    entrance:
      t.theme === "midnight"
        ? "celestial"
        : t.theme === "forest"
          ? "garden"
          : "palace",
    music: t.theme === "midnight" ? "ambient" : "piano",
    accent: t.accent,
    names,
    tagline,
    story,
  };
}
