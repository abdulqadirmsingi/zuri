import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends Omit<ComponentProps<"div">, "children"> {
  /** Current value from 0 to `max`. Omit for an indeterminate (unknown length) state. */
  value?: number;
  /** Value that means "complete". Defaults to 100. */
  max?: number;
}

/**
 * A progress bar with `role="progressbar"`. It needs a name: pass `aria-label` or
 * `aria-labelledby`. Without a `value` it is indeterminate and pulses (no movement).
 */
export function Progress({ value, max = 100, className, ...props }: ProgressProps) {
  const known = typeof value === "number" && Number.isFinite(value) && max > 0;
  const clamped = known ? Math.min(Math.max(value, 0), max) : undefined;
  const fraction = clamped === undefined ? 1 : clamped / max;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      {...props}
    >
      {/* Slides with transform (cheap to animate); mirrored in right-to-left layouts. */}
      <div
        className={cn(
          "h-full w-full rounded-full bg-primary transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] motion-reduce:transition-none",
          "-translate-x-[calc((1-var(--zuri-progress))*100%)] rtl:translate-x-[calc((1-var(--zuri-progress))*100%)]",
          clamped === undefined && "animate-pulse motion-reduce:animate-pulse",
        )}
        style={{ "--zuri-progress": fraction } as React.CSSProperties}
      />
    </div>
  );
}
