import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The soft, light ground that glass demos sit on. Glass only reads as glass when something shows
 * through it, so the demo needs a backdrop, but a gentle one: two blurred patches of the accent on
 * a pale surface, in both themes, so the field itself stays easy to see.
 */
export function GlassBackdrop({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative isolate w-full overflow-hidden rounded-2xl border border-border bg-muted p-5",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute -start-10 -top-12 -z-10 size-44 rounded-full bg-accent/45 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-14 -end-8 -z-10 size-48 rounded-full bg-accent/25 blur-3xl"
      />
      {children}
    </div>
  );
}
