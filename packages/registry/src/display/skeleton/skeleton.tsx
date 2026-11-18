import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * A placeholder block shown while content loads. It is hidden from assistive technology:
 * announce loading on the container instead (e.g. `aria-busy`) or with a Spinner label.
 */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-muted motion-reduce:animate-none", className)}
      {...props}
    />
  );
}
