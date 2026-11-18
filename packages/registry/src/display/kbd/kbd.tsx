import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** A keyboard key, for shortcuts such as `<Kbd>⌘</Kbd><Kbd>K</Kbd>`. */
export function Kbd({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "inline-flex min-h-6 min-w-6 items-center justify-center rounded-md border border-control-border bg-muted px-1.5 font-mono text-xs font-medium text-foreground",
        className,
      )}
      {...props}
    />
  );
}
