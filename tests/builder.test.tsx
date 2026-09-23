import { render, screen, fireEvent } from "@testing-library/react";
import { it, expect, vi } from "vitest";
import Builder from "@/components/Builder";
import { templates } from "@/data/templates";
import { decodeInvitation } from "@/lib/share";
const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
it("previews the selected 3D entrance and carries soundtrack settings into the full preview", () => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  render(<Builder template={templates[0]} />);
  fireEvent.click(screen.getByRole("tab", { name: "Style" }));
  fireEvent.change(screen.getByLabelText("3D opening experience"), {
    target: { value: "celestial" },
  });
  expect(screen.getByLabelText("Preview type")).toHaveValue("3d");
  expect(
    screen.getByRole("img", {
      name: "celestial three-dimensional invitation gates",
    }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Try opening gates" }));
  expect(
    screen.getByRole("button", { name: "Close gates" }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("tab", { name: "Extras" }));
  fireEvent.change(screen.getByLabelText("Music", { exact: true }), {
    target: { value: "ambient" },
  });
  fireEvent.change(screen.getByLabelText(/Starting volume/), {
    target: { value: "0.3" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Full preview" }));
  const route = push.mock.calls.at(-1)?.[0] as string;
  expect(route.startsWith("/preview#")).toBe(true);
  expect(decodeInvitation(route.split("#")[1])).toMatchObject({
    entrance: "celestial",
    music: "ambient",
    musicVolume: 0.3,
  });
});
