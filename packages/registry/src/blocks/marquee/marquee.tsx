"use client";

import { type ComponentProps, type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

export interface MarqueeProps extends Omit<ComponentProps<"div">, "children"> {
  /** The items to scroll, such as logos or short quotes. Wrap them in a list for good semantics. */
  children: ReactNode;
  /** Seconds for one full loop. Larger is slower. Defaults to 30. */
  duration?: number;
  /** Scroll the other way. */
  reverse?: boolean;
  /**
   * How many times each half repeats the children. Raise it when the items are narrower than the
   * container, so there is never a gap. Defaults to 1.
   */
  repeat?: number;
  /** Fade the two ends into the background. Defaults to true. */
  fade?: boolean;
  /** Show a pause button. Moving content must be pausable (WCAG 2.2.2). Defaults to true. */
  pausable?: boolean;
  /** Names of the pause and play button states, for translation. */
  labels?: { pause: string; play: string };
}

/**
 * A row that scrolls sideways forever, for logos or short quotes. It pauses while hovered or
 * focused and has a pause button, and under reduced motion it stops scrolling and wraps instead.
 * The second copy of the content is hidden from assistive tech, so nothing is read twice.
 */
export function Marquee({
  children,
  duration = 30,
  reverse = false,
  repeat = 1,
  fade = true,
  pausable = true,
  labels = { pause: "Pause scrolling", play: "Resume scrolling" },
  className,
  style,
  ...props
}: MarqueeProps) {
  const [paused, setPaused] = useState(false);
  const half = Math.max(1, Math.floor(repeat));
  const copy = Array.from({ length: half }, (_, i) => (
    <div
      // biome-ignore lint/suspicious/noArrayIndexKey: the copies are identical and never reorder.
      key={i}
      className="flex shrink-0 items-center gap-[inherit] motion-reduce:min-w-0 motion-reduce:shrink motion-reduce:justify-center"
    >
      {children}
    </div>
  ));
  return (
    <div className={cn("group flex flex-col gap-2", className)} {...props}>
      <div
        className={cn(
          "overflow-hidden motion-reduce:overflow-visible",
          fade &&
            "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] motion-reduce:[mask-image:none]",
        )}
      >
        <div
          data-paused={paused}
          style={{ ...style, "--zuri-marquee-duration": `${duration}s` } as React.CSSProperties}
          className={cn(
            "flex w-max gap-8 animate-[zuri-marquee_var(--zuri-marquee-duration)_linear_infinite] rtl:animate-[zuri-marquee-rtl_var(--zuri-marquee-duration)_linear_infinite]",
            reverse && "[animation-direction:reverse]",
            "data-[paused=true]:[animation-play-state:paused] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]",
            // Under reduced motion: no scrolling, a single wrapped copy.
            "motion-reduce:w-auto motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center",
          )}
        >
          {copy}
          <div aria-hidden="true" className="flex gap-[inherit] motion-reduce:hidden">
            {copy}
          </div>
        </div>
      </div>
      {pausable ? (
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
          className="inline-flex min-h-6 items-center self-end rounded-sm px-2 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:hidden"
        >
          {paused ? labels.play : labels.pause}
        </button>
      ) : null}
    </div>
  );
}
