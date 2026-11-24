"use client";

import {
  type ComponentProps,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

// biome-ignore lint/suspicious/noConfusingVoidType: a handler that returns nothing must stay allowed.
type Outcome = void | boolean;

export interface ExpandingAction {
  /** Unique id. Also what `onAction` receives. */
  id: string;
  /** Short verb, such as "Archive". It is the button's accessible name at all times. */
  label: string;
  /** Icon shown when collapsed (an inline SVG). It is hidden from assistive technology. */
  icon: ReactNode;
  /**
   * Runs the action. Return a promise to show a busy state until it settles. Return `false` (or
   * reject) to say it did not work, so no success message is shown.
   */
  onPress?: () => Outcome | Promise<Outcome>;
  /** Past-tense word shown in place after the action works, such as "Archived". */
  successLabel?: string;
  /** "danger" colours the expanded button for destructive actions. */
  variant?: "default" | "danger";
  /** Dimmed and inert, but still focusable and still reveals its label so people can learn it. */
  disabled?: boolean;
}

export interface ExpandingButtonGroupProps
  extends Omit<ComponentProps<"div">, "children" | "onChange"> {
  actions: readonly ExpandingAction[];
  /** The action whose label shows at rest. Defaults to the first one that is not disabled. */
  restingId?: string;
  size?: "sm" | "md" | "lg";
  /**
   * "default" is an outlined pill whose open button is filled with the primary colour; "soft" has
   * a muted fill and no border; "accent" is outlined with the open button in saffron.
   */
  variant?: "default" | "soft" | "accent";
  /** Called with the id whenever an action starts, before its own `onPress`. */
  onAction?: (id: string) => void;
  /** How long the success message stays, in milliseconds. Defaults to 1400. */
  successDuration?: number;
}

const sizes = {
  sm: "h-8 min-w-8 px-2 text-xs",
  md: "h-10 min-w-10 px-3 text-sm",
  lg: "h-12 min-w-12 px-4 text-base",
} as const;

const surfaces = {
  default: "border border-border bg-background",
  soft: "bg-muted",
  accent: "border border-border bg-background",
} as const;

const isPromise = (value: unknown): value is Promise<unknown> =>
  typeof (value as { then?: unknown } | null)?.then === "function";

/**
 * A compact pill of icon buttons. One shows its label at rest; the one you point at or focus
 * takes over while its neighbours slide aside. An action can confirm in place ("Archived"), and
 * on touch the first tap reveals the label and the second runs the action.
 *
 * The label slides open with a CSS grid column (0fr to 1fr), so nothing is measured in
 * JavaScript. Durations come from tokens, which drop to near zero under reduced motion.
 */
export function ExpandingButtonGroup({
  actions,
  restingId,
  size = "md",
  variant = "default",
  onAction,
  successDuration = 1400,
  className,
  ...props
}: ExpandingButtonGroupProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [touched, setTouched] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const groupRef = useRef<HTMLDivElement>(null);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const keyboard = useRef(false);
  const pointerType = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      clearTimeout(timer.current);
    };
  }, []);

  const exists = (id: string | null | undefined): id is string =>
    Boolean(id) && actions.some((a) => a.id === id);
  const firstEnabled = actions.find((a) => !a.disabled)?.id ?? actions[0]?.id ?? null;
  const rest = exists(restingId) ? restingId : firstEnabled;
  // A confirmation wins, then the pointer, then keyboard focus, then a touch tap, then rest.
  const expanded = [done, hovered, focused, touched, rest].find(exists) ?? null;
  const tabStop = exists(focused) ? focused : rest;

  // A tap outside closes a label that a first tap opened.
  useEffect(() => {
    if (!touched) return;
    const close = (event: globalThis.PointerEvent) => {
      if (!groupRef.current?.contains(event.target as Node)) setTouched(null);
    };
    document.addEventListener("pointerdown", close, true);
    return () => document.removeEventListener("pointerdown", close, true);
  }, [touched]);

  const confirm = useCallback(
    (action: ExpandingAction) => {
      clearTimeout(timer.current);
      setDone(action.id);
      setAnnouncement(action.successLabel ?? "");
      timer.current = setTimeout(() => {
        setDone(null);
        setAnnouncement("");
      }, successDuration);
    },
    [successDuration],
  );

  async function press(action: ExpandingAction) {
    if (action.disabled || busy || done === action.id) return;
    onAction?.(action.id);
    let outcome: Outcome;
    try {
      const result = action.onPress?.();
      if (isPromise(result)) {
        setBusy(action.id);
        outcome = (await result) as Outcome;
      } else outcome = result as Outcome;
    } catch {
      outcome = false;
    } finally {
      if (alive.current) setBusy(null);
    }
    if (alive.current && outcome !== false && action.successLabel) confirm(action);
  }

  function onClick(action: ExpandingAction) {
    // Touch has no hover: the first tap opens the label, the second runs it.
    if (pointerType.current === "touch" && expanded !== action.id) {
      setTouched(action.id);
      return;
    }
    if (pointerType.current === "touch") setTouched(action.id);
    void press(action);
  }

  // Hover follows real movement only. Expanding moves the buttons, so a button that slides under a
  // resting pointer must not take over, or two neighbours could swap back and forth forever.
  function onPointerMove(event: PointerEvent<HTMLButtonElement>, id: string) {
    if (event.pointerType !== "mouse") return;
    const last = lastPoint.current;
    lastPoint.current = { x: event.clientX, y: event.clientY };
    if (last && Math.abs(last.x - event.clientX) < 1 && Math.abs(last.y - event.clientY) < 1)
      return;
    setHovered(id);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    keyboard.current = true;
    const buttons = Array.from(
      groupRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? [],
    );
    const at = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (at < 0) return;
    const rtl = groupRef.current ? getComputedStyle(groupRef.current).direction === "rtl" : false;
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    const last = buttons.length - 1;
    const next =
      event.key === forward
        ? at === last
          ? 0
          : at + 1
        : event.key === back
          ? at === 0
            ? last
            : at - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : -1;
    if (next < 0) return;
    event.preventDefault();
    buttons[next]?.focus();
  }

  return (
    <div
      ref={groupRef}
      role="toolbar"
      aria-orientation="horizontal"
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        keyboard.current = false;
        pointerType.current = e.pointerType;
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        lastPoint.current = null;
        setHovered(null);
      }}
      onBlur={(e) => {
        if (groupRef.current?.contains(e.relatedTarget as Node | null)) return;
        setFocused(null);
      }}
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-full p-1",
        surfaces[variant],
        className,
      )}
      {...props}
    >
      {actions.map((action) => {
        const isOpen = expanded === action.id;
        const showDone = done === action.id && Boolean(action.successLabel);
        return (
          <button
            key={action.id}
            type="button"
            tabIndex={tabStop === action.id ? 0 : -1}
            data-expanded={isOpen || undefined}
            data-variant={action.variant ?? "default"}
            data-tone={variant}
            aria-disabled={action.disabled || undefined}
            aria-busy={busy === action.id || undefined}
            onClick={() => onClick(action)}
            onPointerMove={(e) => onPointerMove(e, action.id)}
            onFocus={(event) => {
              // Keyboard focus expands the button; a mouse click or a tap already has its own path.
              // :focus-visible says which it was, and the keydown flag is the fallback where it is
              // not supported.
              let visible = keyboard.current;
              try {
                visible = event.currentTarget.matches(":focus-visible");
              } catch {
                /* older engines: keep the fallback */
              }
              setFocused(visible ? action.id : null);
            }}
            className={cn(
              "group inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full font-medium text-muted-foreground transition-[background-color,color] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none",
              sizes[size],
              "data-[expanded]:bg-primary data-[expanded]:text-primary-foreground",
              // Scoped to non-danger actions so a danger button keeps its own colour when open.
              "data-[tone=accent]:data-[variant=default]:data-[expanded]:bg-accent data-[tone=accent]:data-[variant=default]:data-[expanded]:text-accent-foreground",
              "data-[variant=danger]:text-danger data-[variant=danger]:data-[expanded]:bg-danger data-[variant=danger]:data-[expanded]:text-primary-foreground",
              "aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
              "aria-busy:cursor-progress",
            )}
          >
            <span
              aria-hidden="true"
              className="relative inline-flex size-4 shrink-0 items-center justify-center [&_svg]:size-4"
            >
              <span
                className={cn(
                  "absolute inset-0 inline-flex items-center justify-center transition-[opacity,transform,translate,scale,rotate] duration-[var(--duration-base)] ease-[var(--ease-out)] motion-reduce:transition-none",
                  showDone ? "scale-50 opacity-0" : "scale-100 opacity-100",
                )}
              >
                {action.icon}
              </span>
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "absolute inset-0 transition-[opacity,transform,translate,scale,rotate] duration-[var(--duration-base)] ease-[var(--ease-out)] motion-reduce:transition-none",
                  showDone ? "scale-100 opacity-100" : "scale-50 opacity-0",
                )}
              >
                <path d="M3.5 8.5l3 3 6-7" />
              </svg>
            </span>
            {/* The label opens by growing a grid column from 0fr to 1fr: no measuring needed. */}
            <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-[var(--duration-slow)] ease-[var(--ease-out)] group-data-[expanded]:grid-cols-[1fr] motion-reduce:transition-none">
              <span className="overflow-hidden whitespace-nowrap">
                {/* Both words share one cell, so the slot is as wide as the longer one and the swap never shifts layout. */}
                <span className="grid ps-2">
                  <span
                    aria-hidden={showDone || undefined}
                    className={cn(
                      "col-start-1 row-start-1 transition-opacity duration-[var(--duration-base)]",
                      showDone && "opacity-0",
                    )}
                  >
                    {action.label}
                  </span>
                  {action.successLabel ? (
                    <span
                      aria-hidden={!showDone || undefined}
                      className={cn(
                        "col-start-1 row-start-1 transition-opacity duration-[var(--duration-base)]",
                        !showDone && "opacity-0",
                      )}
                    >
                      {action.successLabel}
                    </span>
                  ) : null}
                </span>
              </span>
            </span>
          </button>
        );
      })}
      <span role="status" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}
