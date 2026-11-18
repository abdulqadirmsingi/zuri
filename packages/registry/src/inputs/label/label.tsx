import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** A native `<label>`; associate it with a control via `htmlFor`, or wrap the control. */
export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: association is the caller's job (htmlFor or nesting).
    <label
      className={cn("text-sm font-medium leading-none text-foreground", className)}
      {...props}
    />
  );
}
