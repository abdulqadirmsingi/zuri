"use client";

import { type ComponentProps, type ElementType, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface RevealProps extends ComponentProps<"div"> {
  /** How it arrives. "up" rises and fades in; "fade" only fades; "start" and "end" slide sideways (they flip in right-to-left). */
  from?: "up" | "fade" | "start" | "end";
  /** Wait this many milliseconds before starting. Use small steps (60-120) to stagger siblings. */
  delay?: number;
  /** Fraction of the element that must be visible before it reveals, from 0 to 1. Defaults to 0.15. */
  threshold?: number;
  /** Reveal once (default) or hide again when it scrolls out of view. */
  once?: boolean;
  /**
   * Also animate when already on screen at mount. By default such content is left alone so the
   * page doesn't flash; turn this on for something that should always play, like a demo.
   */
  animateOnScreen?: boolean;
  /** The element to render. Defaults to "div". */
  as?: ElementType;
}

const hidden: Record<NonNullable<RevealProps["from"]>, string> = {
  up: "translate-y-6 opacity-0",
  fade: "opacity-0",
  start: "ltr:-translate-x-6 rtl:translate-x-6 opacity-0",
  end: "ltr:translate-x-6 rtl:-translate-x-6 opacity-0",
};

/**
 * Fades its content in as it scrolls into view. The content is fully visible until the page has
 * loaded, so it works without JavaScript and never hides anything that is already on screen. It
 * does nothing for people who prefer reduced motion.
 */
export function Reveal({
  from = "up",
  delay = 0,
  threshold = 0.15,
  once = true,
  animateOnScreen = false,
  as: Tag = "div",
  className,
  style,
  ...props
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  // "visible" is the server and first-render state, so nothing is hidden before hydration.
  const [state, setState] = useState<"visible" | "hidden">("visible");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const rect = el.getBoundingClientRect();
    // Already on screen when the page loads: leave it alone, so there is no flash.
    const onScreen = rect.top < window.innerHeight && rect.bottom > 0;
    if (!onScreen || animateOnScreen) setState("hidden");

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setState("visible");
          if (once) io.disconnect();
        } else if (!once) {
          setState("hidden");
        }
      },
      { threshold },
    );
    // Content that was already on screen would otherwise flip to visible in the same frame it was
    // hidden, and the browser would never paint the hidden state, so nothing would animate.
    let start = 0;
    if (animateOnScreen && onScreen) {
      start = requestAnimationFrame(() => {
        start = requestAnimationFrame(() => io.observe(el));
      });
    } else {
      io.observe(el);
    }

    // A jump past the element (the End key, an anchor link further down) moves it from below the
    // view to above it without ever intersecting, so the observer stays silent and it would stay
    // invisible. Anything above the bottom edge of the view has been scrolled to or past: show it.
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (el.getBoundingClientRect().top < window.innerHeight) {
          setState("visible");
          if (once) io.disconnect();
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(start);
      io.disconnect();
    };
  }, [once, threshold, animateOnScreen]);

  return (
    <Tag
      ref={ref}
      data-reveal={state}
      style={{ ...style, transitionDelay: state === "visible" && delay ? `${delay}ms` : undefined }}
      className={cn(
        "transition-[opacity,transform,translate,scale,rotate] duration-[var(--duration-slow)] ease-[var(--ease-out)]",
        // Hiding is instant: only the way in is animated, so a replay starts from fully hidden.
        state === "hidden" && ["transition-none", hidden[from]],
        className,
      )}
      {...props}
    />
  );
}
