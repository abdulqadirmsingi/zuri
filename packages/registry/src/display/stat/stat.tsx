import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const changeVariants = cva("inline-flex items-center gap-1 text-sm font-medium", {
  variants: {
    trend: { up: "text-success", down: "text-danger", neutral: "text-muted-foreground" },
  },
  defaultVariants: { trend: "neutral" },
});

const arrows = { up: "↑", down: "↓", neutral: "→" } as const;
const words = { up: "Increase of", down: "Decrease of", neutral: "No change:" } as const;

export interface StatProps
  extends Omit<ComponentProps<"dl">, "children">,
    VariantProps<typeof changeVariants> {
  /** What is being measured, e.g. "Revenue". */
  label: ReactNode;
  /** The figure, already formatted. For money use Intl.NumberFormat with an explicit currency. */
  value: ReactNode;
  /** The change, already formatted, e.g. "12%". */
  change?: ReactNode;
  /** Context for the change, e.g. "vs last month". */
  changeLabel?: ReactNode;
}

/**
 * A single key figure. It is a description list (label, value, change), which screen readers
 * read in order. The change always has an arrow and a hidden word, never colour alone.
 */
export function Stat({
  label,
  value,
  change,
  changeLabel,
  trend = "neutral",
  className,
  ...props
}: StatProps) {
  const t = trend ?? "neutral";
  return (
    <dl className={cn("flex flex-col gap-1", className)} {...props}>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-3xl font-semibold tracking-tight tabular-nums">{value}</dd>
      {change ? (
        <dd className="flex flex-wrap items-center gap-x-2">
          <span className={changeVariants({ trend: t })}>
            <span aria-hidden="true">{arrows[t]}</span>
            <span className="sr-only">{words[t]} </span>
            {change}
          </span>
          {changeLabel ? (
            <span className="text-sm text-muted-foreground">{changeLabel}</span>
          ) : null}
        </dd>
      ) : null}
    </dl>
  );
}

export { changeVariants };
