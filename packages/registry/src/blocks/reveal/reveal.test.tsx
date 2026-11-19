import { act, render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Reveal } from "./reveal";

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;
let callback: Callback = () => {};
const disconnect = vi.fn();

function setup({ reduced = false, top = 2000 }: { reduced?: boolean; top?: number } = {}) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches: reduced, addEventListener() {}, removeEventListener() {} }),
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: Callback) {
        callback = cb;
      }
      observe() {}
      disconnect = disconnect;
    },
  );
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    top,
    bottom: top + 100,
  } as DOMRect);
}

beforeEach(() => disconnect.mockClear());
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Reveal", () => {
  it("renders its content visible on the server, before any script runs", () => {
    const html = renderToString(<Reveal>Hello</Reveal>);
    expect(html).toContain("Hello");
    expect(html).not.toContain("opacity-0");
    expect(html).toContain('data-reveal="visible"');
  });
  it("hides content that starts below the fold, then shows it on intersect", () => {
    setup({ top: 2000 });
    const { container } = render(<Reveal>Hello</Reveal>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute("data-reveal")).toBe("hidden");
    expect(el.className).toContain("opacity-0");
    act(() => callback([{ isIntersecting: true }]));
    expect(el.getAttribute("data-reveal")).toBe("visible");
    expect(el.className).not.toContain("opacity-0");
  });
  it("never hides content that is already on screen", () => {
    setup({ top: 100 });
    const { container } = render(<Reveal>Hello</Reveal>);
    expect(container.firstElementChild?.getAttribute("data-reveal")).toBe("visible");
  });
  it("does nothing under reduced motion", () => {
    setup({ reduced: true });
    const { container } = render(<Reveal>Hello</Reveal>);
    expect(container.firstElementChild?.getAttribute("data-reveal")).toBe("visible");
  });
  it("stops observing after the first reveal when once is true", () => {
    setup();
    render(<Reveal>Hello</Reveal>);
    act(() => callback([{ isIntersecting: true }]));
    expect(disconnect).toHaveBeenCalled();
  });
  it("hides again when it leaves the view and once is false", () => {
    setup();
    const { container } = render(<Reveal once={false}>Hello</Reveal>);
    const el = container.firstElementChild as HTMLElement;
    act(() => callback([{ isIntersecting: true }]));
    act(() => callback([{ isIntersecting: false }]));
    expect(el.getAttribute("data-reveal")).toBe("hidden");
  });
  it("uses the direction and delay", () => {
    setup();
    const { container } = render(
      <Reveal from="fade" delay={120}>
        Hello
      </Reveal>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("opacity-0");
    expect(el.className).not.toContain("translate-y-6");
    act(() => callback([{ isIntersecting: true }]));
    expect(el.style.transitionDelay).toBe("120ms");
  });
  it("renders another element and spreads props", () => {
    setup();
    const { container } = render(
      <Reveal as="li" className="extra" data-x="1">
        Hello
      </Reveal>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("LI");
    expect(el.className).toContain("extra");
    expect(el.getAttribute("data-x")).toBe("1");
  });
  it("works when IntersectionObserver is missing", () => {
    setup();
    vi.stubGlobal("IntersectionObserver", undefined);
    const { container } = render(<Reveal>Hello</Reveal>);
    expect(container.firstElementChild?.getAttribute("data-reveal")).toBe("visible");
  });
});
