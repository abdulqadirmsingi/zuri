import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type SwitchProps = Omit<ComponentProps<"input">, "type" | "size" | "role">;

/**
 * A native checkbox exposed as `role="switch"`. Use it for settings that apply immediately;
 * use a Checkbox when the choice is submitted later with a form.
 */
export function Switch({ className, ...props }: SwitchProps) {
  return (
    <span className="relative inline-flex h-6 w-11 shrink-0">
      <input
        type="checkbox"
        // biome-ignore lint/a11y/useAriaPropsForRole: a native checkbox exposes its checked state itself; aria-checked would duplicate it.
        role="switch"
        className={cn(
          "peer h-6 w-11 cursor-pointer appearance-none rounded-full border border-control-border bg-muted transition-[background-color,border-color] duration-[var(--duration-base)] ease-[var(--ease-out)] checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
          className,
        )}
        {...props}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute start-0.5 top-0.5 size-5 rounded-full bg-muted-foreground transition-[transform,background-color] duration-[var(--duration-base)] ease-[var(--ease-out)] peer-checked:translate-x-5 peer-checked:bg-primary-foreground rtl:peer-checked:-translate-x-5 motion-reduce:transition-none"
      />
    </span>
  );
}
