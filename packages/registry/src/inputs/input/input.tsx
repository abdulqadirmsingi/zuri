import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "w-full min-w-0 border text-foreground placeholder:text-muted-foreground transition-[border-color,background-color] duration-[var(--duration-base)] ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default: "border-border bg-background",
        glass: "zuri-glass",
      },
      size: {
        sm: "min-h-8 rounded-md px-3 text-sm",
        md: "min-h-10 rounded-md px-3 text-sm",
        lg: "min-h-12 rounded-lg px-4 text-base",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface InputProps
  extends Omit<ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  /** Marks the value as invalid for assistive technology and styles the border. */
  invalid?: boolean;
}

/** A native `<input>`. Pair it with a label (see Field) so it has an accessible name. */
export function Input({ className, variant, size, invalid, type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      aria-invalid={invalid || props["aria-invalid"] || undefined}
      className={cn(inputVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { inputVariants };
