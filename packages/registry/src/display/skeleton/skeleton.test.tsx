import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
  it("is hidden from assistive technology", () => {
    render(<Skeleton data-testid="s" />);
    expect(screen.getByTestId("s").getAttribute("aria-hidden")).toBe("true");
  });

  it("stops pulsing under reduced motion", () => {
    render(<Skeleton data-testid="s" />);
    expect(screen.getByTestId("s").className).toContain("motion-reduce:animate-none");
  });

  it("lets className set the size and shape", () => {
    render(<Skeleton data-testid="s" className="h-4 w-32 rounded-full" />);
    const cls = screen.getByTestId("s").className;
    expect(cls).toContain("w-32");
    expect(cls).toContain("rounded-full");
    expect(cls).not.toContain("rounded-md");
  });

  it("has no axe violations inside a busy container", async () => {
    const { container } = render(
      <section aria-busy="true" aria-label="Transactions">
        <Skeleton className="h-4 w-32" />
      </section>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
