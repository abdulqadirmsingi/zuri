import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders its text in a span", () => {
    render(<Badge>Pending</Badge>);
    expect(screen.getByText("Pending").tagName).toBe("SPAN");
  });

  it("applies variant classes and lets className win", () => {
    render(
      <Badge variant="danger" className="px-4">
        Failed
      </Badge>,
    );
    const el = screen.getByText("Failed");
    expect(el.className).toContain("text-danger");
    expect(el.className).toContain("px-4");
    expect(el.className).not.toContain("px-2.5");
  });

  it("forwards ref and spreads props", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Badge ref={ref} data-x="1">
        New
      </Badge>,
    );
    expect(ref.current).toBe(screen.getByText("New"));
    expect(ref.current?.getAttribute("data-x")).toBe("1");
  });

  it("has no axe violations in any variant", async () => {
    const { container } = render(
      (["default", "secondary", "outline", "success", "warning", "danger", "glass"] as const).map(
        (v) => (
          <Badge key={v} variant={v}>
            {v}
          </Badge>
        ),
      ),
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
