import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { clampSteps, layerBlurs, layerMask, MAX_STEPS, ProgressiveBlur } from "./progressive-blur";

const layers = (el: HTMLElement) => [...el.querySelectorAll<HTMLElement>("[data-pblur-layer]")];
const blurOf = (el: HTMLElement) =>
  el.style.backdropFilter || el.style.getPropertyValue("-webkit-backdrop-filter");

describe("layerBlurs", () => {
  it("doubles from one layer to the next, up to the strength at the edge", () => {
    expect(layerBlurs(12, 5)).toEqual([0.75, 1.5, 3, 6, 12]);
    expect(layerBlurs(16, 3)).toEqual([4, 8, 16]);
  });
  it("is just the strength for a single layer", () => {
    expect(layerBlurs(10, 1)).toEqual([10]);
  });
  it("never goes negative and falls back for a bad strength", () => {
    expect(layerBlurs(-4, 2)).toEqual([0, 0]);
    expect(layerBlurs(Number.NaN, 2)).toEqual([6, 12]);
  });
  it("is always weakest first", () => {
    const b = layerBlurs(20, 6);
    expect([...b].sort((x, y) => x - y)).toEqual(b);
  });
});

describe("clampSteps", () => {
  it("keeps the layer count between 1 and the cap, because every layer is a costly blur", () => {
    expect(clampSteps(0)).toBe(1);
    expect(clampSteps(-3)).toBe(1);
    expect(clampSteps(3.4)).toBe(3);
    expect(clampSteps(99)).toBe(MAX_STEPS);
    expect(clampSteps(Number.NaN)).toBe(5);
    expect(MAX_STEPS).toBeLessThanOrEqual(6);
  });
});

describe("layerMask", () => {
  it("runs toward the edge, and the last layer stays solid to it", () => {
    expect(layerMask("bottom", 0, 3)).toBe(
      "linear-gradient(to bottom, transparent 0%, black 25%, black 50%, transparent 75%)",
    );
    expect(layerMask("bottom", 2, 3)).toBe(
      "linear-gradient(to bottom, transparent 50%, black 75%, black 100%)",
    );
  });
  it("points the right way for every side", () => {
    expect(layerMask("top", 0, 2)).toContain("to top");
    expect(layerMask("left", 0, 2)).toContain("to left");
    expect(layerMask("right", 0, 2)).toContain("to right");
  });
  it("overlaps neighbouring bands so there is no gap between layers", () => {
    const bands = (i: number) => layerMask("bottom", i, 4).match(/(\d+(\.\d+)?)%/g);
    expect(bands(0)?.[2]).toBe("40%"); // layer 0 is still fully on here...
    expect(bands(1)?.[1]).toBe("40%"); // ...where layer 1 reaches full strength
  });
});

describe("ProgressiveBlur", () => {
  it("is decorative: hidden from assistive technology and never takes a click", () => {
    const { container } = render(<ProgressiveBlur />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.className).toContain("pointer-events-none");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("cannot be made visible to assistive technology by a prop", () => {
    const { container } = render(<ProgressiveBlur aria-hidden={false} />);
    expect((container.firstElementChild as HTMLElement).getAttribute("aria-hidden")).toBe("true");
  });

  it("renders five layers by default, weakest first, each with a blur and a mask", () => {
    const { container } = render(<ProgressiveBlur />);
    const ls = layers(container.firstElementChild as HTMLElement);
    expect(ls).toHaveLength(5);
    expect(ls.map(blurOf)).toEqual([
      "blur(0.75px)",
      "blur(1.5px)",
      "blur(3px)",
      "blur(6px)",
      "blur(12px)",
    ]);
    for (const l of ls)
      expect(l.style.maskImage || l.style.getPropertyValue("-webkit-mask-image")).toContain(
        "linear-gradient",
      );
  });

  it("follows the steps and strength props, and caps the layer count", () => {
    const { container, rerender } = render(<ProgressiveBlur steps={3} strength={8} />);
    expect(layers(container.firstElementChild as HTMLElement).map(blurOf)).toEqual([
      "blur(2px)",
      "blur(4px)",
      "blur(8px)",
    ]);
    rerender(<ProgressiveBlur steps={50} />);
    expect(layers(container.firstElementChild as HTMLElement)).toHaveLength(MAX_STEPS);
  });

  it("sits on the chosen edge, sized by height for top and bottom and width for left and right", () => {
    const { container, rerender } = render(<ProgressiveBlur side="top" size={80} />);
    let el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("top-0");
    expect(el.className).toContain("inset-x-0");
    expect(el.style.height).toBe("80px");
    rerender(<ProgressiveBlur side="right" size="4rem" />);
    el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("right-0");
    expect(el.className).toContain("inset-y-0");
    expect(el.style.width).toBe("4rem");
    expect(el.style.height).toBe("");
    expect(el.getAttribute("data-side")).toBe("right");
  });

  it("adds a fade to the page background only when asked", () => {
    const { container, rerender } = render(<ProgressiveBlur />);
    expect(container.querySelector("[data-pblur-fade]")).toBeNull();
    rerender(<ProgressiveBlur fade />);
    const fade = container.querySelector<HTMLElement>("[data-pblur-fade]");
    expect(fade?.style.background).toContain("var(--background)");
  });

  it("uses the class the item's CSS targets for its fallbacks", () => {
    const { container } = render(<ProgressiveBlur />);
    expect((container.firstElementChild as HTMLElement).className.split(" ")).toContain(
      "zuri-pblur",
    );
    for (const l of layers(container.firstElementChild as HTMLElement))
      expect(l.hasAttribute("data-pblur-layer")).toBe(true);
  });

  it("forwards ref, merges className and style, and spreads props", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <ProgressiveBlur ref={ref} className="z-10" style={{ opacity: 0.8 }} data-x="1" />,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(ref.current).toBe(el);
    expect(el.className).toContain("z-10");
    expect(el.style.opacity).toBe("0.8");
    expect(el.style.height).toBe("6rem");
    expect(el.getAttribute("data-x")).toBe("1");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div className="relative">
        <p>Content</p>
        <ProgressiveBlur fade />
        <ProgressiveBlur side="top" />
      </div>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
