import { type ComponentProps, type ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

export interface RadioGroupProps extends Omit<ComponentProps<"fieldset">, "children"> {
  /** Visible question or group name. Required: it names the group for screen readers. */
  legend: ReactNode;
  /** Helper text under the options. */
  hint?: ReactNode;
  /** Error message. Announced to screen readers when it appears. */
  error?: ReactNode;
  /** Layout of the options. */
  orientation?: "vertical" | "horizontal";
  children: ReactNode;
}

/**
 * A native `<fieldset>` + `<legend>` around Radio inputs. Give every Radio the same `name`:
 * the browser then provides arrow-key navigation and single selection for free.
 * `disabled` on the group disables every option.
 */
export function RadioGroup({
  legend,
  hint,
  error,
  orientation = "vertical",
  className,
  children,
  ...props
}: RadioGroupProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset
      aria-describedby={describedBy}
      className={cn("flex min-w-0 flex-col gap-2 border-0 p-0", className)}
      {...props}
    >
      <legend className="mb-1 text-sm font-medium text-foreground">{legend}</legend>
      <div
        className={cn("flex gap-3", orientation === "vertical" ? "flex-col" : "flex-row flex-wrap")}
      >
        {children}
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
    </fieldset>
  );
}

export type RadioProps = Omit<ComponentProps<"input">, "type" | "size">;

/** A native radio, restyled. Wrap it in a `<label>` so the text names it and is clickable. */
export function Radio({ className, ...props }: RadioProps) {
  return (
    <span className="relative inline-flex size-6 shrink-0">
      <input
        type="radio"
        className={cn(
          "peer size-6 cursor-pointer appearance-none rounded-full border border-border bg-background transition-[background-color,border-color] duration-[var(--duration-base)] ease-[var(--ease-out)] checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
          className,
        )}
        {...props}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 m-auto hidden size-2 rounded-full bg-primary-foreground peer-checked:block"
      />
    </span>
  );
}
