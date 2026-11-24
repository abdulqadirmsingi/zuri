import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { inputVariants } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface InputGroupProps
  extends Omit<ComponentProps<"div">, "children">,
    VariantProps<typeof inputVariants> {
  start?: ReactNode;
  end?: ReactNode;
  children: ReactNode;
}

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
        "[&_input]:h-full [&_input]:min-h-0 [&_input]:flex-1 [&_input]:border-0 [&_input]:bg-transparent [&_input]:p-0 [&_input]:outline-none [&_input]:focus-visible:border-transparent [&_input]:focus-visible:ring-0 [&_input]:placeholder:text-muted-foreground",
        variant === "underline" && "has-[input:focus-visible]:ring-0",
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
