"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Compose with PopoverTrigger and PopoverContent. */
export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverClose = PopoverPrimitive.Close;
export const PopoverAnchor = PopoverPrimitive.Anchor;

const contentVariants = cva(
  "z-[var(--z-dropdown)] w-72 max-w-[calc(100vw-1rem)] rounded-xl p-4 text-sm text-foreground transition-[opacity,transform] duration-[var(--duration-fast)] ease-[var(--ease-out)] starting:scale-95 starting:opacity-0 focus-visible:outline-none",
  {
    variants: {
      variant: {
        default: "border border-border bg-background shadow-lg",
        glass: "zuri-glass",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface PopoverContentProps
  extends ComponentProps<typeof PopoverPrimitive.Content>,
    VariantProps<typeof contentVariants> {}

/**
 * A small panel anchored to its trigger. Unlike a tooltip it can hold interactive content.
 * Radix moves focus into it, closes it on Escape or an outside click, and returns focus to
 * the trigger. Give the content an accessible name (a heading, or `aria-label`).
 */
export function PopoverContent({
  className,
  variant,
  sideOffset = 8,
  collisionPadding = 8,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(contentVariants({ variant }), className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export { contentVariants as popoverContentVariants };
