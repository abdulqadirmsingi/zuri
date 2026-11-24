import Link from "next/link";
import { gitConfig, siteUrl } from "@/lib/shared";
import { GiantWordmark } from "./giant-wordmark";
import { InstallCommand } from "./install-command";

const columns = [
  {
    title: "Build",
    links: [
      { label: "Components", href: "/docs/components" },
      { label: "Blocks", href: "/docs/blocks" },
      { label: "Landing page starter", href: "/docs/blocks/landing-starter" },
      { label: "Theming", href: "/docs/theming" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Installation", href: "/docs/installation" },
      { label: "Fonts", href: "/fonts" },
      { label: "Font pairings", href: "/fonts/pairings" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "GitHub", href: `https://github.com/${gitConfig.user}/${gitConfig.repo}` },
      { label: "Brand assets", href: "/brand/README.md" },
    ],
  },
];

/**
 * The page footer. It is always dark: the `dark` class makes the tokens inside it resolve to their
 * dark values whatever the page theme is, so it reads as the closing section of the page.
 */
export function HomeFooter() {
  return (
    <footer className="dark overflow-hidden bg-background text-foreground">
      <div className="mx-auto grid w-full max-w-[88rem] gap-14 px-4 pt-24 sm:px-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-6">
          <h2 className="m-0 max-w-xl text-balance font-display text-5xl font-semibold leading-[1] tracking-tight sm:text-6xl">
            Take one component. See how it feels.
          </h2>
          <div className="max-w-2xl">
            <InstallCommand command={`npx shadcn@latest add ${siteUrl}/r/button.json`} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="m-0 mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {c.title}
              </p>
              <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="inline-flex min-h-6 items-center rounded-sm text-foreground/80 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-20 flex w-full max-w-[88rem] flex-col gap-2 border-t border-border px-4 py-5 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-8">
        <p className="m-0">© 2026 Zuri. Free parts are MIT licensed.</p>
        <p className="m-0">
          <span lang="sw">Zuri</span> means “beautiful” in Swahili. Made in Tanzania.
        </p>
      </div>

      <div className="overflow-hidden px-2">
        <GiantWordmark>zuri</GiantWordmark>
      </div>
    </footer>
  );
}
