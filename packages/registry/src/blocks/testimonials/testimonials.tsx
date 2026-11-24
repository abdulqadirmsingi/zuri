import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface Testimonial {
  id: string;
  quote: ReactNode;
  name: ReactNode;
  /** Role and organisation. */
  role?: ReactNode;
  /** An avatar or a mark. Decorative: the name is always shown as text. */
  avatar?: ReactNode;
}

export interface TestimonialsProps extends ComponentProps<"ul"> {
  items: Testimonial[];
}

/**
 * Short quotes in a staggered grid. The quotes are yours to supply, and they should be real,
 * attributed and agreed to: this block does not make any up.
 */
export function Testimonials({ items, className, ...props }: TestimonialsProps) {
  return (
    <ul
      className={cn(
        "m-0 w-full list-none gap-4 p-0 [column-gap:1rem] sm:columns-2 lg:columns-3",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <li key={item.id} className="mb-4 break-inside-avoid">
          <figure className="m-0 flex flex-col gap-5 rounded-3xl border border-border bg-muted p-6">
            <blockquote className="m-0 text-pretty text-base leading-relaxed text-foreground">
              {item.quote}
            </blockquote>
            <figcaption className="flex items-center gap-3">
              {item.avatar ? (
                <span aria-hidden="true" className="shrink-0">
                  {item.avatar}
                </span>
              ) : null}
              <span className="flex min-w-0 flex-col">
                <span className="text-sm font-medium text-foreground">{item.name}</span>
                {item.role ? (
                  <span className="text-sm text-muted-foreground">{item.role}</span>
                ) : null}
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
