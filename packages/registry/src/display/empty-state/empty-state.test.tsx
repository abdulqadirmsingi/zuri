import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders a heading, description and action", () => {
    render(
      <EmptyState
        title="No transactions yet"
        description="Payments you receive will show up here."
        action={<button type="button">Request payment</button>}
      />,
    );
    expect(screen.getByRole("heading", { name: "No transactions yet", level: 3 })).toBeTruthy();
    expect(screen.getByText("Payments you receive will show up here.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Request payment" })).toBeTruthy();
  });

  it("supports another heading level", () => {
    render(<EmptyState title="Nothing" headingLevel={2} />);
    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy();
  });

  it("hides the icon from assistive technology", () => {
    render(<EmptyState title="Nothing" icon={<svg data-testid="i" />} />);
    expect(screen.getByTestId("i").parentElement?.getAttribute("aria-hidden")).toBe("true");
  });

  it("omits optional parts when not given", () => {
    const { container } = render(<EmptyState title="Nothing" />);
    expect(container.querySelector("p")).toBeNull();
    expect(container.querySelectorAll("div")).toHaveLength(1);
  });

  it("spreads props and lets className win", () => {
    render(<EmptyState title="Nothing" data-testid="e" className="p-2" />);
    const el = screen.getByTestId("e");
    expect(el.className).toContain("p-2");
    expect(el.className).not.toContain("p-8");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <EmptyState
        title="Nothing"
        description="Try later"
        icon={<svg />}
        action={<a href="/x">Go</a>}
      />,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
