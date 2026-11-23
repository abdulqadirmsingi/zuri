import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "w-full min-w-0 min-h-20 resize-y border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,background-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out)] focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-foreground/10 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger aria-[invalid=true]:focus-visible:border-danger motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default: "rounded-md border-control-border bg-background",
        glass: "rounded-md zuri-glass",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface TextareaProps
  extends ComponentProps<"textarea">,
    VariantProps<typeof textareaVariants> {
  /** Marks the value as invalid for assistive technology and styles the border. */
  invalid?: boolean;
}

/** A native `<textarea>`. Pair it with a label (see Field) so it has an accessible name. */
export function Textarea({ className, variant, invalid, ...props }: TextareaProps) {
  return (
    <textarea
      aria-invalid={invalid || props["aria-invalid"] || undefined}
      className={cn(textareaVariants({ variant }), className)}
      {...props}
    />
  );
}

export { textareaVariants };
