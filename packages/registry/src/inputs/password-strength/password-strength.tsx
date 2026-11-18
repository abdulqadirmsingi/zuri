"use client";

import { type ComponentProps, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ scoring */

/** One requirement a password is checked against. */
export interface PasswordCheck {
  id: string;
  /** What the person sees, e.g. "At least 10 characters". */
  label: string;
  passes: (password: string) => boolean;
  /** For length-style checks: how many characters are still missing. Shown beside the label. */
  shortBy?: (password: string) => number;
}

export type StrengthWord = "tooShort" | "weak" | "fair" | "good" | "strong";

export interface PasswordScore {
  /** 0 for an empty password, then 1 to 4. */
  level: 0 | 1 | 2 | 3 | 4;
  word: StrengthWord | null;
  /** Ids of the checks that pass and fail. */
  passed: string[];
  failed: string[];
  tooShort: boolean;
  common: boolean;
}

/** Counts what a person sees as characters, so an emoji is one rather than two. */
export const countCharacters = (text: string) => Array.from(text).length;

/**
 * Checks that put length first, as current guidance (NIST SP 800-63B) does, with variety as a
 * supporting signal. Pass your own list, or use `makeChecks` to change the minimum length.
 */
export function makeChecks(minLength = 10): PasswordCheck[] {
  return [
    {
      id: "length",
      label: `At least ${minLength} characters`,
      passes: (p) => countCharacters(p) >= minLength,
      shortBy: (p) => Math.max(0, minLength - countCharacters(p)),
    },
    {
      id: "case",
      label: "Upper and lower case letters",
      passes: (p) => /\p{Ll}/u.test(p) && /\p{Lu}/u.test(p),
    },
    { id: "number", label: "A number", passes: (p) => /\p{N}/u.test(p) },
    { id: "symbol", label: "A symbol or a space", passes: (p) => /[^\p{L}\p{N}]/u.test(p) },
  ];
}

export const defaultChecks = makeChecks();

// Passwords everyone tries first. This is a tiny guard, not a breach database: check against a
// real breached-password service on the server as well.
const commonPasswords = new Set([
  "password",
  "passw0rd",
  "123456",
  "1234567",
  "12345678",
  "123456789",
  "1234567890",
  "qwerty",
  "qwerty123",
  "abc123",
  "111111",
  "000000",
  "123123",
  "1q2w3e4r",
  "letmein",
  "welcome",
  "admin",
  "iloveyou",
  "monkey",
  "dragon",
  "football",
]);

function isCommon(password: string): boolean {
  const lower = password.toLowerCase();
  // "Password123" and "password!" are the same weak password with a tail added.
  const stem = lower.replace(/[\d\p{P}\p{S}]+$/u, "");
  return commonPasswords.has(lower) || (stem.length >= 5 && commonPasswords.has(stem));
}

export interface ScoreOptions {
  /** Under this many characters the level stays at 1 however varied it is. Defaults to 8. */
  shortLength?: number;
}

/**
 * Scores a password on the device; nothing is sent anywhere. The level follows the share of
 * checks passed, then is capped for passwords that are too short, on a common-password list,
 * or made from fewer than five distinct characters ("aaaaaaaaaaaa", "ababababab1!").
 */
export function scorePassword(
  password: string,
  checks: PasswordCheck[] = defaultChecks,
  { shortLength = 8 }: ScoreOptions = {},
): PasswordScore {
  const passed = checks.filter((c) => c.passes(password)).map((c) => c.id);
  const failed = checks.filter((c) => !passed.includes(c.id)).map((c) => c.id);
  if (!password) {
    return { level: 0, word: null, passed, failed, tooShort: false, common: false };
  }
  const tooShort = countCharacters(password) < shortLength;
  const common = isCommon(password);
  const repetitive = new Set(Array.from(password)).size < 5;
  let level = Math.min(
    4,
    Math.max(1, Math.round((passed.length / Math.max(checks.length, 1)) * 4)),
  );
  if (tooShort || common) level = 1;
  else if (repetitive) level = Math.min(level, 2);
  const words: StrengthWord[] = ["weak", "fair", "good", "strong"];
  return {
    level: level as 1 | 2 | 3 | 4,
    word: tooShort ? "tooShort" : (words[level - 1] ?? "weak"),
    passed,
    failed,
    tooShort,
    common,
  };
}

/* ----------------------------------------------------------------- messages */

/** Every piece of text the component writes. Pass only the ones you want to change. */
export interface PasswordStrengthMessages {
  words: Record<StrengthWord, string>;
  /** Name of the show/hide button. It is a pressed toggle, so the name stays the same. */
  showPassword: string;
  meterLabel: string;
  /** The meter's value text while the field is empty. */
  empty: string;
  checksLabel: string;
  /** Read after each requirement's label by screen readers. */
  met: string;
  notMet: string;
  /** Beside a length requirement, e.g. "3 more". */
  remaining: (count: number) => string;
  commonWarning: string;
  /** The polite announcement made after typing pauses. */
  summary: (info: { word: string; met: number; total: number }) => string;
}

export const defaultMessages: PasswordStrengthMessages = {
  words: {
    tooShort: "Too short",
    weak: "Weak",
    fair: "Fair",
    good: "Good",
    strong: "Strong",
  },
  showPassword: "Show password",
  meterLabel: "Password strength",
  empty: "No password yet",
  checksLabel: "Password requirements",
  met: "met",
  notMet: "not met",
  remaining: (n) => `${n} more`,
  commonWarning: "This is a very common password.",
  summary: ({ word, met, total }) => `Strength: ${word}. ${met} of ${total} requirements met.`,
};

/* ---------------------------------------------------------------- component */

export interface PasswordStrengthProps
  extends Omit<ComponentProps<"input">, "type" | "value" | "defaultValue" | "size" | "children"> {
  /** Visible label. Required: every field needs one. */
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, score: PasswordScore) => void;
  /** The requirements to check. Defaults to `defaultChecks`. */
  checks?: PasswordCheck[];
  /** Helper text under the field. */
  hint?: ReactNode;
  /** Error text. Announced when it appears, and the field shakes once. */
  error?: ReactNode;
  /** Whether the text is shown. Controlled; leave out to let the component manage it. */
  revealed?: boolean;
  onRevealedChange?: (revealed: boolean) => void;
  messages?: Partial<Omit<PasswordStrengthMessages, "words">> & {
    words?: Partial<PasswordStrengthMessages["words"]>;
  };
  /** Passed to `scorePassword`. */
  shortLength?: number;
  /** Applied to the outer wrapper. Other props go to the input. */
  className?: string;
}

