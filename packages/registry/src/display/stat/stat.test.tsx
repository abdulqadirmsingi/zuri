import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Stat } from "./stat";

describe("Stat", () => {
  it("is a description list with label and value", () => {
    const { container } = render(<Stat label="Revenue" value="TZS 1,200,000" />);
    expect(container.querySelector("dl")).toBeTruthy();
    expect(screen.getByText("Revenue").tagName).toBe("DT");
    expect(screen.getByText("TZS 1,200,000").tagName).toBe("DD");
  });

  it("omits the change row when there is no change", () => {
    const { container } = render(<Stat label="Revenue" value="1" />);
    expect(container.querySelectorAll("dd")).toHaveLength(1);
  });

  it("says increase, decrease or no change in words, not only colour", () => {
    const { container, rerender } = render(<Stat label="R" value="1" change="12%" trend="up" />);
    expect(container.textContent).toContain("Increase of 12%");
    rerender(<Stat label="R" value="1" change="3%" trend="down" />);
    expect(container.textContent).toContain("Decrease of 3%");
    rerender(<Stat label="R" value="1" change="0%" />);
    expect(container.textContent).toContain("No change: 0%");
  });

  it("hides the arrow and shows change context", () => {
    const { container } = render(
      <Stat label="R" value="1" change="12%" trend="up" changeLabel="vs last month" />,
    );
    expect(container.querySelector('[aria-hidden="true"]')?.textContent).toBe("↑");
    expect(screen.getByText("vs last month")).toBeTruthy();
  });

  it("spreads props and lets className win", () => {
    render(<Stat label="R" value="1" data-testid="s" className="gap-4" />);
    const el = screen.getByTestId("s");
    expect(el.className).toContain("gap-4");
    expect(el.className).not.toContain("gap-1 ");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Stat label="R" value="1" change="1%" trend="up" changeLabel="x" />,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
