"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { type ComponentProps, useCallback, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Compose with TabsList, TabsTrigger and TabsContent. Use `value` or `defaultValue` to pick the tab. */
export function Tabs({ className, ...props }: ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn("flex flex-col gap-3", className)} {...props} />;
}

export interface TabsListProps extends ComponentProps<typeof TabsPrimitive.List> {
  /** "pill" is a filled track with a sliding pill; "line" is an underline that slides. */
  variant?: "pill" | "line";
}

/**
 * The row of tabs, with an indicator that slides to the active one. The indicator follows
 * whichever tab Radix marks active (so it works controlled and uncontrolled) and is re-measured
 * when anything resizes. Durations use tokens, which are near zero under reduced motion.
 */
export function TabsList({ className, variant = "pill", children, ...props }: TabsListProps) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [box, setBox] = useState<{ x: number; w: number } | null>(null);

  const measure = useCallback(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
    if (!list || !active) return setBox(null);
    // Layout offsets, not getBoundingClientRect: the rects include any CSS transform on an
    // ancestor (a scaled or rotated demo, a zoomed page), but the indicator is positioned in the
    // list's own untransformed pixels, so rects made it the wrong size and place.
    setBox({ x: active.offsetLeft, w: active.offsetWidth });
  }, []);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    measure();
    const mo = new MutationObserver(measure);
    mo.observe(list, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-state"],
    });
    if (typeof ResizeObserver === "undefined") return () => mo.disconnect();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    for (const tab of list.querySelectorAll('[role="tab"]')) ro.observe(tab);
    return () => {
      mo.disconnect();
      ro.disconnect();
    };
  }, [measure]);

  return (
    <TabsPrimitive.List
      ref={listRef}
      data-variant={variant}
      className={cn(
        "group/tablist relative inline-flex max-w-full items-center overflow-x-auto",
        variant === "pill" ? "gap-1 rounded-lg bg-muted p-1" : "gap-1 border-b border-border",
        className,
      )}
      {...props}
    >
      {/* The sliding indicator. Hidden from assistive technology; it only decorates the active tab. */}
      {box ? (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute left-0 transition-[transform,translate,scale,rotate,width] duration-[var(--duration-slow)] ease-[cubic-bezier(0.34,1.4,0.64,1)]",
            variant === "pill"
              ? "inset-y-1 rounded-md bg-background shadow-sm"
              : "bottom-0 h-0.5 rounded-full bg-primary",
          )}
          style={{ transform: `translateX(${box.x}px)`, width: box.w }}
        />
      ) : null}
      {children}
    </TabsPrimitive.List>
  );
}

export function TabsTrigger({
  className,
  onPointerDown,
  onKeyDown,
  onBlur,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  // After a mouse click the browser still treats the tab as keyboard-focused, which drew the ring.
  // Remember that the last input was the pointer, and show the ring again as soon as a key is used.
  const [pointer, setPointer] = useState(false);
  return (
    <TabsPrimitive.Trigger
      data-pointer={pointer || undefined}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        setPointer(true);
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        setPointer(false);
      }}
      onBlur={(e) => {
        onBlur?.(e);
        setPointer(false);
      }}
      className={cn(
        "relative z-10 inline-flex min-h-9 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors duration-[var(--duration-base)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[pointer]:focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        "rounded-md text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
    />
  );
}
