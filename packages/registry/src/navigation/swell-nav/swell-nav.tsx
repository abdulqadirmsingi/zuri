"use client";

import { type ComponentProps, type CSSProperties, type ReactNode, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface SwellNavItem {
  /** Unique id, used as the value. */
  id: string;
  /** Text label. Always visible, and the item's accessible name. */
  label: string;
  /** Decorative icon (an inline SVG). It is hidden from assistive technology. */
  icon: ReactNode;
  /** Makes the item a link. Without it the item is a button. */
  href?: string;
}

export interface SwellNavProps
  extends Omit<ComponentProps<"nav">, "children" | "onChange" | "defaultValue"> {
  /** Two to five items work best. */
  items: SwellNavItem[];
  /** Controlled active item id. */
  value?: string;
  /** Initial active item id when uncontrolled. Defaults to the first item. */
  defaultValue?: string;
  onValueChange?: (id: string) => void;
}

// The curved "shoulder" where the dome meets the bar: a quarter-circle of surface colour with a
// hairline along its curve, so the dome flows out of the bar instead of sitting on it.
const shoulder = (at: "0 0" | "100% 0") =>
  `radial-gradient(circle at ${at}, transparent calc(1rem - 1px), var(--border) calc(1rem - 1px), var(--border) 1rem, var(--background) 1rem)`;

/**
 * A full-width bottom bar whose surface swells into a dome under the active item, with a saffron
 * bubble holding the item's icon. Choosing another item slides the dome across with a small
 * stretch, as if the bar were liquid. Items are real links or buttons, so Tab and Enter work with
 * no extra handling. All motion uses the duration tokens, so under `prefers-reduced-motion` the
 * dome simply jumps. Position it yourself, for example `fixed inset-x-0 bottom-0`; leave about
 * 4rem of free space above it for the dome.
 */
export function SwellNav({
  items,
  value,
  defaultValue,
  onValueChange,
  className,
  style,
  "aria-label": label = "Primary",
  ...props
}: SwellNavProps) {
  const [inner, setInner] = useState(defaultValue ?? items[0]?.id);
  const current = value ?? inner;
  const index = Math.max(
    0,
    items.findIndex((i) => i.id === current),
  );
  const active = items[index];

  // Only animate on a change after the first render, so the page does not load mid-animation.
  const previous = useRef(current);
  const [changes, setChanges] = useState(0);
  if (previous.current !== current) {
    previous.current = current;
    setChanges((c) => c + 1);
  }

  const choose = (id: string) => {
    if (value === undefined) setInner(id);
    onValueChange?.(id);
  };

  return (
    <nav
      aria-label={label}
      style={
        {
          ...style,
          "--zuri-swell-n": items.length,
          "--zuri-swell-i": index,
        } as CSSProperties
      }
      className={cn(
        // The area above the bar is only room for the dome; it must not block taps on the page.
        "pointer-events-none relative w-full pt-16 pb-[env(safe-area-inset-bottom)] [--zuri-swell-dir:1] rtl:[--zuri-swell-dir:-1]",
        className,
      )}
      {...props}
    >
      <div className="pointer-events-auto relative">
        {/* The bar. */}
        <ul className="relative z-10 m-0 flex h-16 list-none items-stretch border-t border-border bg-background p-0">
          {items.map((item, i) => {
            const isActive = i === index;
            const itemClass = cn(
              "flex size-full min-w-0 flex-col items-center justify-end gap-1 pb-2 text-[0.6875rem] font-medium leading-none transition-colors duration-[var(--duration-base)] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            );
            const inside = (
              <>
                {/* The active icon lives in the bubble, so the spot here stays empty. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-6 shrink-0 [&>svg]:size-full",
                    isActive && "opacity-0",
                    !isActive && "mb-1",
                  )}
                >
                  {item.icon}
                </span>
                <span className="max-w-full truncate px-1">{item.label}</span>
              </>
            );
            return (
              <li key={item.id} className="min-w-0 flex-1">
                {item.href ? (
                  <a
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => choose(item.id)}
                    className={itemClass}
                  >
                    {inside}
                  </a>
                ) : (
                  <button
                    type="button"
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => choose(item.id)}
                    className={cn(itemClass, "bg-transparent")}
                  >
                    {inside}
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {/* The dome and bubble. Decorative; it only follows the active item. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-full z-20 h-0"
        >
          <div className="flex w-[calc(100%/var(--zuri-swell-n))] justify-center translate-x-[calc(var(--zuri-swell-i)*var(--zuri-swell-dir)*100%)] transition-[translate] duration-[var(--duration-slow)] ease-[var(--ease-out)]">
            <div
              key={changes}
              className={cn(
                "relative h-0 w-[5.5rem] shrink-0",
                changes > 0 && "animate-[zuri-swell-stretch_var(--duration-slow)_var(--ease-out)]",
              )}
            >
              {/* The dome: the bar's own surface, bulging up. The 1px overlap hides the bar's top border. */}
              <div className="absolute inset-x-0 bottom-[-1px] h-14 rounded-t-full border border-b-0 border-border bg-background" />
              {/* Shoulders, so the dome flows into the bar. */}
              <div
                className="absolute bottom-[-1px] left-0 size-4 -translate-x-full"
                style={{ background: shoulder("0 0") }}
              />
              <div
                className="absolute right-0 bottom-[-1px] size-4 translate-x-full"
                style={{ background: shoulder("100% 0") }}
              />
              {/* The bubble. */}
              <div className="absolute bottom-2 start-1/2 flex size-12 -translate-x-1/2 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-md rtl:translate-x-1/2">
                <span
                  className={cn(
                    "size-6 [&>svg]:size-full",
                    changes > 0 && "animate-[zuri-swell-pop_var(--duration-base)_var(--ease-out)]",
                  )}
                >
                  {active?.icon}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
