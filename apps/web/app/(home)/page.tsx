import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Demo } from "@/components/demos";
import { SwellNavDefault } from "@/components/demos/swell-nav-demos";
import { ComponentStage, type StageItem } from "@/components/home/component-stage";
import { HomeFooter } from "@/components/home/home-footer";
import { InstallCommand } from "@/components/home/install-command";
import { LabCode, ThemeLab } from "@/components/home/theme-lab";
import { registryStats } from "@/lib/registry-stats";
import { gitConfig, siteUrl } from "@/lib/shared";
import fanShot from "@/public/home/fan.jpg";
import magazineShot from "@/public/home/magazine.jpg";
import splitShot from "@/public/home/split.jpg";
import starterShot from "@/public/home/starter.jpg";

const wrap = "mx-auto w-full max-w-[88rem] px-4 sm:px-8";
const label = "m-0 font-mono text-xs uppercase tracking-wider text-muted-foreground";
const button =
  "inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const steps = [
  {
    n: "01",
    title: "Run one command",
    body: "It reads the component from the registry and writes its source into your project.",
    code: `npx shadcn@latest add ${siteUrl}/r/dialog.json`,
  },
  {
    n: "02",
    title: "Read what arrived",
    body: "Plain TSX in your own folders. No package to keep up with, and no wrapper hiding it.",
    code: "components/ui/dialog.tsx",
  },
  {
    n: "03",
    title: "Change anything",
    body: "Rename a prop, swap a colour token, delete a variant. From here it is your code.",
    code: 'variant: "default" | "glass"  →  yours',
  },
];

const principles = [
  {
    n: "01",
    title: "Accessible first",
    body: "Native elements before ARIA. Every docs page is run through axe in light and dark, at desktop width and at 320px.",
  },
  {
    n: "02",
    title: "Tokens, not magic numbers",
    body: "Colour, radius, motion and stacking come from CSS variables. Reduced motion is handled once, in the tokens.",
  },
  {
    n: "03",
    title: "Small enough to read",
    body: "Each component is a single file with a handful of dependencies, written to be understood and edited.",
  },
  {
    n: "04",
    title: "Honest about the gaps",
    body: "Every page lists what has not been tested, such as real phones. You should know before you ship it.",
  },
];

const shots = [
  {
    src: starterShot,
    alt: "A landing page built from Zuri blocks, with a header, a split hero and a headline about learning skills.",
    title: "Landing page starter",
    href: "/docs/blocks/landing-starter",
    className: "lg:col-span-7",
  },
  {
    src: magazineShot,
    alt: "The magazine hero: a very large headline beside a tall picture with a saffron block behind it.",
    title: "Magazine hero",
    href: "/docs/blocks/magazine-hero",
    className: "lg:col-span-5 lg:mt-24",
  },
  {
    src: splitShot,
    alt: "The split hero: a headline, two buttons and three figures beside a large picture.",
    title: "Split hero",
    href: "/docs/blocks/split-hero",
    className: "lg:col-span-5",
  },
  {
    src: fanShot,
    alt: "The card fan hero: a centred headline over five cards fanned out in an arc.",
    title: "Card fan hero",
    href: "/docs/blocks/card-fan-hero",
    className: "lg:col-span-7 lg:-mt-12",
  },
];

const stageDemos: Record<string, string> = {
  dialog: "dialog-default",
  "dropdown-menu": "dropdown-menu-default",
  tabs: "tabs-default",
  accordion: "accordion-default",
  select: "select-default",
  "password-strength": "password-default",
  "copy-button": "copy-button-default",
  "expanding-button-group": "expanding-default",
  "theme-switch": "theme-switch-styles",
  "user-menu": "user-menu-default",
  breadcrumbs: "breadcrumbs-default",
  tooltip: "tooltip-default",
};

