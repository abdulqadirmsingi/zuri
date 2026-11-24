import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { LandingStarter } from "./landing-starter";

describe("LandingStarter", () => {
  it("has the page landmarks: banner, main and contentinfo", () => {
    render(<LandingStarter />);
    expect(screen.getByRole("banner")).toBeTruthy();
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.getByRole("contentinfo")).toBeTruthy();
  });
  it("has exactly one h1 and no skipped heading levels", () => {
    const { container } = render(<LandingStarter />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    let last = 0;
    for (const h of container.querySelectorAll("h1,h2,h3,h4")) {
      const level = Number(h.tagName[1]);
      expect(level, h.textContent ?? "").toBeLessThanOrEqual(last + 1);
      last = level;
    }
  });
  it("only links to anchors that exist on the page", () => {
    const { container } = render(<LandingStarter />);
    const ids = new Set([...container.querySelectorAll("[id]")].map((e) => e.id));
    for (const a of container.querySelectorAll<HTMLAnchorElement>("a[href^='#']")) {
      expect(ids.has(a.getAttribute("href")?.slice(1) ?? ""), a.getAttribute("href") ?? "").toBe(
        true,
      );
    }
  });
  it("names each section by its own heading", () => {
    render(<LandingStarter />);
    expect(screen.getByRole("region", { name: "Everything you need to get going" })).toBeTruthy();
    expect(
      screen.getByRole("region", { name: "From first message to first project" }),
    ).toBeTruthy();
  });
  it("lists the partners once for assistive tech (the repeat is hidden)", () => {
    render(<LandingStarter />);
    const partners = screen.getByRole("region", { name: /trusted by/i });
    expect(within(partners).getAllByRole("listitem")).toHaveLength(6);
  });
  it("has no axe violations", async () => {
    const { container } = render(<LandingStarter />);
    expect((await axe(container)).violations).toEqual([]);
  });
});
