"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

type CopyState = "idle" | "copied" | "failed";

export interface CopyButtonProps extends Omit<ButtonProps, "onClick" | "children" | "loading"> {
  /** The text to put on the clipboard. */
  value: string;
  /** Label before copying. Also the accessible name in icon-only mode. Defaults to "Copy". */
  label?: string;
  copiedLabel?: string;
  failedLabel?: string;
  /** Show only the icon. The label becomes the accessible name. */
  iconOnly?: boolean;
  /** How long the "Copied" feedback stays, in milliseconds. Defaults to 2000. */
  resetAfter?: number;
  /** Called after a successful copy. */
  onCopied?: (value: string) => void;
  children?: ReactNode;
}

const icon = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * Copies `value` to the clipboard and tells the user, visually and through a live region.
 * The clipboard needs a secure context (HTTPS or localhost) and a user gesture; when it is
 * unavailable the button reports "Copy failed" instead of pretending it worked.
 */
export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  failedLabel = "Copy failed",
  iconOnly = false,
  resetAfter = 2000,
  onCopied,
  size,
  variant = "outline",
  ...props
}: CopyButtonProps) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
      onCopied?.(value);
    } catch {
      setState("failed");
    }
    timer.current = setTimeout(() => setState("idle"), resetAfter);
  }

  const text = state === "copied" ? copiedLabel : state === "failed" ? failedLabel : label;
  return (
    <>
      <Button
        variant={variant}
        size={iconOnly ? (size ?? "icon") : size}
        // Icon-only: the label is the name and does not change; the live region reports the result.
        aria-label={iconOnly ? label : undefined}
        onClick={copy}
        {...props}
      >
        {state === "copied" ? (
          <svg aria-hidden="true" {...icon}>
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        ) : (
          <svg aria-hidden="true" {...icon}>
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V6a2 2 0 0 1 2-2h9" />
          </svg>
        )}
        {iconOnly ? null : text}
      </Button>
      {/* Always mounted so screen readers pick up the change when its text appears. */}
      <span role="status" className="sr-only">
        {state === "idle" ? "" : text}
      </span>
    </>
  );
}
