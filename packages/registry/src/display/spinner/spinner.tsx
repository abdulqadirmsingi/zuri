import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const spinnerVariants = cva("inline-block", {
  variants: { size: { sm: "size-4", md: "size-6", lg: "size-10" } },
  defaultVariants: { size: "md" },
});

export interface SpinnerProps
  extends Omit<ComponentProps<"span">, "children">,
    VariantProps<typeof spinnerVariants> {
  /** Announced to screen readers. Describe what is loading, e.g. "Loading balance". */
  label?: string;
}

/** An indeterminate loading indicator. Under reduced motion it pulses instead of spinning. */
export function Spinner({ className, size, label = "Loading", ...props }: SpinnerProps) {
  return (
    <span role="status" className={cn(spinnerVariants({ size }), className)} {...props}>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="size-full animate-spin motion-reduce:animate-pulse"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export { spinnerVariants };
