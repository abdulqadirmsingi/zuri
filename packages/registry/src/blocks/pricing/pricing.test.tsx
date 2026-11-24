import { render, screen, within } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Pricing, type PricingPlan } from "./pricing";

const plans: PricingPlan[] = [
  {
    id: "a",
    name: "Plan A",
    price: "Free",
    features: ["One", "Two"],
    action: <a href="/a">Go A</a>,
  },
  { id: "b", name: "Plan B", price: "Soon", featured: true, badge: "Example" },
];

describe("Pricing", () => {
  it("shows each plan as an article named by its heading", () => {
    render(<Pricing plans={plans} />);
    expect(screen.getByRole("article", { name: "Plan A" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 3, name: "Plan B" })).toBeTruthy();
  });
  it("shows the price exactly as given, and never adds one", () => {
    render(<Pricing plans={plans} />);
    expect(screen.getByText("Free")).toBeTruthy();
    expect(screen.getByText("Soon")).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/[$€£]|TZS|USD/);
  });
  it("lists features and renders the caller's action", () => {
    render(<Pricing plans={plans} />);
    const card = screen.getByRole("article", { name: "Plan A" });
    expect(within(card).getAllByRole("listitem")).toHaveLength(2);
    expect(within(card).getByRole("link", { name: "Go A" })).toBeTruthy();
  });
  it("fills only the featured plan, with its own foreground", () => {
    render(<Pricing plans={plans} />);
    const featured = screen.getByRole("article", { name: "Plan B" }).parentElement as HTMLElement;
    expect(featured.className).toContain("bg-primary");
    expect(featured.className).toContain("text-primary-foreground");
    expect(
      (screen.getByRole("article", { name: "Plan A" }).parentElement as HTMLElement).className,
    ).not.toContain("bg-primary");
  });
  it("honours headingLevel and forwards the ref", () => {
    const ref = createRef<HTMLUListElement>();
    render(<Pricing ref={ref} plans={plans} headingLevel={4} className="extra" />);
    expect(screen.getAllByRole("heading", { level: 4 })).toHaveLength(2);
    expect(ref.current?.className).toContain("extra");
  });
  it("has no axe violations", async () => {
    const { container } = render(<Pricing plans={plans} />);
    expect((await axe(container)).violations).toEqual([]);
  });
});
