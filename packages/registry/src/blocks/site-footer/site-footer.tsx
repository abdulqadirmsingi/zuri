import { type ComponentProps, type ElementType, type ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface SiteFooterProps extends ComponentProps<"footer"> {
  /** Your logo or name, usually a link home. */
  brand?: ReactNode;
  /** A short line under the brand. */
  description?: ReactNode;
  /** Groups of links. Each group is its own named navigation landmark. */
  columns?: FooterColumn[];
  /** The legal line at the very bottom, such as a copyright. */
  legal?: ReactNode;
  /** Render links with another component, such as `next/link`. Defaults to "a". */
  linkAs?: ElementType;
}

const linkClass =
  "inline-flex min-h-6 items-center rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

function Column({ title, links, linkAs: Link = "a" }: FooterColumn & { linkAs?: ElementType }) {
  const id = useId();
  return (
    <nav aria-labelledby={id} className="min-w-0">
      <h2 id={id} className="m-0 mb-3 text-sm font-semibold">
        {title}
      </h2>
      <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className={linkClass}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** A page footer: brand, link columns and a legal line. Each column is a labelled `<nav>`. */
export function SiteFooter({
  brand,
  description,
  columns = [],
  legal,
  linkAs,
  className,
  ...props
}: SiteFooterProps) {
  return (
    <footer className={cn("w-full border-t border-border", className)} {...props}>
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-8 lg:grid-cols-[1.5fr_3fr]">
        <div className="flex min-w-0 flex-col gap-3">
          {brand ? <div className="font-semibold">{brand}</div> : null}
          {description ? (
            <p className="m-0 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {columns.length ? (
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]">
            {columns.map((c) => (
              <Column key={c.title} {...c} linkAs={linkAs} />
            ))}
          </div>
        ) : null}
      </div>
      {legal ? (
        <div className="border-t border-border">
          <p className="m-0 mx-auto w-full max-w-7xl px-4 py-5 text-sm text-muted-foreground sm:px-8">
            {legal}
          </p>
        </div>
      ) : null}
    </footer>
  );
}
