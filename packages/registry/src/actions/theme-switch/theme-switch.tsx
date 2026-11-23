"use client";

import { type MouseEvent, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ThemeMode = "light" | "dark";

/**
 * How the page changes. "circle" spreads outward from the button, "wipe" sweeps down from the
 * top, "curtain" opens from the middle sideways, "diagonal" sweeps from the top corner, "fade"
 * cross-fades, and "none" switches at once. Browsers without the View Transitions API,
 * and people who ask for reduced motion, always get "none".
 */
export type ThemeTransition = "circle" | "wipe" | "curtain" | "diagonal" | "fade" | "none";

export interface ThemeSwitchProps
  extends Omit<ButtonProps, "children" | "onClick" | "loading" | "type"> {
  /** The current theme. Leave out to let the switch keep track of it. */
  theme?: ThemeMode;
  defaultTheme?: ThemeMode;
  /**
   * Called with the theme to switch to. Your app applies it here (a class on `<html>`, a cookie,
   * your theme library). It must change the page synchronously for the transition to capture it.
   */
  onThemeChange?: (theme: ThemeMode) => void;
  transition?: ThemeTransition;
  /** How long the page transition runs, in milliseconds. Defaults to 500. */
  duration?: number;
  /** The setting's name. Stays the same in both states; `aria-pressed` carries on or off. */
  label?: string;
  /** Show the label as text beside the icon. Otherwise it is an icon-only button. */
  showLabel?: boolean;
}

type ViewTransition = { ready: Promise<unknown>; finished: Promise<unknown> };
type DocumentWithTransitions = Document & {
  startViewTransition?: (update: () => void | Promise<void>) => ViewTransition;
};

const reducedMotion = () =>
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// While a circle or wipe runs, the browser's own cross-fade must be switched off, or the old page
// would fade out underneath the reveal. The rule lives in a style element that is removed again.
const takeOver =
  "::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal}" +
  "::view-transition-old(root){z-index:1}::view-transition-new(root){z-index:2}";

const sun = (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="2.8" />
    <path d="M8 1.5v1.4M8 13.1v1.4M1.5 8h1.4M13.1 8h1.4M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
  </svg>
);

const moon = (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8a5.6 5.6 0 1 0 6.8 6.8z" />
  </svg>
);

/**
 * A button that switches between light and dark, with an optional animated change of the whole
 * page. It reports the choice and leaves applying it to your app.
 *
 * The icon only animates after the person has used the switch. A saved preference that reaches
 * the page just after it loads therefore swaps the icon in place instead of spinning it.
 */
export function ThemeSwitch({
  theme: themeProp,
  defaultTheme = "light",
  onThemeChange,
  transition = "circle",
  duration = 500,
  label = "Dark mode",
  showLabel = false,
  size,
  variant = "outline",
  className,
  ...props
}: ThemeSwitchProps) {
  const [inner, setInner] = useState<ThemeMode>(defaultTheme);
  const [used, setUsed] = useState(false);
  const running = useRef(false);
  const alive = useRef(true);
  const theme = themeProp ?? inner;
  const dark = theme === "dark";

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  function apply(next: ThemeMode) {
    if (themeProp === undefined) setInner(next);
    onThemeChange?.(next);
  }

  async function onClick(event: MouseEvent<HTMLButtonElement>) {
    if (running.current) return;
    const next: ThemeMode = dark ? "light" : "dark";
    setUsed(true);
    const doc = document as DocumentWithTransitions;
    if (transition === "none" || !doc.startViewTransition || reducedMotion()) return apply(next);

    const box = event.currentTarget.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const reach = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    running.current = true;
    const style = document.createElement("style");
    if (transition !== "fade") style.textContent = takeOver;
    document.head.append(style);
    try {
      // flushSync makes React finish rendering inside the callback, so the browser captures the
      // new theme as the "after" picture.
      const view = doc.startViewTransition(() => flushSync(() => apply(next)));
      await view.ready;
      if (transition !== "fade") {
        // Each pair has the same shape on both ends, so the browser can interpolate it.
        const frames = {
          circle: [`circle(0px at ${x}px ${y}px)`, `circle(${reach}px at ${x}px ${y}px)`],
          wipe: ["inset(0 0 100% 0)", "inset(0 0 0 0)"],
          curtain: ["inset(0 50% 0 50%)", "inset(0 0 0 0)"],
          // A triangle from the top corner whose legs grow until it covers the whole screen.
          diagonal: ["polygon(0 0, 0 0, 0 0)", "polygon(0 0, 200% 0, 0 200%)"],
        }[transition];
        document.documentElement.animate(
          { clipPath: frames },
          {
            duration,
            easing: "cubic-bezier(0.23, 1, 0.32, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      }
      await view.finished;
    } catch {
      /* the transition was skipped or interrupted; the theme has still been applied */
    } finally {
      style.remove();
      running.current = false;
    }
  }

  const iconClass = cn(
    "absolute inset-0 size-4 transition-[opacity,transform,translate,scale,rotate] duration-[var(--duration-slow)] ease-[var(--ease-out)] motion-reduce:transition-none",
    !used && "transition-none",
  );

  return (
    <Button
      type="button"
      variant={variant}
      size={size ?? (showLabel ? "md" : "icon")}
      aria-pressed={dark}
      // With visible text the name comes from that text, so the two cannot disagree (WCAG 2.5.3).
      aria-label={showLabel ? undefined : label}
      onClick={onClick}
      className={className}
      {...props}
    >
      {/* Both icons turn the same way, so the swap reads as one rotation rather than two fades. */}
      <span aria-hidden="true" className="relative inline-flex size-4 shrink-0">
        <span className={cn(iconClass, dark ? "rotate-45 scale-50 opacity-0" : "opacity-100")}>
          {sun}
        </span>
        <span className={cn(iconClass, dark ? "opacity-100" : "-rotate-45 scale-50 opacity-0")}>
          {moon}
        </span>
      </span>
      {showLabel ? label : null}
    </Button>
  );
}
