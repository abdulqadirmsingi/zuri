import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

describe("Card", () => {
  it("renders composed parts with the title as a heading", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Balance</CardTitle>
          <CardDescription>Updated now</CardDescription>
        </CardHeader>
        <CardContent>TZS 12,000</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByRole("heading", { name: "Balance", level: 3 })).toBeTruthy();
    expect(screen.getByText("Updated now")).toBeTruthy();
  });

  it("lets the title use another heading level", () => {
    render(<CardTitle as="h2">Plans</CardTitle>);
    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy();
  });

  it("applies variants and lets className win", () => {
    render(
      <Card data-testid="c" variant="outline" className="p-2">
        x
      </Card>,
    );
    const cls = screen.getByTestId("c").className;
    expect(cls).toContain("border-control-border");
    expect(cls).toContain("p-2");
    expect(cls).not.toContain("p-6");
  });

  it("forwards ref and spreads props", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Card ref={ref} data-x="1">
        x
      </Card>,
    );
    expect(ref.current?.getAttribute("data-x")).toBe("1");
  });

  it("has no axe violations in any variant", async () => {
    const { container } = render(
      (["default", "outline", "glass"] as const).map((v) => (
        <Card key={v} variant={v}>
          <CardHeader>
            <CardTitle>{v}</CardTitle>
          </CardHeader>
        </Card>
      )),
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
