"use client";

import {
  type ChangeEvent,
  type ComponentProps,
  type CSSProperties,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type Phase = "type" | "check" | "ok" | "no";

export interface OtpMessages {
  /** Spoken while a full code is being checked. */
  checking: string;
  /** Spoken, and shown in the capsule, when the code was right. */
  verified: string;
  /** Spoken when the code was wrong. */
  failed: string;
  /** The field's name once verified, telling people they can press to start again. */
  reopen: string;
}

export interface OtpInputProps
  extends Omit<
    ComponentProps<"input">,
    "value" | "defaultValue" | "onChange" | "type" | "size" | "maxLength" | "children"
  > {
  /** How many digits, from 3 to 8. Defaults to 6. */
  length?: number;
  /**
   * Checks a full code. Resolve `true` and the cells fuse into a "Verified" capsule; resolve `false`
   * (or reject) and the row shakes and clears. While it runs the cells breathe. Leave it out to
   * handle the code yourself with `onComplete`.
   */
  verify?: (code: string) => Promise<boolean>;
  /** Called with the digits as soon as the row is full, before `verify` runs. */
  onComplete?: (code: string) => void;
  onVerified?: (code: string) => void;
  onFailed?: (code: string) => void;
  /** Marks the code as wrong from outside: danger colour and one shake. */
  invalid?: boolean;
  size?: "sm" | "md" | "lg";
  /** "soft" is a muted cell; "accent" fills the cells with saffron. */
  tone?: "soft" | "accent";
  /** On success, cells merge into a capsule (true), or stay and show a green outline (false). */
  fuse?: boolean;
  /** Words for the capsule and for screen readers. */
  messages?: Partial<OtpMessages>;
  /** Names the field. Pass null when a visible label is attached with `id`. Defaults to "N-digit code". */
  label?: string | null;
  /** Classes for the outer wrapper. */
  className?: string;
}

const defaults: OtpMessages = {
  checking: "Checking the code",
  verified: "Verified",
  failed: "That code was not right. Try again.",
  reopen: "Verified. Press to enter a new code",
};

// Cell width and the row's height per size. Widths shrink on a narrow screen: the row never
// overflows, because the tracks below are allowed to get smaller than this.
const sizes = {
  sm: "h-10 [--zuri-otp-w:2rem] [--zuri-otp-gap:0.375rem] text-base",
  md: "h-12 [--zuri-otp-w:2.5rem] [--zuri-otp-gap:0.5rem] text-xl",
  lg: "h-14 [--zuri-otp-w:3rem] [--zuri-otp-gap:0.625rem] text-2xl",
} as const;

// The same grid draws the cells and the digits, so they always line up.
const track =
  "grid gap-[var(--zuri-otp-gap)] [grid-template-columns:repeat(var(--zuri-otp-n),minmax(0,var(--zuri-otp-w)))]";

const reduced = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const tick = (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4 shrink-0"
  >
    <path d="M3.5 8.5l3 3 6-7" />
  </svg>
);

/**
 * A one-time code field. One real input sits invisibly over a row of drawn cells, so paste,
 * autofill from a text message, backspace and screen readers all work as they do for any input.
 * Digits rise into their cells, a full code is checked with `verify`, and the answer is shown:
 * the cells fuse into a "Verified" capsule, or the row shakes and its digits drain away.
 *
 * The movement is CSS, timed from the motion tokens, so it is nearly instant for people who ask
 * for reduced motion. It never stores or sends the code: `verify` is yours.
 */
export function OtpInput({
  length = 6,
  verify,
  onComplete,
  onVerified,
  onFailed,
  invalid,
  size = "md",
  tone = "soft",
  fuse = true,
  messages,
  label,
  disabled,
  className,
  ref,
  onFocus,
  onBlur,
  onPointerDown,
  ...rest
}: OtpInputProps) {
  const n = Math.min(8, Math.max(3, Math.round(length)));
  const text = { ...defaults, ...messages };
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<Phase>("type");
  const [focused, setFocused] = useState(false);
  const [from, setFrom] = useState(0);
  const input = useRef<HTMLInputElement | null>(null);
  const timers = useRef<number[]>([]);
  const run = useRef(0);
  // A fresh id for the filter, because two rows on one page must not share one.
  const gooId = `otp-goo-${useId().replace(/:/g, "")}`;

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  useEffect(
    () => () => {
      run.current++;
      for (const t of timers.current) window.clearTimeout(t);
    },
    [],
  );
  // A row whose length changes starts over.
  // biome-ignore lint/correctness/useExhaustiveDependencies: only the length matters here.
  useEffect(() => {
    setCode("");
    setPhase("type");
  }, [n]);

  function finish(ok: boolean, value: string) {
    if (ok) {
      setPhase("ok");
      input.current?.blur();
      onVerified?.(value);
      return;
    }
    setPhase("no");
    onFailed?.(value);
    // Wait for the shake and for the digits to drain, then start over.
    later(
      () => {
        setCode("");
        setPhase("type");
        input.current?.focus();
      },
      reduced() ? 400 : 250 + n * 45 + 450,
    );
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    if (phase !== "type") return;
    const next = event.target.value.replace(/\D/g, "").slice(0, n);
    // A paste lands several digits at once; the new ones are staggered along the row.
    setFrom(code.length);
    setCode(next);
    if (next.length < n) return;
    onComplete?.(next);
    if (!verify) return;
    setPhase("check");
    const id = ++run.current;
    later(
      () => {
        verify(next).then(
          (ok) => run.current === id && finish(ok, next),
          () => run.current === id && finish(false, next),
        );
      },
      reduced() ? 0 : 420,
    );
  }

  function reopen() {
    run.current++;
    setCode("");
    setPhase("type");
    input.current?.focus();
  }

  const bad = invalid || phase === "no";
  const ok = phase === "ok";
  const fused = ok && fuse;
  const active = Math.min(code.length, n - 1);
  const accent = tone === "accent";
  const status =
    phase === "check" ? text.checking : ok ? text.verified : phase === "no" ? text.failed : "";

  return (
    <div
      className={cn("relative w-full max-w-full", className)}
      data-phase={phase}
      style={{ "--zuri-otp-n": n } as CSSProperties}
    >
      <div
        data-invalid={bad || undefined}
        className={cn(
          "relative w-full max-w-[calc(var(--zuri-otp-n)*var(--zuri-otp-w)+(var(--zuri-otp-n)-1)*var(--zuri-otp-gap))] data-[invalid]:animate-[zuri-shake_var(--duration-slow)_var(--ease-out)] motion-reduce:data-[invalid]:animate-none",
          sizes[size],
        )}
      >
        {/* The cells and the capsule share one colour, so the filter can fuse them. */}
        <div
          aria-hidden="true"
          className={cn("absolute inset-0 motion-reduce:[filter:none]", track)}
          style={
            {
              "--zuri-otp-goo": `url(#${gooId})`,
              filter: fused ? "var(--zuri-otp-goo)" : undefined,
            } as CSSProperties
          }
        >
          {Array.from({ length: n }, (_, i) => (
            <span
              // The row is fixed, so the index is a stable key.
              // biome-ignore lint/suspicious/noArrayIndexKey: static cells
              key={i}
              className={cn(
                "rounded-xl transition-[translate,opacity,box-shadow] duration-[var(--duration-slow)] ease-[var(--ease-out)] motion-reduce:transition-none",
                accent ? "bg-accent" : "bg-muted",
                bad && "shadow-[inset_0_0_0_1.5px_var(--danger)]",
                ok && !fuse && "shadow-[inset_0_0_0_1.5px_var(--success)]",
                fused && "opacity-0 delay-[var(--duration-slow)]",
                phase === "check" &&
                  "animate-[zuri-otp-breathe_calc(var(--duration-slow)*3)_ease-in-out_infinite] motion-reduce:animate-none",
              )}
              style={{
                translate: fused
                  ? `calc((100% + var(--zuri-otp-gap)) * ${(n - 1) / 2 - i})`
                  : undefined,
                animationDelay: phase === "check" ? `${i * 70}ms` : undefined,
              }}
            />
          ))}
          <span
            className={cn(
              "absolute inset-y-0 start-1/2 w-[min(8.5rem,100%)] -translate-x-1/2 rounded-full transition-[scale] delay-[calc(var(--duration-slow)*0.4)] duration-[var(--duration-slow)] ease-[var(--ease-out)] motion-reduce:transition-none",
              accent ? "bg-accent" : "bg-muted",
              fused ? "scale-100" : "scale-0",
            )}
          />
        </div>

        {/* The digits, on the same grid. They leave before the cells merge. */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 font-medium tabular-nums transition-opacity duration-[var(--duration-base)] motion-reduce:transition-none",
            track,
            accent ? "text-accent-foreground" : "text-foreground",
            bad && "text-danger",
            fused && "opacity-0",
          )}
        >
          {Array.from({ length: n }, (_, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: static cells
              key={i}
              className="grid place-items-center"
            >
              {code[i] ? (
                <span
                  // A new digit in a cell restarts its entrance, so the digit is part of the key.
                  // biome-ignore lint/suspicious/noArrayIndexKey: the cell index is the position
                  key={`${i}-${code[i]}`}
                  className={cn(
                    phase === "no"
                      ? "animate-[zuri-otp-out_var(--duration-slow)_var(--ease-out)_both] motion-reduce:animate-none"
                      : "animate-[zuri-otp-in_var(--duration-slow)_var(--ease-out)_both] motion-reduce:animate-none",
                  )}
                  style={{
                    animationDelay:
                      phase === "no"
                        ? `${250 + (n - 1 - i) * 45}ms`
                        : i >= from
                          ? `${(i - from) * 45}ms`
                          : undefined,
                  }}
                >
                  {code[i]}
                </span>
              ) : null}
            </span>
          ))}
        </div>

        {/* The caret and a frame around the cell that takes the next digit: the visible focus. */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 start-0 w-[calc((100%-var(--zuri-otp-gap)*(var(--zuri-otp-n)-1))/var(--zuri-otp-n))] transition-[translate,opacity] duration-[var(--duration-base)] ease-[var(--ease-out)] motion-reduce:transition-none",
            focused && phase === "type" ? "opacity-100" : "opacity-0",
          )}
          style={{ translate: `calc((100% + var(--zuri-otp-gap)) * ${active})` }}
        >
          <span className="absolute inset-0 rounded-xl border-2 border-foreground" />
          {code.length < n ? (
            <span className="absolute inset-y-[28%] start-1/2 w-0.5 -translate-x-1/2 rounded-full bg-foreground motion-safe:animate-pulse" />
          ) : null}
        </div>

        {/* What the capsule says. */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 flex items-center justify-center gap-2 text-sm font-medium transition-opacity duration-[var(--duration-slow)] motion-reduce:transition-none",
            accent ? "text-accent-foreground" : "text-foreground",
            fused ? "opacity-100 delay-[calc(var(--duration-slow)*0.8)]" : "opacity-0",
          )}
        >
          {tick}
          {text.verified}
        </span>

        <input
          {...rest}
          ref={(node) => {
            input.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          value={code}
          onChange={onChange}
          onFocus={(e) => {
            onFocus?.(e);
            setFocused(true);
          }}
          onBlur={(e) => {
            onBlur?.(e);
            setFocused(false);
          }}
          onPointerDown={(e) => {
            onPointerDown?.(e);
            // A verified row is a button: pressing it starts over.
            if (ok) {
              e.preventDefault();
              reopen();
            }
          }}
          disabled={disabled}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={n}
          spellCheck={false}
          // Once verified the field is a button that starts over, whatever label it had.
          aria-label={ok ? text.reopen : label === null ? undefined : (label ?? `${n}-digit code`)}
          aria-invalid={bad || undefined}
          // A code box is not a login: keep password managers' badges out of it.
          data-1p-ignore
          data-lpignore="true"
          data-bwignore
          data-form-type="other"
          className={cn(
            "absolute inset-0 size-full rounded-xl border-0 bg-transparent p-0 text-base opacity-0 caret-transparent outline-none",
            ok ? "cursor-pointer" : "cursor-text",
            disabled && "cursor-not-allowed",
          )}
        />
      </div>
      <span role="status" className="sr-only">
        {status}
      </span>
      {/* The filter that joins the cells. It holds nothing visible. */}
      <svg aria-hidden="true" focusable="false" className="absolute size-0 overflow-hidden">
        <defs>
          <filter
            id={gooId}
            x="-20%"
            y="-50%"
            width="140%"
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -12"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
