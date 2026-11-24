import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export interface SeparatorProps extends ComponentProps<"div"> {
  orientation?: "horizontal" | "vertical";
  /** Purely visual: hidden from assistive technology. Defaults to true. */
  decorative?: boolean;
}

/** A thin dividing line. Vertical separators need a parent with a height (e.g. `h-6`). */
export function Separator({
  orientation = "horizontal",
  decorative = true,
  className,
  ...props
}: SeparatorProps) {
  return (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: the role is dynamic; aria-orientation is only set when it is "separator".
    <div
      role={decorative ? "none" : "separator"}
      // aria-orientation is only meaningful (and only valid) on a real separator.
      aria-orientation={!decorative && orientation === "vertical" ? "vertical" : undefined}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px self-stretch",
        className,
      )}
      {...props}
    />
  );
}
