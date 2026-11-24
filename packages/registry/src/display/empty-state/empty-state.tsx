import { type ComponentProps, createElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends Omit<ComponentProps<"div">, "title"> {
  /** Short heading, e.g. "No transactions yet". */
  title: ReactNode;
  /** One sentence that says why it is empty and what to do. */
  description?: ReactNode;
  /** Decorative icon or illustration. It is hidden from assistive technology. */
  icon?: ReactNode;
  /** A button or link for the next step. */
  action?: ReactNode;
  /** Heading level, so the state fits your page's outline. Defaults to 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

/** Shown where a list or page has no content yet. Always say what the user can do next. */
export function EmptyState({
  title,
  description,
  icon,
  action,
  headingLevel = 3,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border border-dashed border-control-border p-8 text-center",
        className,
      )}
      {...props}
    >
      {icon ? (
        <div aria-hidden="true" className="text-muted-foreground">
          {icon}
        </div>
      ) : null}
      {createElement(`h${headingLevel}`, { className: "text-base font-semibold" }, title)}
      {description ? <p className="max-w-sm text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
