import Link from "next/link";
import type { Shelf } from "@/lib/registry-stats";

const names: Record<string, string> = {
  actions: "Actions",
  inputs: "Inputs",
  display: "Display",
  navigation: "Navigation",
  overlays: "Overlays",
  blocks: "Blocks",
  motion: "Motion",
};

/**
 * The registry laid out as shelves: a big count, a name and every item as a link. It reads the
 * real registry, so a new component appears here by itself and the page never grows longer
 * than one row per category.
 */
export function Shelves({ shelves }: { shelves: Shelf[] }) {
  return (
    <ol className="m-0 list-none border-t border-border p-0">
      {shelves.map((shelf) => {
        const label = names[shelf.id] ?? shelf.id;
        return (
          <li
            key={shelf.id}
            className="group grid gap-x-8 gap-y-4 border-b border-border py-7 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-baseline"
          >
            <h3 className="m-0 flex items-baseline gap-4 font-display font-semibold tracking-tight">
              <span className="text-6xl leading-none transition-colors duration-[var(--duration-base)] group-focus-within:text-accent-ink group-hover:text-accent-ink sm:text-7xl">
                {shelf.items.length}
              </span>
              <span className="text-xl">{label}</span>
            </h3>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {shelf.items.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-9 items-center rounded-full border border-border px-4 text-sm text-foreground transition-colors duration-[var(--duration-fast)] hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}
