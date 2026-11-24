import type { ComponentProps, CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** Which edge of the container the blur sits on. These are physical edges, because it is the
 *  visible side of a scroller that content disappears past, whichever way the text runs. */
export type BlurSide = "top" | "bottom" | "left" | "right";

export interface ProgressiveBlurProps extends Omit<ComponentProps<"div">, "children"> {
  /** The edge it sits on. Defaults to "bottom". */
  side?: BlurSide;
  /** How far it reaches in from the edge: a number of pixels, or any CSS length. Defaults to 6rem. */
  size?: number | string;
  /** The strongest blur, in pixels, at the very edge. Defaults to 12. */
  strength?: number;
  /** How many stacked blur layers. More is smoother but costs more to paint. 1 to 6; defaults to 5. */
  steps?: number;
  /** Also fade the content to the page background colour, so it disappears completely at the edge. */
  fade?: boolean;
}

export const MAX_STEPS = 6;

/** Which way the gradient runs: from the content side toward the edge, where the blur is strongest. */
const toward = { top: "to top", bottom: "to bottom", left: "to left", right: "to right" } as const;

const place = {
  top: "inset-x-0 top-0",
  bottom: "inset-x-0 bottom-0",
  left: "inset-y-0 left-0",
  right: "inset-y-0 right-0",
} as const;

export function clampSteps(steps: number): number {
  return Number.isFinite(steps) ? Math.min(MAX_STEPS, Math.max(1, Math.round(steps))) : 5;
}

/** The blur for each layer, weakest first: it doubles from one layer to the next. */
export function layerBlurs(strength: number, steps: number): number[] {
  const n = clampSteps(steps);
  const max = Number.isFinite(strength) ? Math.max(0, strength) : 12;
  return Array.from({ length: n }, (_, i) => Math.round((max / 2 ** (n - 1 - i)) * 100) / 100);
}

/**
 * The mask that confines layer `i` to its own band. Bands overlap and fade in and out, so the
 * layers blend into one smooth ramp. The strongest layer is solid all the way to the edge.
 */
export function layerMask(side: BlurSide, i: number, steps: number): string {
  const n = clampSteps(steps);
  const step = 100 / (n + 1);
  const at = (k: number) => `${Math.round(k * step * 100) / 100}%`;
  const stops = [`transparent ${at(i)}`, `black ${at(i + 1)}`];
  if (i < n - 1) stops.push(`black ${at(i + 2)}`, `transparent ${at(i + 3)}`);
  else stops.push("black 100%");
  return `linear-gradient(${toward[side]}, ${stops.join(", ")})`;
}

/**
 * A blur that grows toward the edge of a scroller, so content softens as it leaves the view instead
 * of being cut off. Put it inside a `relative` container, over the scrolling content, and give the
 * content bottom padding at least as large as `size` so the last item can scroll clear of it.
 *
 * It is purely decorative: hidden from assistive technology and it never takes a click or a touch.
 * It needs no JavaScript. Where `backdrop-filter` is missing, or someone prefers reduced
 * transparency, the blur layers are dropped (see the item's CSS); with `fade` the content still
 * fades out, so it degrades to a plain fade instead of a hard edge.
 */
export function ProgressiveBlur({
  side = "bottom",
  size = "6rem",
  strength = 12,
  steps = 5,
  fade = false,
  className,
  style,
  ...props
}: ProgressiveBlurProps) {
  const length = typeof size === "number" ? `${size}px` : size;
  const vertical = side === "top" || side === "bottom";
  const blurs = layerBlurs(strength, steps);
  const sizing: CSSProperties = vertical ? { height: length } : { width: length };
  return (
    <div
      data-side={side}
      className={cn("zuri-pblur pointer-events-none absolute", place[side], className)}
      style={{ ...sizing, ...style }}
      {...props}
      aria-hidden="true"
    >
      {blurs.map((blur, i) => {
        const mask = layerMask(side, i, blurs.length);
        return (
          <span
            // The layers never change order or number for a given set of props.
            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed, ordered stack of identical layers.
            key={i}
            data-pblur-layer=""
            className="absolute inset-0 block"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
      {fade ? (
        <span
          data-pblur-fade=""
          className="absolute inset-0 block"
          style={{ background: `linear-gradient(${toward[side]}, transparent, var(--background))` }}
        />
      ) : null}
    </div>
  );
}
