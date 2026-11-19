import type { ReactNode } from "react";

/** A labelled cell for showing one live component, in the style of a type specimen sheet. */
export function Specimen({
  label,
  href,
  children,
  className = "",
}: {
  label: string;
  /** Docs page for the component. */
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 flex-col bg-background ${className}`}>
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        <span>{label}</span>
        {href ? (
          <a
            href={href}
            className="rounded-sm hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Docs<span className="sr-only">: {label}</span> →
          </a>
        ) : null}
      </div>
      <div className="flex flex-1 flex-wrap items-center gap-3 p-4">{children}</div>
    </div>
  );
}
