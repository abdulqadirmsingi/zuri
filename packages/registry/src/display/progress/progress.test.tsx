import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Progress } from "./progress";

describe("Progress", () => {
  it("is a progressbar with its value and range", () => {
    render(<Progress aria-label="Upload" value={40} />);
    const el = screen.getByRole("progressbar", { name: "Upload" });
    expect(el.getAttribute("aria-valuenow")).toBe("40");
    expect(el.getAttribute("aria-valuemin")).toBe("0");
    expect(el.getAttribute("aria-valuemax")).toBe("100");
  });

  it("is indeterminate without a value: no aria-valuenow", () => {
    render(<Progress aria-label="Working" />);
    expect(screen.getByRole("progressbar").hasAttribute("aria-valuenow")).toBe(false);
  });

  it("treats NaN as indeterminate", () => {
    render(<Progress aria-label="Working" value={Number.NaN} />);
    expect(screen.getByRole("progressbar").hasAttribute("aria-valuenow")).toBe(false);
  });

  it("clamps out-of-range values", () => {
    const { rerender } = render(<Progress aria-label="P" value={150} />);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("100");
    rerender(<Progress aria-label="P" value={-5} />);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("0");
  });

  it("supports a custom max", () => {
    render(<Progress aria-label="Steps" value={2} max={4} />);
    const el = screen.getByRole("progressbar");
    expect(el.getAttribute("aria-valuemax")).toBe("4");
    expect((el.firstElementChild as HTMLElement).style.getPropertyValue("--zuri-progress")).toBe(
      "0.5",
    );
  });

  it("pulses when indeterminate and is full width", () => {
    render(<Progress aria-label="Working" />);
    const bar = screen.getByRole("progressbar").firstElementChild as HTMLElement;
    expect(bar.className).toContain("animate-pulse");
    expect(bar.style.getPropertyValue("--zuri-progress")).toBe("1");
  });

  it("forwards ref, spreads props and lets className win", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Progress ref={ref} aria-label="P" value={1} className="h-4" data-x="1" />);
    expect(ref.current?.className).toContain("h-4");
    expect(ref.current?.className).not.toContain("h-2");
    expect(ref.current?.getAttribute("data-x")).toBe("1");
  });

  it("has no axe violations (determinate and indeterminate)", async () => {
    const { container } = render(
      <>
        <Progress aria-label="A" value={30} />
        <Progress aria-label="B" />
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
