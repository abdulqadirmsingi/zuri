"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  type ComponentProps,
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

const barVariants = cva("relative flex items-center gap-1 rounded-full p-1", {
  variants: {
    variant: {
      solid: "border border-border bg-background",
      glass: "zuri-glass",
    },
    fixed: {
      // Floats at the bottom centre, above the phone's home indicator.
      true: "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] start-1/2 z-[var(--z-sticky)] -translate-x-1/2 rtl:translate-x-1/2",
      false: "",
    },
  },
  defaultVariants: { variant: "solid", fixed: false },
});

export interface BottomNavItem {
  /** Unique id, used as the value. */
  id: string;
  /** Text label. It is always in the accessibility tree; it is only visible on the active item. */
  label: string;
  /** Decorative icon (an inline SVG). It is hidden from assistive technology. */
  icon: ReactNode;
  /** Makes the item a link. Without it the item is a button. */
  href?: string;
  /** A count shown on the icon, e.g. unread messages. Hidden when 0 or missing. */
  badge?: number;
}

export interface BottomNavProps
  extends Omit<ComponentProps<"nav">, "children" | "onChange" | "defaultValue">,
    VariantProps<typeof barVariants> {
  items: BottomNavItem[];
  /** Controlled active item id. */
  value?: string;
  /** Initial active item id when uncontrolled. Defaults to the first item. */
  defaultValue?: string;
  onValueChange?: (id: string) => void;
}

/**
 * A pill-shaped bottom navigation. The active item grows to show its label and a "liquid"
 * indicator slides to it with a springy overshoot. Items are real links or buttons, so Tab
 * and Enter work with no extra handling. Durations come from tokens, which drop to ~0 under
 * `prefers-reduced-motion`, so the indicator then simply jumps.
 */
export function BottomNav({
  items,
  value,
  defaultValue,
  onValueChange,
  variant,
  fixed,
  className,
  ...props
}: BottomNavProps) {
  const [inner, setInner] = useState(defaultValue ?? items[0]?.id);
  const active = value ?? inner;
  const itemRefs = useRef(new Map<string, HTMLLIElement>());
  const listRef = useRef<HTMLUListElement>(null);
  const [box, setBox] = useState<{ x: number; w: number } | null>(null);

  const measure = useCallback(() => {
    const el = active ? itemRefs.current.get(active) : undefined;
    if (el) setBox({ x: el.offsetLeft, w: el.offsetWidth });
  }, [active]);

  // Follow the active item as it grows, shrinks or the bar is resized.
  useLayoutEffect(() => {
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    if (listRef.current) ro.observe(listRef.current);
    for (const el of itemRefs.current.values()) ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  function select(id: string) {
    if (value === undefined) setInner(id);
    onValueChange?.(id);
  }

  return (
    <nav className={cn(barVariants({ variant, fixed }), className)} {...props}>
      <ul
        ref={listRef}
        // The label grows over a transition; measure again once it has finished.
        onTransitionEnd={measure}
        className="relative m-0 flex list-none items-center gap-1 p-0"
      >
        {/* The sliding pill. Hidden until measured; until then the active item paints its own. */}
        {box ? (
          <li
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 start-0 left-0 rounded-full bg-primary transition-[transform,translate,scale,rotate,width] duration-[var(--duration-slow)] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{ transform: `translateX(${box.x}px)`, width: box.w }}
          />
        ) : null}
        {items.map((item) => {
          const isActive = item.id === active;
          const Tag = item.href ? "a" : "button";
          const count = item.badge && item.badge > 0 ? item.badge : 0;
          return (
            <li
              key={item.id}
              // Measured for the indicator: the li is positioned relative to the list, so its
              // offsetLeft is the distance from the list's start (the button's would be ~0).
              ref={(el) => {
                if (el) itemRefs.current.set(item.id, el);
                else itemRefs.current.delete(item.id);
              }}
              className="relative z-10"
            >
              <Tag
                href={item.href}
                type={item.href ? undefined : "button"}
                aria-current={isActive ? "page" : undefined}
                onClick={() => select(item.id)}
                className={cn(
                  "group flex min-h-12 min-w-12 cursor-pointer items-center justify-center rounded-full px-3 text-muted-foreground transition-colors duration-[var(--duration-base)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-[current=page]:text-primary-foreground",
                  // Before the indicator is measured (server render), keep the active item visible.
                  !box && "aria-[current=page]:bg-primary",
                )}
              >
                <span className="relative inline-flex size-6 items-center justify-center [&_svg]:size-6">
                  <span aria-hidden="true" className="contents">
                    {item.icon}
                  </span>
                  {count ? (
                    <span className="absolute -end-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-medium text-primary-foreground ring-2 ring-background">
                      <span aria-hidden="true">{count > 99 ? "99+" : count}</span>
                    </span>
                  ) : null}
                </span>
                {/* The label collapses to zero width but stays readable by screen readers. */}
                <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-[var(--duration-slow)] ease-[var(--ease-out)] group-aria-[current=page]:grid-cols-[1fr]">
                  <span className="overflow-hidden whitespace-nowrap text-sm font-medium">
                    <span className="ps-2">{item.label}</span>
                  </span>
                </span>
                {count ? (
                  <span className="sr-only">, {count > 99 ? "more than 99" : count} new</span>
                ) : null}
              </Tag>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { barVariants };
