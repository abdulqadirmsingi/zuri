import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { inputVariants } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface InputGroupProps
  extends Omit<ComponentProps<"div">, "children">,
    Omit<VariantProps<typeof inputVariants>, "halo"> {
  /** The soft grey glow around the group while its input has focus. Defaults to true. */
  halo?: boolean;
  start?: ReactNode;
  end?: ReactNode;
  children: ReactNode;
}

export function InputGroup({
  start,
  end,
  variant,
  size,
  halo = true,
  className,
  children,
  ...props
}: InputGroupProps) {
  return (
    <div
      className={cn(
        inputVariants({ variant, size, halo: false }),
        "flex items-center gap-2 has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50 has-[input:focus-visible:not([aria-invalid=true])]:border-ring has-[[aria-invalid=true]]:border-danger has-[[aria-invalid=true]]:animate-[zuri-shake_var(--duration-slow)_var(--ease-out)] motion-reduce:animate-none [&_input]:aria-[invalid=true]:animate-none",
        "[&_input]:h-full [&_input]:min-h-0 [&_input]:flex-1 [&_input]:border-0 [&_input]:bg-transparent [&_input]:p-0 [&_input]:outline-none [&_input]:focus-visible:border-transparent [&_input]:focus-visible:ring-0 [&_input]:placeholder:text-muted-foreground",
        halo &&
          variant !== "underline" &&
          "has-[input:focus-visible]:ring-4 has-[input:focus-visible]:ring-foreground/10",
        className,
      )}
      {...props}
    >
      {start ? (
        <span className="flex shrink-0 items-center self-stretch text-muted-foreground [&_svg]:size-4">
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
