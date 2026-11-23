import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const labelVariants = cva("font-medium", {
  variants: {
    variant: {
      default: "text-foreground",
      // Small capitals in the mono face, for dense forms and settings screens.
      caps: "font-mono uppercase tracking-wider text-foreground",
      muted: "text-muted-foreground",
    },
    size: {
      sm: "text-xs leading-none",
      md: "text-sm leading-none",
      lg: "text-base leading-tight",
    },
  },
  defaultVariants: { variant: "default", size: "md" },
});

export interface LabelProps extends ComponentProps<"label">, VariantProps<typeof labelVariants> {
  /**
   * Adds a red asterisk. It is decorative: put `required` on the control itself so assistive
   * technology hears it. Wins over `optional` if both are set.
   */
  required?: boolean;
  /** Adds "(optional)" after the text. It is part of the label, so it is read out too. */
  optional?: boolean;
}

/** A native `<label>`; associate it with a control via `htmlFor`, or wrap the control. */
export function Label({
  className,
  variant,
  size,
  required,
  optional,
  children,
  ...props
}: LabelProps) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: association is the caller's job (htmlFor or nesting).
    <label className={cn(labelVariants({ variant, size }), className)} {...props}>
      {children}
      {required ? (
        <span aria-hidden="true" className="ms-0.5 text-danger">
          *
        </span>
      ) : optional ? (
        // A real space, not only margin, so the spoken name reads "Nickname (optional)".
        <>
          {" "}
          <span className="font-normal normal-case tracking-normal text-muted-foreground">
            (optional)
          </span>
        </>
      ) : null}
    </label>
  );
}

export { labelVariants };
