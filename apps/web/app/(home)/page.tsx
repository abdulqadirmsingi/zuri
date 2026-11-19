import { Marquee } from "@registry/blocks/marquee/marquee";
import Image from "next/image";
import Link from "next/link";
import { Demo } from "@/components/demos";
import { SwellNavDefault } from "@/components/demos/swell-nav-demos";
import { HomeFooter } from "@/components/home/home-footer";
import { InstallCommand } from "@/components/home/install-command";
import { Specimen } from "@/components/home/specimen";
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

export default function Home() {
  const stats = registryStats();
  return (
    <>
      <main>
        {/* Hero */}
        <section aria-labelledby="hero-title" className={`${wrap} pt-14 pb-20 lg:pt-24`}>
          <div className="grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:items-start lg:gap-12">
            <div className="flex min-w-0 flex-col gap-7">
              <p className={label}>Open-source React components</p>
              <h1
                id="hero-title"
                className="m-0 text-balance font-display text-[clamp(3rem,7.4vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.035em]"
              >
                Interface parts you copy, then <span className="text-accent-ink">own</span>.
              </h1>
              <p className="m-0 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                Zuri is a set of accessible React components and page blocks. One command puts the
                source in your project, so there is no package to keep up with and nothing between
                you and the code.
              </p>
              <InstallCommand command={`npx shadcn@latest add ${siteUrl}/r/button.json`} />
              <div className="flex flex-wrap gap-3">
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
                {stats.components} components · {stats.blocks} blocks · MIT · shadcn registry
              </p>
            </div>

            {/* A sheet of the real components. Everything here works. */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border border-border"
              />
              <div className="relative grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
                <Specimen
                  label="Swell nav"
                  href="/docs/components/swell-nav"
                  className="sm:row-span-2"
                >
                  <div className="w-full">
                    <SwellNavDefault />
                  </div>
                </Specimen>
                <Specimen label="Tabs" href="/docs/components/tabs">
                  <Demo name="tabs-line" />
                </Specimen>
                <Specimen label="Switch" href="/docs/components/switch">
                  <Demo name="switch-default" />
                </Specimen>
                <Specimen label="Badge" href="/docs/components/badge" className="sm:col-span-2">
                  <Demo name="badge-variants" />
                </Specimen>
              </div>
              <p className={`${label} mt-6 text-end`}>These are the real components. Try them.</p>
            </div>
          </div>
        </section>

        {/* The names, big */}
        <section aria-label="Components in the registry" className="border-y border-border py-8">
          <Marquee duration={70}>
            <ul className="m-0 flex list-none flex-wrap gap-10 p-0">
              {stats.names.map((name) => (
                <li
                  key={name}
                  className="whitespace-nowrap font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-none tracking-tight"
                >
                  {name}
                  <span aria-hidden="true" className="ms-10 text-accent">
                    /
                  </span>
                </li>
              ))}
            </ul>
          </Marquee>
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

        {/* Live gallery */}
        <section aria-labelledby="live-title" className={`${wrap} pb-24 lg:pb-32`}>
          <div className="mb-10 flex flex-col gap-4">
            <p className={label}>Live</p>
            <h2
              id="live-title"
              className="m-0 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl"
            >
              Everything here is running, not pictured.
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-6">
            <Specimen label="Dialog" href="/docs/components/dialog" className="md:col-span-2">
              <Demo name="dialog-default" />
            </Specimen>
            <Specimen
              label="Dropdown menu"
              href="/docs/components/dropdown-menu"
              className="md:col-span-2"
            >
              <Demo name="dropdown-menu-default" />
            </Specimen>
            <Specimen
              label="Copy button"
              href="/docs/components/copy-button"
              className="md:col-span-2"
            >
              <Demo name="copy-button-default" />
            </Specimen>
            <Specimen
              label="Password strength"
              href="/docs/components/password-strength"
              className="md:col-span-3"
            >
              <Demo name="password-default" />
            </Specimen>
            <Specimen
              label="Accordion"
              href="/docs/components/accordion"
              className="md:col-span-3 md:row-span-2"
            >
              <div className="w-full">
                <Demo name="accordion-default" />
              </div>
            </Specimen>
            <Specimen label="Select" href="/docs/components/select" className="md:col-span-3">
              <Demo name="select-default" />
            </Specimen>
            <Specimen label="Avatar group" href="/docs/components/avatar" className="md:col-span-2">
              <Demo name="avatar-group" />
            </Specimen>
            <Specimen label="Checkbox" href="/docs/components/checkbox" className="md:col-span-2">
              <Demo name="checkbox-states" />
            </Specimen>
            <Link
              href="/docs/components"
              className="flex min-h-32 items-end justify-between gap-4 bg-accent p-5 text-accent-foreground focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring md:col-span-2"
            >
              <span className="font-display text-3xl font-semibold leading-none tracking-tight">
                All {stats.components} components
              </span>
              <span aria-hidden="true" className="text-2xl">
                →
              </span>
            </Link>
          </div>
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
      <HomeFooter />
    </>
  );
}
