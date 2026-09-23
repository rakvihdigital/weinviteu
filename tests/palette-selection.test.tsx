import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { templates } from "@/data/templates";
import DesignDetailContent from "@/components/DesignDetailContent";
import { decodeInvitation, encodeInvitation } from "@/lib/share";
import { invitationForTemplate } from "@/data/demoInvitation";
import { paletteForTemplate } from "@/data/templatePalettes";

describe("clickable template palettes", () => {
 it("updates the design and passes the chosen palette to editor and guest links", () => {
  const template = templates.find(t=>t.id === "baby-garden")!;
  render(<DesignDetailContent template={template} related={[]} />);
  fireEvent.click(screen.getByRole("button", {name:"Lavender palette"}));
  expect(screen.getByRole("button", {name:"Lavender palette"})).toHaveAttribute("aria-pressed","true");
  const create = screen.getByRole("link", {name:"Personalize this design"}).getAttribute("href")!;
  expect(create).toContain("/create?template=baby-garden#");
  expect(decodeInvitation(create.split("#")[1])).toMatchObject({templateId:"baby-garden",palette:"lavender"});
  const demo = screen.getByRole("link", {name:"View guest demo"}).getAttribute("href")!;
  expect(decodeInvitation(demo.split("#")[1]).palette).toBe("lavender");
  fireEvent.click(screen.getByRole("button",{name:"Original palette"}));
  expect(screen.getByRole("link",{name:"Personalize this design"})).toHaveAttribute("href","/create?template=baby-garden");
 });
 it("preserves the palette when an edited invitation is exported and restored",()=>{
  const template=templates.find(t=>t.id === "baby-garden")!;
  const value={...invitationForTemplate(template),palette:"blush" as const};
  const restored=decodeInvitation(encodeInvitation(value));
  expect(paletteForTemplate(template,restored).name).toBe("Blush");
 });
});
