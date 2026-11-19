import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ThemeSwitch } from "./theme-switch";

// The DOM typings already declare startViewTransition, so tests reach it through a loose view.
type Doc = { startViewTransition?: unknown };
const doc = () => document as unknown as Doc;

/** A stand-in for the View Transitions API, which jsdom does not have. */
function mockViewTransitions(opts: { finished?: Promise<unknown>; ready?: Promise<unknown> } = {}) {
  let update: () => void = () => {};
  const start = vi.fn((cb: () => void) => {
    update = cb;
    return { ready: opts.ready ?? Promise.resolve(), finished: opts.finished ?? Promise.resolve() };
  });
  doc().startViewTransition = start;
  const animate = vi.fn();
  document.documentElement.animate = animate as unknown as typeof document.documentElement.animate;
  return { start, animate, runUpdate: () => update() };
}

function stubReducedMotion(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
      matches: reduced,
      media: query,
      addEventListener() {},
      removeEventListener() {},
    }),
  });
}

describe("ThemeSwitch", () => {
  afterEach(() => {
    delete doc().startViewTransition;
    delete (window as { matchMedia?: unknown }).matchMedia;
    // biome-ignore lint/suspicious/noExplicitAny: removing the mocked method restores jsdom's lack of it.
    delete (document.documentElement as any).animate;
    for (const el of document.head.querySelectorAll("style")) el.remove();
  });

  it("is an icon-only toggle named by its label, not pressed in light mode", () => {
    render(<ThemeSwitch />);
    const button = screen.getByRole("button", { name: "Dark mode" });
    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(button.getAttribute("type")).toBe("button");
    expect(button.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
  });

  it("is pressed in dark mode, and the name does not change between states", async () => {
    render(<ThemeSwitch defaultTheme="dark" />);
    const button = screen.getByRole("button", { name: "Dark mode" });
    expect(button.getAttribute("aria-pressed")).toBe("true");
    await userEvent.click(button);
    expect(screen.getByRole("button", { name: "Dark mode" }).getAttribute("aria-pressed")).toBe(
      "false",
    );
  });

  it("takes its name from visible text when the label is shown, with no aria-label", () => {
    render(<ThemeSwitch showLabel label="Night mode" />);
    const button = screen.getByRole("button", { name: "Night mode" });
    expect(button.hasAttribute("aria-label")).toBe(false);
    expect(button.textContent).toContain("Night mode");
  });

  it("toggles when uncontrolled and reports the theme to switch to", async () => {
    const onThemeChange = vi.fn();
    render(<ThemeSwitch onThemeChange={onThemeChange} />);
    const button = screen.getByRole("button", { name: "Dark mode" });
    await userEvent.click(button);
    expect(onThemeChange).toHaveBeenLastCalledWith("dark");
    expect(button.getAttribute("aria-pressed")).toBe("true");
    await userEvent.click(button);
    expect(onThemeChange).toHaveBeenLastCalledWith("light");
    expect(button.getAttribute("aria-pressed")).toBe("false");
  });

  it("works controlled: it changes only when the parent does", async () => {
    const onThemeChange = vi.fn();
    const { rerender } = render(<ThemeSwitch theme="light" onThemeChange={onThemeChange} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onThemeChange).toHaveBeenCalledWith("dark");
    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("false");
    rerender(<ThemeSwitch theme="dark" onThemeChange={onThemeChange} />);
    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("true");
  });

  it("switches at once when the browser has no View Transitions API", async () => {
    const onThemeChange = vi.fn();
    render(<ThemeSwitch onThemeChange={onThemeChange} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onThemeChange).toHaveBeenCalledOnce();
  });

  it("applies the theme inside the view transition's update, not before it", async () => {
    const { start, runUpdate } = mockViewTransitions();
    const onThemeChange = vi.fn();
    render(<ThemeSwitch onThemeChange={onThemeChange} />);
    await userEvent.click(screen.getByRole("button"));
    expect(start).toHaveBeenCalledOnce();
    expect(onThemeChange).not.toHaveBeenCalled();
    act(() => runUpdate());
    expect(onThemeChange).toHaveBeenCalledWith("dark");
  });

  it("spreads a circle from the button, over the chosen duration", async () => {
    const { animate } = mockViewTransitions();
    render(<ThemeSwitch transition="circle" duration={640} />);
    await userEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(animate).toHaveBeenCalledOnce());
    const [keyframes, options] = animate.mock.calls[0] as [
      { clipPath: string[] },
      KeyframeAnimationOptions,
    ];
    expect(keyframes.clipPath[0]).toMatch(/^circle\(0px at /);
    expect(keyframes.clipPath[1]).toMatch(/^circle\(\d+(\.\d+)?px at /);
    expect(options.duration).toBe(640);
    expect(options.pseudoElement).toBe("::view-transition-new(root)");
  });

  it("sweeps down from the top for a wipe", async () => {
    const { animate } = mockViewTransitions();
    render(<ThemeSwitch transition="wipe" />);
    await userEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(animate).toHaveBeenCalledOnce());
    const [keyframes] = animate.mock.calls[0] as [{ clipPath: string[] }];
    expect(keyframes.clipPath).toEqual(["inset(0 0 100% 0)", "inset(0 0 0 0)"]);
  });

  it("leaves the browser's own cross-fade alone for a fade", async () => {
    const { start, animate } = mockViewTransitions();
    render(<ThemeSwitch transition="fade" />);
    await userEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(start).toHaveBeenCalledOnce());
    expect(animate).not.toHaveBeenCalled();
  });

  it("does not use a view transition for transition=none", async () => {
    const { start } = mockViewTransitions();
    const onThemeChange = vi.fn();
    render(<ThemeSwitch transition="none" onThemeChange={onThemeChange} />);
    await userEvent.click(screen.getByRole("button"));
    expect(start).not.toHaveBeenCalled();
    expect(onThemeChange).toHaveBeenCalledWith("dark");
  });

  it("does not animate the page for people who ask for reduced motion", async () => {
    stubReducedMotion(true);
    const { start } = mockViewTransitions();
    const onThemeChange = vi.fn();
    render(<ThemeSwitch onThemeChange={onThemeChange} />);
    await userEvent.click(screen.getByRole("button"));
    expect(start).not.toHaveBeenCalled();
    expect(onThemeChange).toHaveBeenCalledWith("dark");
  });

  it("switches off the browser's cross-fade during a circle, and cleans up after", async () => {
    mockViewTransitions();
    render(<ThemeSwitch />);
    await userEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(document.head.querySelectorAll("style")).toHaveLength(0));
  });

  it("holds the style rule while the transition runs", async () => {
    let finish: () => void = () => {};
    mockViewTransitions({ finished: new Promise<void>((resolve) => (finish = resolve)) });
    render(<ThemeSwitch />);
    await userEvent.click(screen.getByRole("button"));
    expect(document.head.querySelector("style")?.textContent).toContain(
      "::view-transition-new(root)",
    );
    await act(async () => finish());
    await waitFor(() => expect(document.head.querySelectorAll("style")).toHaveLength(0));
  });

  it("ignores clicks while a transition is still running", async () => {
    let finish: () => void = () => {};
    const { start } = mockViewTransitions({
      finished: new Promise<void>((resolve) => (finish = resolve)),
    });
    render(<ThemeSwitch />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    await userEvent.click(button);
    expect(start).toHaveBeenCalledOnce();
    await act(async () => finish());
    await waitFor(() => expect(document.head.querySelectorAll("style")).toHaveLength(0));
    await userEvent.click(button);
    expect(start).toHaveBeenCalledTimes(2);
  });

  it("recovers when a transition is skipped: the style is removed and clicks work again", async () => {
    const skipped = Promise.reject(new Error("skipped"));
    // Mark it handled now (it stays rejected), or Node reports it before the component awaits it.
    skipped.catch(() => {});
    const { start } = mockViewTransitions({ ready: skipped });
    render(<ThemeSwitch />);
    await userEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(document.head.querySelectorAll("style")).toHaveLength(0));
    await userEvent.click(screen.getByRole("button"));
    expect(start).toHaveBeenCalledTimes(2);
  });

  // Regression guard for the "icon spins when a saved theme arrives after load" problem.
  it("only animates the icon after the person has used the switch", async () => {
    const { container, rerender } = render(<ThemeSwitch theme="light" />);
    const icons = () => [...container.querySelectorAll("button > span > span")] as HTMLElement[];
    expect(icons().every((i) => i.className.split(" ").includes("transition-none"))).toBe(true);
    // A theme that arrives from outside (a saved preference) swaps in place, still without animating.
    rerender(<ThemeSwitch theme="dark" />);
    expect(icons().every((i) => i.className.split(" ").includes("transition-none"))).toBe(true);
    await userEvent.click(screen.getByRole("button"));
    expect(icons().every((i) => !i.className.split(" ").includes("transition-none"))).toBe(true);
  });

  it("shows the sun in light mode and the moon in dark mode", () => {
    const { container, rerender } = render(<ThemeSwitch theme="light" />);
    const [sun, moon] = [...container.querySelectorAll("button > span > span")] as HTMLElement[];
    expect(sun?.className).toContain("opacity-100");
    expect(moon?.className).toContain("opacity-0");
    rerender(<ThemeSwitch theme="dark" />);
    expect(sun?.className).toContain("opacity-0");
    expect(moon?.className).toContain("opacity-100");
  });

  it("never submits a form", async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <ThemeSwitch />
      </form>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("works from the keyboard", async () => {
    const onThemeChange = vi.fn();
    render(<ThemeSwitch onThemeChange={onThemeChange} />);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("button"));
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onThemeChange).toHaveBeenNthCalledWith(1, "dark");
    expect(onThemeChange).toHaveBeenNthCalledWith(2, "light");
  });

  it("forwards ref, spreads props and lets className win", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ThemeSwitch ref={ref} className="size-12" data-x="1" />);
    expect(ref.current).toBe(screen.getByRole("button"));
    expect(ref.current?.getAttribute("data-x")).toBe("1");
    expect(ref.current?.className.split(" ")).toContain("size-12");
    expect(ref.current?.className.split(" ")).not.toContain("size-10");
  });

  it("has no axe violations (icon-only and labelled, both themes)", async () => {
    const { container } = render(
      <>
        <ThemeSwitch />
        <ThemeSwitch defaultTheme="dark" />
        <ThemeSwitch showLabel />
        <ThemeSwitch showLabel defaultTheme="dark" label="Night mode" />
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
