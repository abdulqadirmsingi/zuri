import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "w-full min-w-0 border text-foreground placeholder:text-muted-foreground transition-[border-color,background-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out)] focus-visible:border-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger aria-[invalid=true]:focus-visible:border-danger aria-[invalid=true]:animate-[zuri-shake_var(--duration-slow)_var(--ease-out)] motion-reduce:animate-none motion-reduce:transition-none",
  {
    variants: {
      // The soft grey glow around a focused field. Off for people who prefer just the border.
      halo: {
        true: "focus-visible:ring-4 focus-visible:ring-foreground/10",
        false: "",
      },
      variant: {
        default: "border-control-border bg-background",
        // A filled field with no visible border, for calm forms.
        soft: "border-transparent bg-muted",
        // Only a line underneath, for minimal and inline forms.
        underline: "border-0 border-b border-control-border bg-transparent",
        glass: "zuri-glass",
      },
      size: {
        sm: "min-h-8 rounded-md px-3 text-sm",
        md: "min-h-10 rounded-md px-3 text-sm",
        lg: "min-h-12 rounded-lg px-4 text-base",
      },
    },
    // After the sizes, so the square corners and flush padding win over each size's own.
    compoundVariants: [{ variant: "underline", class: "rounded-none px-0 focus-visible:ring-0" }],
    defaultVariants: { variant: "default", size: "md", halo: true },
  },
);

export interface InputProps
  extends Omit<ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  /** Marks the value as invalid for assistive technology and styles the border. */
  invalid?: boolean;
}

/** A native `<input>`. Pair it with a label (see Field) so it has an accessible name. */
export function Input({
  className,
  variant,
  size,
  halo,
  invalid,
  type = "text",
  ...props
}: InputProps) {
  return (
    <input
      type={type}
      aria-invalid={invalid || props["aria-invalid"] || undefined}
      className={cn(inputVariants({ variant, size, halo }), className)}
      {...props}
    />
  );
}

export { inputVariants };
