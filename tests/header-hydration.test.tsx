import { act } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import Header from "@/components/Header";
const route = vi.hoisted(() => ({ pathname: "/create" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));
it("hydrates the create header without a pathname-dependent class mismatch", async () => {
  route.pathname = "/create";
  const container = document.createElement("div");
  container.innerHTML = renderToString(<Header />);
  document.body.appendChild(container);
  expect(container.querySelector("header")).toHaveAttribute("class", "header");
  // A different initial client route must not change the editor header class.
  route.pathname = "/preview";
  const errors = vi.spyOn(console, "error").mockImplementation(() => {});
  let root: ReturnType<typeof hydrateRoot>;
  try {
    await act(async () => { root = hydrateRoot(container, <Header />); });
    expect(errors).not.toHaveBeenCalled();
    expect(container.querySelector("header")).toHaveAttribute("class", "header");
  } finally {
    await act(async () => root?.unmount());
    container.remove();
    errors.mockRestore();
  }
});
