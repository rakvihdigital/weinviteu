import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import GalleryTemplatePreview from "@/components/GalleryTemplatePreview";
import { templates } from "@/data/templates";
import { invitationForTemplate } from "@/data/demoInvitation";
import { paletteForTemplate, templatePalettes } from "@/data/templatePalettes";

describe("template colours and editor preview", () => {
  it("provides a distinct palette for each current template", () => {
    expect(new Set(templates.map(t => templatePalettes[t.id].background)).size).toBe(templates.length);
    for (const template of templates) {
      const value = invitationForTemplate(template);
      expect(paletteForTemplate(template, value)).toEqual(paletteForTemplate(template));
      const html = renderToStaticMarkup(<GalleryTemplatePreview template={template} value={value} />);
      expect(html).toContain(`--preview-bg:${templatePalettes[template.id].background}`);
      expect(html).toContain(`data-template-id="${template.id}"`);
    }
  });
  it("renders edited names, venue, font and accent, and honours a changed theme", () => {
    const template = templates.find(t=>t.id === "little-moon")!;
    const value = { ...invitationForTemplate(template), names:"Welcome baby Maya", venue:"Garden Hall", theme:"midnight" as const, font:"modern" as const, accent:"#123456" };
    const html = renderToStaticMarkup(<GalleryTemplatePreview template={template} value={value} />);
    expect(html).toContain("Welcome baby Maya");
    expect(html).toContain("Garden Hall");
    expect(html).toContain("--preview-accent:#123456");
    expect(html).toContain("font-family:Arial");
    expect(paletteForTemplate(template, value).background).not.toBe(templatePalettes[template.id].background);
  });
});
