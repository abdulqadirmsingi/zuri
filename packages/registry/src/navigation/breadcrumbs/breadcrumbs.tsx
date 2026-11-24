import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  /** Where it links. The last item is the current page, so it usually has none. */
  href?: string;
}

export interface BreadcrumbsProps extends Omit<ComponentProps<"nav">, "children"> {
  /** The trail from the top level down to the current page. */
  items: BreadcrumbItem[];
}

const chevron = (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-3.5 shrink-0 rtl:rotate-180"
  >
    <path d="M6 3.5l4.5 4.5L6 12.5" />
  </svg>
);

/**
 * Shows where the current page sits in the site. A `<nav>` with an ordered list: screen readers
 * announce the position ("list, 3 items") and the last entry is marked `aria-current="page"`.
 * Long labels truncate (with a title) and long trails wrap onto more lines.
 */
export function Breadcrumbs({
  items,
  className,
  "aria-label": label = "Breadcrumb",
  ...props
}: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className={className} {...props}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-1.5 gap-y-1 p-0 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const text = (
            <span className="block max-w-[16rem] truncate" title={item.label}>
              {item.label}
            </span>
          );
          return (
            <li
              key={`${item.href ?? ""}|${item.label}`}
              className="flex min-w-0 items-center gap-1.5"
            >
              {item.href ? (
                <a
                  href={item.href}
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "rounded-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    isLast && "font-medium text-foreground",
                  )}
                >
                  {text}
                </a>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(isLast && "font-medium text-foreground")}
                >
                  {text}
                </span>
              )}
              {isLast ? null : chevron}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
