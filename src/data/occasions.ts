import type { Occasion } from "@/types/invitation";
export const occasionData: {
  id: Occasion;
  name: string;
  mark: string;
  description: string;
}[] = [
  {
    id: "wedding",
    name: "Weddings",
    mark: "♡",
    description: "Your story deserves a beautiful beginning.",
  },
  {
    id: "birthday",
    name: "Birthdays",
    mark: "✷",
    description: "Make every year worth remembering.",
  },
  {
    id: "engagement",
    name: "Engagements",
    mark: "◇",
    description: "Begin your forever in style.",
  },
  {
    id: "baby",
    name: "Baby Celebrations",
    mark: "☾",
    description: "Tiny moments. Beautiful memories.",
  },
  {
    id: "housewarming",
    name: "Housewarming",
    mark: "⌂",
    description: "Open your doors. Share your joy.",
  },
  {
    id: "anniversary",
    name: "Anniversaries",
    mark: "∞",
    description: "Celebrate your journey together.",
  },
  {
    id: "pooja",
    name: "Festivals & Poojas",
    mark: "❋",
    description: "Tradition, beautifully invited.",
  },
  {
    id: "corporate",
    name: "Corporate Events",
    mark: "↗",
    description: "Professional. Personal. Memorable.",
  },
];