/** A small bordered card for the hero desk. */
function Desk({
  label: name,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-lg border border-border bg-background p-4 shadow-lg ${className}`}
    >
      <p className={label}>{name}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export default function Home() {
  const stats = registryStats();
  // Shown in the order of stageDemos, which is the order they appear in the list.
  const byName = new Map(stats.items.map((i) => [i.name, i]));
  const stageItems: StageItem[] = Object.keys(stageDemos)
    .flatMap((name) => byName.get(name) ?? [])
    .map((i) => ({
      id: i.name,
      title: i.title,
      description: i.description ?? "",
      dependencies: i.dependencies ?? [],
      demo: <Demo name={stageDemos[i.name] as string} />,
      command: `npx shadcn@latest add ${siteUrl}/r/${i.name}.json`,
    }));
  return (
    <>
      <ThemeLab>
        <main>
          {/* Hero */}
          <section aria-labelledby="hero-title" className={`${wrap} pt-12 pb-24 lg:pt-14`}>
            <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-8">
              <div className="flex min-w-0 flex-col gap-7">
                <p className={label}>Open-source React components</p>
                <h1
                  id="hero-title"
                  className="m-0 text-balance font-display text-[clamp(3rem,6.1vw,5.75rem)] font-semibold leading-[0.95] tracking-[-0.035em]"
                >
                  Interface parts you copy, then <span className="text-accent-ink">own</span>.
                </h1>
                <p className="m-0 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                  Accessible React components and page blocks. One command puts the source in your
                  project, so there is no package to keep up with and nothing between you and the
                  code.
                </p>
                <InstallCommand command={`npx shadcn@latest add ${siteUrl}/r/button.json`} />
                <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Link
                    href="/docs/components"
                    className={`${button} bg-primary text-primary-foreground`}
                  >
                    Browse components
                  </Link>
                  <Link href="/docs/blocks" className={`${button} border border-control-border`}>
                    See page blocks
                  </Link>
                </div>
                <p className={label}>
                  {stats.count} components · {stats.blocks} blocks · MIT · shadcn registry
                </p>
              </div>

              {/* The desk: real components, loosely scattered. The sliders below re-theme all of it. */}
              <div className="relative mx-auto grid w-full max-w-md gap-5 lg:block lg:h-[36rem] lg:max-w-none">
                <Desk
                  label="Tabs"
                  className="lg:absolute lg:start-0 lg:top-0 lg:w-[17.5rem] lg:-rotate-2"
                >
                  <Demo name="tabs-line" />
                </Desk>
                <div className="w-full lg:absolute lg:end-0 lg:top-10 lg:w-[17.5rem] lg:rotate-2">
                  <SwellNavDefault />
                </div>
                <Desk
                  label="Switch"
                  className="lg:absolute lg:start-8 lg:top-[13rem] lg:w-[17.5rem] lg:rotate-1"
                >
                  <Demo name="switch-default" />
                </Desk>
                <Desk
                  label="Badge · Copy"
                  className="lg:absolute lg:start-0 lg:bottom-0 lg:w-[25rem] lg:-rotate-1"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Demo name="badge-variants" />
                  </div>
                </Desk>
                <p className={`${label} lg:absolute lg:end-2 lg:bottom-6 lg:w-48 lg:text-end`}>
                  All of this follows the sliders below ↓
                </p>
              </div>
            </div>
          </section>

          {/* The whole theme */}
          <section aria-labelledby="theme-title" className="border-y border-border">
            <div
              className={`${wrap} grid gap-10 py-16 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20 lg:py-20`}
            >
              <div className="flex flex-col gap-4">
                <p className={label}>Theming</p>
                <h2
                  id="theme-title"
                  className="m-0 text-balance font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl"
                >
                  This is the whole theme.
                </h2>
                <p className="m-0 max-w-md text-lg leading-relaxed text-muted-foreground">
                  Move a slider at the bottom of the screen and read the CSS change. Colour and
                  corners are variables, so restyling a component is a few lines, not a fork.
                </p>
              </div>
              <LabCode />
            </div>
          </section>

          {/* How it works */}
          <section aria-labelledby="how-title" className={`${wrap} py-24 lg:py-32`}>
            <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
              <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
                <p className={label}>How it works</p>
                <h2
                  id="how-title"
                  className="m-0 text-balance font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl"
                >
                  One command. Then it is your code.
                </h2>
                <p className="m-0 max-w-md text-lg leading-relaxed text-muted-foreground">
                  Zuri works with the shadcn command line, so there is nothing new to learn and no
                  lock-in to leave.
                </p>
              </div>
              <ol className="m-0 flex list-none flex-col p-0">
                {steps.map((s) => (
                  <li
                    key={s.n}
                    className="grid gap-4 border-t border-border py-8 sm:grid-cols-[4rem_1fr]"
                  >
                    <span className="font-mono text-sm text-accent-ink">{s.n}</span>
                    <div className="flex min-w-0 flex-col gap-3">
                      <h3 className="m-0 text-2xl font-semibold tracking-tight">{s.title}</h3>
                      <p className="m-0 max-w-lg text-muted-foreground">{s.body}</p>
                      <pre className="m-0 whitespace-pre-wrap break-all rounded-xl border border-border bg-muted px-4 py-3 font-mono text-sm">
                        <code>{s.code}</code>
                      </pre>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Component browser */}
          <section aria-labelledby="live-title" className={`${wrap} pb-24 lg:pb-32`}>
            <div className="mb-12 flex flex-col gap-4">
              <p className={label}>Browse</p>
              <h2
                id="live-title"
                className="m-0 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl"
              >
                Pick one. It is running, not pictured.
              </h2>
            </div>
            <ComponentStage items={stageItems} />
          </section>

          {/* Principles */}
          <section aria-labelledby="rules-title" className="border-t border-border">
            <div className={`${wrap} py-24 lg:py-32`}>
              <h2
                id="rules-title"
                className="m-0 mb-14 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl"
              >
                What we hold ourselves to
              </h2>
              <ol className="m-0 grid list-none gap-x-16 gap-y-12 p-0 md:grid-cols-2">
                {principles.map((p) => (
                  <li key={p.n} className="flex gap-6 border-t border-border pt-6">
                    <span className="font-mono text-sm text-accent-ink">{p.n}</span>
                    <div className="flex flex-col gap-2">
                      <h3 className="m-0 text-xl font-semibold tracking-tight">{p.title}</h3>
                      <p className="m-0 max-w-md text-muted-foreground">{p.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Page blocks, as pictures */}
          <section aria-labelledby="pages-title" className="overflow-hidden border-t border-border">
            <div className={`${wrap} py-24 lg:py-32`}>
              <div className="mb-14 flex flex-col gap-4">
                <p className={label}>Page blocks</p>
                <h2
                  id="pages-title"
                  className="m-0 max-w-3xl text-balance font-display text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl"
                >
                  Whole pages, not just parts.
                </h2>
                <p className="m-0 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  Heroes, headers, footers and a full landing page, made from the same parts. These
                  are screenshots of the real blocks.
                </p>
              </div>
              <div className="grid gap-x-8 gap-y-12 lg:grid-cols-12">
                {shots.map((s) => (
                  <Link
                    key={s.title}
                    href={s.href}
                    className={`group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring ${s.className}`}
                  >
                    <figure className="m-0">
                      <div className="overflow-hidden rounded-2xl border border-border bg-muted">
                        <Image
                          src={s.src}
                          alt={s.alt}
                          sizes="(min-width: 1024px) 58vw, 100vw"
                          className="block h-auto w-full transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        />
                      </div>
                      <figcaption className="mt-4 flex items-center justify-between font-mono text-xs uppercase tracking-wider">
                        <span>{s.title}</span>
                        <span aria-hidden="true">→</span>
                      </figcaption>
                    </figure>
                  </Link>
                ))}
              </div>
              <p className={`${label} mt-14`}>
                <a
                  href={`https://github.com/${gitConfig.user}/${gitConfig.repo}`}
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  Read the source on GitHub
                </a>
              </p>
            </div>
          </section>
        </main>
      </ThemeLab>
      <HomeFooter />
    </>
  );
}
