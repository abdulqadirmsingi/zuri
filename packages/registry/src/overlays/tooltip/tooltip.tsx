"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Wrap a group of tooltips to share one open delay. A single Tooltip works without it. */
export const TooltipProvider = TooltipPrimitive.Provider;

export interface TooltipProps
  extends Omit<ComponentProps<typeof TooltipPrimitive.Content>, "content" | "children"> {
  /** The tooltip text. Keep it short; it is a label, not a place for essential information. */
  content: ReactNode;
  /** The element that triggers it. It must accept a ref and be focusable (a button or link). */
  children: ReactNode;
  /** Milliseconds before it appears on hover or focus. Defaults to 300. */
  delayDuration?: number;
}

/**
 * A short label shown on hover and keyboard focus, and dismissed with Escape. It describes the
 * trigger (via aria-describedby) and never replaces its accessible name: an icon-only button
 * still needs its own aria-label. Tooltips do not appear on touch, so never put anything
 * essential in one.
 */
export function Tooltip({
  content,
  children,
  delayDuration = 300,
  className,
  sideOffset = 6,
  collisionPadding = 8,
  ...props
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={sideOffset}
            collisionPadding={collisionPadding}
            className={cn(
              "z-[var(--z-tooltip)] max-w-xs rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background transition-opacity duration-[var(--duration-fast)] starting:opacity-0",
              className,
            )}
            {...props}
          >
            {content}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
