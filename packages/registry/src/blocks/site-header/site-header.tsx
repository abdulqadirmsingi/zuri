"use client";

import { type ComponentProps, type ElementType, type ReactNode, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface HeaderLink {
  label: string;
  href: string;
}

export interface SiteHeaderProps extends Omit<ComponentProps<"header">, "children"> {
  /** Your logo or name, usually a link home. */
  brand: ReactNode;
  links: HeaderLink[];
  /** The `href` of the current page. Its link gets `aria-current="page"`. */
  current?: string;
  /** Buttons shown at the end, such as "Sign in". They also appear in the mobile menu. */
  actions?: ReactNode;
  /** Keep the header at the top while the page scrolls. */
  sticky?: boolean;
  /** Name of the main navigation landmark. Defaults to "Main". */
  navLabel?: string;
  /** Name of the button that opens the menu on small screens. Defaults to "Menu". */
  menuLabel?: string;
  /** Render links with another component, such as `next/link`. Defaults to "a". */
  linkAs?: ElementType;
}

const linkClass =
  "inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-muted-foreground hover:text-foreground aria-[current=page]:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:min-h-9";

/**
 * A site header: brand, navigation links and actions. From the `md` breakpoint it is a row of
 * links; below that the links move into a modal menu (focus is trapped, Escape closes it and
 * focus returns to the menu button). The menu closes itself when a link is chosen.
 */
export function SiteHeader({
  brand,
  links,
  current,
  actions,
  sticky = false,
  navLabel = "Main",
  menuLabel = "Menu",
  linkAs: Link = "a",
  className,
  ...props
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const item = (l: HeaderLink, close: boolean) => {
    const link = (
      <Link
        href={l.href}
        aria-current={l.href === current ? "page" : undefined}
        className={cn(linkClass, close && "w-full px-0 text-base text-foreground")}
      >
        {l.label}
      </Link>
    );
    return close ? <DialogClose asChild>{link}</DialogClose> : link;
  };
  return (
    <header
      className={cn(
        "w-full border-b border-border bg-background",
        sticky && "sticky top-0 z-[var(--z-sticky)]",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-8">
        <div className="flex min-w-0 shrink-0 items-center font-semibold">{brand}</div>

        <nav aria-label={navLabel} className="ms-6 hidden md:block">
          <ul className="m-0 flex list-none items-center gap-1 p-0">
            {links.map((l) => (
              <li key={l.href + l.label}>{item(l, false)}</li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-2">
          {actions ? <div className="hidden items-center gap-2 md:flex">{actions}</div> : null}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:hidden"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="size-5"
                >
                  <path d="M2 4h12M2 8h12M2 12h12" />
                </svg>
                <span className="sr-only">{menuLabel}</span>
              </button>
            </DialogTrigger>
            <DialogContent
              closeLabel="Close menu"
              // Full-width panel pinned to the top instead of the default centred dialog.
              className="start-0 top-0 max-h-dvh w-full max-w-none translate-x-0 translate-y-0 rounded-none rounded-b-2xl border-x-0 border-t-0 rtl:translate-x-0"
            >
              <DialogTitle className="m-0 text-base font-semibold">{menuLabel}</DialogTitle>
              <DialogDescription className="sr-only">Site navigation</DialogDescription>
              <nav aria-label={navLabel}>
                <ul className="m-0 flex list-none flex-col gap-1 p-0">
                  {links.map((l) => (
                    <li key={l.href + l.label}>{item(l, true)}</li>
                  ))}
                </ul>
              </nav>
              {actions ? <div className="flex flex-col gap-2">{actions}</div> : null}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
