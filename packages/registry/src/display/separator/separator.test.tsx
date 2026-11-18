import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Separator } from "./separator";

describe("Separator", () => {
  it("is decorative by default: not exposed as a separator", () => {
    render(<Separator />);
    expect(screen.queryByRole("separator")).toBeNull();
  });

  it("is a separator when decorative is false", () => {
    render(<Separator decorative={false} />);
    const el = screen.getByRole("separator");
    expect(el.hasAttribute("aria-orientation")).toBe(false);
  });

  it("reports vertical orientation only on a real separator", () => {
    const { rerender } = render(<Separator decorative={false} orientation="vertical" />);
    expect(screen.getByRole("separator").getAttribute("aria-orientation")).toBe("vertical");
    rerender(<Separator orientation="vertical" data-testid="d" />);
    expect(screen.getByTestId("d").hasAttribute("aria-orientation")).toBe(false);
  });

  it("uses a hairline in each orientation and lets className win", () => {
    const { rerender } = render(<Separator data-testid="s" className="bg-primary" />);
    expect(screen.getByTestId("s").className).toContain("h-px");
    expect(screen.getByTestId("s").className).toContain("bg-primary");
    expect(screen.getByTestId("s").className).not.toContain("bg-border");
    rerender(<Separator data-testid="s" orientation="vertical" />);
    expect(screen.getByTestId("s").className).toContain("w-px");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Separator />
        <Separator decorative={false} />
        <Separator decorative={false} orientation="vertical" />
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
