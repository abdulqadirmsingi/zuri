import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-[background-color,transform,translate,scale,rotate,opacity] duration-[var(--duration-base)] ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-90",
        outline: "border border-border bg-background text-foreground hover:bg-muted",
        ghost: "text-foreground hover:bg-muted",
        glass: "zuri-glass text-foreground hover:opacity-90",
        destructive: "border border-border bg-background text-danger hover:bg-muted",
      },
      size: {
        sm: "min-h-8 rounded-md px-3 text-sm",
        md: "min-h-10 rounded-md px-4 text-sm",
        lg: "min-h-12 rounded-lg px-6 text-base",
        // Icon-only buttons are square and need an aria-label.
        "icon-sm": "size-8 rounded-md p-0",
        icon: "size-10 rounded-md p-0",
        "icon-lg": "size-12 rounded-lg p-0",
      },
      // Listed after size so tailwind-merge lets the pill radius win.
      shape: { default: "", pill: "rounded-full" },
    },
    defaultVariants: { variant: "default", size: "md", shape: "default" },
  },
);

export interface ButtonProps extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  /**
   * Shows a spinner and disables the button, which also blocks a double submit.
   * Pair it with a status message: `aria-busy` alone is not announced everywhere.
   */
  loading?: boolean;
}

/**
 * A native `<button>`; pass `type="submit"` explicitly when inside a form.
 * Icon-only sizes (`icon-sm`, `icon`, `icon-lg`) must be given an `aria-label`.
 */
export function Button({
  className,
  variant,
  size,
  shape,
  loading = false,
  disabled,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size, shape }), className)}
      {...props}
    >
      {loading ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="animate-spin motion-reduce:animate-pulse"
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      ) : null}
      {children}
    </button>
  );
}

export { buttonVariants };
