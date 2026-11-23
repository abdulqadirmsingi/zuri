import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { inputVariants } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface InputGroupProps
  extends Omit<ComponentProps<"div">, "children">,
    VariantProps<typeof inputVariants> {
  /** Content before the field: an icon, or a short prefix such as "+255". */
  start?: ReactNode;
  /** Content after the field: a unit such as "TZS", or a button such as clear or show. */
  end?: ReactNode;
  /** The field itself: an `Input`, or any native `<input>`. */
  children: ReactNode;
}

/**
 * Wraps an input with something on either side. The group draws the border and the focus ring,
 * and the input inside is made borderless, so the pieces read as one control.
 *
 * Icons in `start` and `end` should be hidden from assistive technology; a button there needs its
 * own accessible name. The input keeps its own label.
 */
export function InputGroup({
  start,
  end,
  variant,
  size,
  className,
  children,
  ...props
}: InputGroupProps) {
  return (
    <div
      className={cn(
        inputVariants({ variant, size }),
        "flex items-center gap-2 has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50 has-[input:focus-visible:not([aria-invalid=true])]:border-ring has-[input:focus-visible]:ring-4 has-[input:focus-visible]:ring-foreground/10 has-[[aria-invalid=true]]:border-danger",
        // The input inside gives up its own surface so the group's is the only one.
        "[&_input]:h-full [&_input]:min-h-0 [&_input]:flex-1 [&_input]:border-0 [&_input]:bg-transparent [&_input]:p-0 [&_input]:outline-none [&_input]:placeholder:text-muted-foreground",
        // A halo around a bare underline would look like a box, so that look gets the line only.
        variant === "underline" && "has-[input:focus-visible]:ring-0",
        className,
      )}
      {...props}
    >
      {start ? (
        <span className="flex shrink-0 items-center text-muted-foreground [&_svg]:size-4">
          {start}
        </span>
      ) : null}
      {children}
      {end ? (
        <span className="flex shrink-0 items-center text-muted-foreground [&_svg]:size-4">
          {end}
        </span>
      ) : null}
    </div>
  );
}
