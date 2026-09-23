import type { Invitation, Template } from "@/types/invitation";

export interface TemplatePalette {
  background: string;
  ink: string;
  surface: string;
  name: string;
}
export const templatePalettes: Record<string, TemplatePalette> = {
  "royal-garden": {
    background: "#eedbb6",
    ink: "#68451f",
    surface: "#faf1db",
    name: "Champagne & bronze",
  },
  "emerald-vows": {
    background: "#194c3c",
    ink: "#f3eccb",
    surface: "#e0ebde",
    name: "Emerald & ivory",
  },
  "rose-promise": {
    background: "#f0cfca",
    ink: "#803f47",
    surface: "#fae9e3",
    name: "Blush & burgundy",
  },
  "golden-hour": {
    background: "#232b35",
    ink: "#e3ef90",
    surface: "#e1e6da",
    name: "Midnight & lime",
  },
  "little-moon": {
    background: "#e8def5",
    ink: "#665080",
    surface: "#f4edfb",
    name: "Lavender & cream",
  },
  "open-doors": {
    background: "#d4e7ec",
    ink: "#315970",
    surface: "#ecf6f6",
    name: "Powder blue & slate",
  },
  "always-us": {
    background: "#9e4c3d",
    ink: "#fff0cc",
    surface: "#f3dfcf",
    name: "Terracotta & vanilla",
  },
  "sacred-light": {
    background: "#f3cb83",
    ink: "#843c21",
    surface: "#fbefd5",
    name: "Saffron & copper",
  },
  "after-hours": {
    background: "#252842",
    ink: "#c9c5ff",
    surface: "#e9e8f4",
    name: "Indigo & lilac",
  },
  "ivory-sonnet": {
    background: "#f5eee1",
    ink: "#333f37",
    surface: "#e7e9db",
    name: "Pearl & olive",
  },
  "confetti-club": {
    background: "#553167",
    ink: "#ffdeeb",
    surface: "#eddfef",
    name: "Plum & candy pink",
  },
  "moonlit-yes": {
    background: "#162f4c",
    ink: "#e8cf93",
    surface: "#e1e8ee",
    name: "Navy & starlight",
  },
  "birthday-bloom": {
    background: "#f4db92",
    ink: "#8b512f",
    surface: "#fff2cb",
    name: "Butter yellow & cinnamon",
  },
  "engagement-sonnet": {
    background: "#ead4dc",
    ink: "#774359",
    surface: "#f6e9ed",
    name: "Dusty rose & mulberry",
  },
  "baby-starlight": {
    background: "#374366",
    ink: "#f8e7c6",
    surface: "#e4e8f3",
    name: "Twilight & moonbeam",
  },
  "baby-garden": {
    background: "#dceacc",
    ink: "#506747",
    surface: "#eff5e5",
    name: "Pistachio & sage",
  },
  "home-garden": {
    background: "#386459",
    ink: "#f1e3b5",
    surface: "#dceae1",
    name: "Eucalyptus & oat",
  },
  "home-gazette": {
    background: "#ecd8b9",
    ink: "#735039",
    surface: "#f9efdf",
    name: "Sand & walnut",
  },
  "anniversary-palace": {
    background: "#76583e",
    ink: "#f6dda0",
    surface: "#ece0cf",
    name: "Mocha & gold",
  },
  "anniversary-stars": {
    background: "#49334e",
    ink: "#ead6b4",
    surface: "#eadee9",
    name: "Aubergine & champagne",
  },
  "festival-palace": {
    background: "#ecb699",
    ink: "#7e382d",
    surface: "#f9e4d3",
    name: "Apricot & vermilion",
  },
  "pooja-botanical": {
    background: "#56653c",
    ink: "#fff0c6",
    surface: "#e9edda",
    name: "Sacred olive & jasmine",
  },
  "corporate-pass": {
    background: "#163f49",
    ink: "#adede3",
    surface: "#daebeb",
    name: "Petrol & mint",
  },
  "corporate-editorial": {
    background: "#e0e6ec",
    ink: "#364b66",
    surface: "#f0f3f8",
    name: "Silver & steel blue",
  },
};
const themes: Record<Invitation["theme"], TemplatePalette> = {
  ivory: {
    background: "#f5ead3",
    ink: "#614b32",
    surface: "#faf4e8",
    name: "Ivory",
  },
  forest: {
    background: "#234c3a",
    ink: "#ece8ca",
    surface: "#e5ecde",
    name: "Forest",
  },
  rose: {
    background: "#efd3d7",
    ink: "#79404d",
    surface: "#fae9eb",
    name: "Rose",
  },
  midnight: {
    background: "#25283e",
    ink: "#e5dcbd",
    surface: "#e5e6ee",
    name: "Midnight",
  },
};
export function paletteForTemplate(
  template: Template,
  value?: Invitation,
): TemplatePalette {
  if (
    value?.palette &&
    value.palette !== "original" &&
    colourOptions[value.palette]
  )
    return colourOptions[value.palette];
  const palette =
    value && value.theme !== template.theme
      ? themes[value.theme]
      : (templatePalettes[template.id] ?? themes[template.theme]);
  return palette;
}
export const colourOptions: Record<string, TemplatePalette> = {
  sage: {
    background: "#dceacc",
    ink: "#506747",
    surface: "#eff5e5",
    name: "Sage",
  },
  lavender: {
    background: "#e8def5",
    ink: "#665080",
    surface: "#f4edfb",
    name: "Lavender",
  },
  blush: {
    background: "#f0cfca",
    ink: "#803f47",
    surface: "#fae9e3",
    name: "Blush",
  },
  sand: {
    background: "#f5ead3",
    ink: "#614b32",
    surface: "#faf4e8",
    name: "Sand",
  },
  midnight: {
    background: "#25283e",
    ink: "#e5dcbd",
    surface: "#e5e6ee",
    name: "Midnight",
  },
};
