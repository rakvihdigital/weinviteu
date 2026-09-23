import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import InvitationCard from "@/components/InvitationCard";
import Builder from "@/components/Builder";
import TemplateGallery from "@/components/TemplateGallery";
import { templates } from "@/data/templates";
import { getDesign, designKeys } from "@/data/designs";
import { invitationForTemplate } from "@/data/demoInvitation";
import { decodeInvitation } from "@/lib/share";
const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
describe("V3 distinct templates", () => {
  it("renders all twelve compositions with the entered names and venue", () => {
    expect(new Set(templates.map((t) => t.design)).size).toBe(12);
    const faces = new Set<string>();
    for (const template of templates) {
      const value = {
        ...invitationForTemplate(template),
        names: "Maya & Dev",
        venue: "The Celebration House",
      };
      const html = renderToStaticMarkup(<InvitationCard value={value} />);
      expect(html).toContain(`data-design="${template.design}"`);
      expect(html).toContain("Maya &amp; Dev");
      expect(html).toContain("The Celebration House");
      const signature = html.match(/class="design-face ([^"]+)/)?.[1];
      expect(signature).toBeTruthy();
      faces.add(signature!);
    }
    expect(faces.size).toBe(designKeys.length);
  });
  it("maps earlier links without a design field to the right new composition", () => {
    for (const template of templates) {
      const value = { ...invitationForTemplate(template), design: undefined };
      expect(getDesign(value)).toBe(template.design);
    }
  });
  it("switches template design without losing event content or the soundtrack", () => {
    const original = {
      ...invitationForTemplate(templates[0]),
      names: "Meera & Vikram",
      date: "2028-04-19",
      story: "Our own story, kept when changing the design.",
      music: "bells" as const,
    };
    render(<Builder template={templates[0]} restored={original} />);
    fireEvent.click(screen.getByRole("tab", { name: "Style" }));
    fireEvent.change(screen.getByLabelText("Invitation design"), {
      target: { value: "rose-promise" },
    });
    expect(
      screen.getByRole("heading", { name: "Meera & Vikram" }),
    ).toBeInTheDocument();
    expect(document.querySelector(".design-card")).toHaveAttribute(
      "data-design",
      "gazette",
    );
    fireEvent.click(screen.getByRole("button", { name: "Full preview" }));
    const route = push.mock.calls.at(-1)?.[0] as string;
    expect(decodeInvitation(route.split("#")[1])).toMatchObject({
      templateId: "rose-promise",
      design: "gazette",
      names: original.names,
      date: original.date,
      story: original.story,
      music: "bells",
    });
  });
  it("filters the redesigned collection and links to matching guest experiences", () => {
    render(<TemplateGallery templates={templates} />);
    fireEvent.click(screen.getByRole("button", { name: "Birthdays" }));
    expect(
      screen.getByRole("heading", { name: "Midnight Pass" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Disco After Dark" }),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: "Search designs" }), {
      target: { value: "Disco" },
    });
    expect(screen.queryByRole("heading", { name: "Midnight Pass" })).toBeNull();
    expect(
      screen.getByRole("link", { name: "View live invitation ↗" }),
    ).toHaveAttribute("href", "/invite/confetti-club");
    cleanup();
  });
});
