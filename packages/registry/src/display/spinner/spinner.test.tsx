import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Spinner } from "./spinner";

describe("Spinner", () => {
  it("is a status with a default accessible name", () => {
    render(<Spinner />);
    expect(screen.getByRole("status").textContent).toBe("Loading");
  });

  it("uses a custom label", () => {
    render(<Spinner label="Loading balance" />);
    expect(screen.getByRole("status").textContent).toBe("Loading balance");
  });

  it("hides the graphic from assistive technology", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("pulses instead of spinning under reduced motion", () => {
    const { container } = render(<Spinner />);
    const cls = container.querySelector("svg")?.getAttribute("class") ?? "";
    expect(cls).toContain("animate-spin");
    expect(cls).toContain("motion-reduce:animate-pulse");
  });

  it("applies size, spreads props and lets className win", () => {
    render(<Spinner size="lg" className="size-12" data-x="1" />);
    const el = screen.getByRole("status");
    expect(el.className).toContain("size-12");
    expect(el.className).not.toContain("size-10");
    expect(el.getAttribute("data-x")).toBe("1");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Spinner />);
    expect((await axe(container)).violations).toEqual([]);
  });
});
