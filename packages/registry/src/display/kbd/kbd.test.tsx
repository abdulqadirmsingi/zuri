import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Kbd } from "./kbd";

describe("Kbd", () => {
  it("renders a native kbd element", () => {
    render(<Kbd>Esc</Kbd>);
    expect(screen.getByText("Esc").tagName).toBe("KBD");
  });

  it("forwards ref, spreads props and lets className win", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Kbd ref={ref} data-x="1" className="font-sans">
        K
      </Kbd>,
    );
    expect(ref.current).toBe(screen.getByText("K"));
    expect(ref.current?.getAttribute("data-x")).toBe("1");
    expect(ref.current?.className).toContain("font-sans");
    expect(ref.current?.className).not.toContain("font-mono");
  });

  it("meets the 24px minimum size", () => {
    render(<Kbd>K</Kbd>);
    const cls = screen.getByText("K").className;
    expect(cls).toContain("min-h-6");
    expect(cls).toContain("min-w-6");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <p>
        Press <Kbd>⌘</Kbd> <Kbd>K</Kbd>
      </p>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
