import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const glows = {
  sunrise: "from-[var(--glow-1)] via-[var(--glow-2)] to-[var(--glow-5)]",
  bloom: "from-[var(--glow-2)] via-[var(--glow-3)] to-[var(--glow-1)]",
  tide: "from-[var(--glow-5)] via-[var(--glow-4)] to-[var(--glow-3)]",
} as const;

/**
 * A product shot in a coloured frame. The colour shows on the top and start edges only; the panel
 * runs off the end and bottom, as if the window carried on past the frame.
 */
export function Frame({
  glow,
  title,
  children,
  className,
}: {
  glow: keyof typeof glows;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.75rem] bg-gradient-to-br ps-6 pt-6 sm:ps-10 sm:pt-10",
        glows[glow],
        className,
      )}
    >
      <div className="flex h-full min-h-[22rem] flex-col overflow-hidden rounded-ss-2xl border-s border-t border-black/5 bg-background shadow-[0_-1px_0_0_rgb(255_255_255/0.4)_inset]">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
          </span>
          <span className="ms-2 font-mono text-xs text-muted-foreground">{title}</span>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
