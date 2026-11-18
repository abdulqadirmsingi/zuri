import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type CheckboxProps = Omit<ComponentProps<"input">, "type" | "size"> & {
  /** Marks the value as invalid for assistive technology and styles the border. */
  invalid?: boolean;
};

/**
 * A native checkbox, restyled. Wrap it in a `<label>` (or pair it with htmlFor) so it has a name.
 * The 24px box meets the WCAG 2.2 minimum target size on its own.
 */
export function Checkbox({ className, invalid, ...props }: CheckboxProps) {
  return (
    <span className="relative inline-flex size-6 shrink-0">
      <input
        type="checkbox"
        aria-invalid={invalid || props["aria-invalid"] || undefined}
        className={cn(
          "peer size-6 cursor-pointer appearance-none rounded-md border border-border bg-background transition-[background-color,border-color] duration-[var(--duration-base)] ease-[var(--ease-out)] checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger motion-reduce:transition-none",
          className,
        )}
        {...props}
      />
      {/* Sibling of the input so the checked state can show it without JavaScript. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute inset-0 m-auto hidden size-4 text-primary-foreground peer-checked:block"
      >
        <path d="M3.5 8.5l3 3 6-7" />
      </svg>
    </span>
  );
}