const levelTone: Record<number, string> = {
  1: "bg-danger",
  2: "bg-warning",
  3: "bg-success",
  4: "bg-success",
};

/**
 * A "new password" field that shows how strong the password is while it is typed. Use it when
 * creating or changing a password, never for signing in. The text is scored on the device.
 */
export function PasswordStrength({
  label,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onChange,
  checks = defaultChecks,
  hint,
  error,
  revealed: revealedProp,
  onRevealedChange,
  messages: messagesProp,
  shortLength,
  className,
  id: idProp,
  ...inputProps
}: PasswordStrengthProps) {
  const messages: PasswordStrengthMessages = {
    ...defaultMessages,
    ...messagesProp,
    words: { ...defaultMessages.words, ...messagesProp?.words },
  };
  const uid = useId();
  const id = idProp ?? uid;
  const [inner, setInner] = useState(defaultValue);
  const [innerRevealed, setInnerRevealed] = useState(false);
  const value = valueProp ?? inner;
  const revealed = revealedProp ?? innerRevealed;
  const score = scorePassword(value, checks, { shortLength });
  const word = score.word ? messages.words[score.word] : "";
  const passedCount = score.passed.length;

  // Announce after typing pauses, so a screen reader is not interrupted on every keystroke.
  const [announcement, setAnnouncement] = useState("");
  useEffect(() => {
    if (!value) return setAnnouncement("");
    const t = setTimeout(
      () => setAnnouncement(messages.summary({ word, met: passedCount, total: checks.length })),
      700,
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line: messages.summary is stable enough; re-announce only on real change.
  }, [value, word, passedCount, checks.length, messages.summary]);

  // A refused field shakes once each time a new error appears.
  const shellRef = useRef<HTMLDivElement>(null);
  const lastError = useRef<ReactNode>(undefined);
  useEffect(() => {
    if (error && error !== lastError.current) {
      const el = shellRef.current;
      el?.setAttribute("data-shake", "");
      const stop = () => el?.removeAttribute("data-shake");
      el?.addEventListener("animationend", stop, { once: true });
    }
    lastError.current = error;
  }, [error]);

  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const checksId = `${id}-checks`;
  const describedBy = [inputProps["aria-describedby"], hintId, errorId, checksId]
    .filter(Boolean)
    .join(" ");

  function toggle() {
    if (revealedProp === undefined) setInnerRevealed(!revealed);
    onRevealedChange?.(!revealed);
  }

  return (
    <div className={cn("flex w-full max-w-sm flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-medium leading-none text-foreground">
        {label}
      </label>

      <div
        ref={shellRef}
        className="relative data-[shake]:animate-[zuri-shake_var(--duration-slow)_var(--ease-out)]"
      >
        <Input
          autoComplete="new-password"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          {...inputProps}
          id={id}
          type={revealed ? "text" : "password"}
          value={value}
          invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className="pe-12"
          onChange={(event) => {
            const next = event.target.value;
            if (valueProp === undefined) setInner(next);
            onChange?.(event);
            onValueChange?.(next, scorePassword(next, checks, { shortLength }));
          }}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute end-1.5 top-1/2 -translate-y-1/2"
          aria-label={messages.showPassword}
          aria-pressed={revealed}
          aria-controls={id}
          onClick={toggle}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0" />
            <circle cx="12" cy="12" r="3" />
            {/* The slash draws across the eye when the text is shown. */}
            <path
              d="M3 3l18 18"
              pathLength={1}
              className={cn(
                "[stroke-dasharray:1] transition-[stroke-dashoffset] duration-[var(--duration-base)] ease-[var(--ease-out)] motion-reduce:transition-none",
                revealed ? "[stroke-dashoffset:0]" : "[stroke-dashoffset:1]",
              )}
            />
          </svg>
        </Button>
      </div>

      {hint ? (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        {/* biome-ignore lint/a11y/useSemanticElements: four drawn segments cannot be a native <meter>. */}
        <div
          role="meter"
          aria-label={messages.meterLabel}
          aria-valuemin={0}
          aria-valuemax={4}
          aria-valuenow={score.level}
          aria-valuetext={word || messages.empty}
          className="grid flex-1 grid-cols-4 gap-1.5"
        >
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="h-1.5 overflow-hidden rounded-full bg-muted">
              <span
                className={cn(
                  "block h-full origin-left scale-x-0 rounded-full transition-[transform,background-color] duration-[var(--duration-slow)] ease-[var(--ease-out)] rtl:origin-right motion-reduce:transition-none",
                  i < score.level && cn("scale-x-100", levelTone[score.level]),
                )}
                // A short wave: each segment starts a little after the one before it.
                style={{ transitionDelay: `calc(var(--duration-fast) * ${i} / 3)` }}
              />
            </span>
          ))}
        </div>
        {/* The meter already carries this text; hiding the word avoids reading it twice. */}
        <span aria-hidden="true" className="min-w-16 text-end text-sm font-medium tabular-nums">
          {word ? (
            <span
              key={word}
              className="inline-block animate-[zuri-rise_var(--duration-base)_var(--ease-out)]"
            >
              {word}
            </span>
          ) : null}
        </span>
      </div>

      <ul
        id={checksId}
        aria-label={messages.checksLabel}
        className="m-0 flex list-none flex-col gap-1 p-0"
      >
        {checks.map((check) => {
          const ok = score.passed.includes(check.id);
          const short = value && !ok ? (check.shortBy?.(value) ?? 0) : 0;
          return (
            <li
              key={check.id}
              data-met={ok || undefined}
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-[var(--duration-base)] data-[met]:text-foreground motion-reduce:transition-none"
            >
              <span
                aria-hidden="true"
                className="inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-control-border text-success transition-colors duration-[var(--duration-base)] [li[data-met]_&]:border-success motion-reduce:transition-none"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-3"
                >
                  <path
                    d="M4 8.5l3 3 5-6"
                    pathLength={1}
                    className={cn(
                      "[stroke-dasharray:1] transition-[stroke-dashoffset] duration-[var(--duration-base)] ease-[var(--ease-out)] motion-reduce:transition-none",
                      ok ? "[stroke-dashoffset:0]" : "[stroke-dashoffset:1]",
                    )}
                  />
                </svg>
              </span>
              <span>
                {check.label}
                <span className="sr-only">, {ok ? messages.met : messages.notMet}</span>
              </span>
              {short > 0 ? (
                <span aria-hidden="true" className="ms-auto tabular-nums text-xs">
                  {messages.remaining(short)}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>

      {score.common ? <p className="text-sm text-warning">{messages.commonWarning}</p> : null}

      <span role="status" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}
