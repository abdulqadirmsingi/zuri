import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const selectVariants = cva(
  "w-full min-w-0 cursor-pointer appearance-none border pe-9 text-foreground transition-[border-color,background-color] duration-[var(--duration-base)] ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default: "border-border bg-background",
        glass: "zuri-glass",
      },
      size: {
        sm: "min-h-8 rounded-md ps-3 text-sm",
        md: "min-h-10 rounded-md ps-3 text-sm",
        lg: "min-h-12 rounded-lg ps-4 text-base",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface SelectProps
  extends Omit<ComponentProps<"select">, "size">,
    VariantProps<typeof selectVariants> {
  /** Marks the value as invalid for assistive technology and styles the border. */
  invalid?: boolean;
}

/**
 * A native `<select>` with a custom chevron. The native control keeps the platform's picker,
 * which is the best experience on phones. Pair it with a label (see Field).
 */
export function Select({ className, variant, size, invalid, children, ...props }: SelectProps) {
  return (
    <span className="relative inline-flex w-full">
      <select
        aria-invalid={invalid || props["aria-invalid"] || undefined}
        className={cn(selectVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      >
        <path d="M4 6l4 4 4-4" />
      </svg>
    </span>
  );
}

export { selectVariants };
