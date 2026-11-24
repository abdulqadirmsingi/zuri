import { Pricing } from "@registry/blocks/pricing/pricing";
import { Reveal } from "@registry/blocks/reveal/reveal";
import Link from "next/link";
import type { ReactNode } from "react";
import { demoFor } from "@/components/demos";
import { Builder, type BuilderItem } from "@/components/home/builder";
import { Hero } from "@/components/home/hero";
import { HomeFooter } from "@/components/home/home-footer";
import { NightCta } from "@/components/home/night-cta";
import { PagesShowcase, type Shot } from "@/components/home/pages-showcase";
import { Shelves } from "@/components/home/shelves";
import { SmoothScroll } from "@/components/home/smooth-scroll";
import { ThemeLab } from "@/components/home/theme-lab";
import { Workflow } from "@/components/home/workflow";
import { registryStats } from "@/lib/registry-stats";
import { siteUrl } from "@/lib/shared";
import fanShot from "@/public/home/fan.jpg";
import magazineShot from "@/public/home/magazine.jpg";
import splitShot from "@/public/home/split.jpg";
import starterShot from "@/public/home/starter.jpg";

const wrap = "mx-auto w-full max-w-[84rem] px-5 sm:px-12";

/** How the sentence names a component, when "a" plus its title would read wrongly. */
const phrases: Record<string, string> = {
  tabs: "some tabs",
  breadcrumbs: "some breadcrumbs",
  progress: "a progress bar",
  kbd: "a keyboard key",
  "empty-state": "an empty state",
  "zuri-tokens": "some tokens",
};

/** Small components look lost on the stage at their normal size, so they are shown larger. */
const scales: Record<string, number> = {
  button: 1.6,
  badge: 1.8,
  switch: 1.6,
  checkbox: 1.6,
  "radio-group": 1.4,
  dialog: 1.6,
  "alert-dialog": 1.6,
  popover: 1.6,
  tooltip: 1.6,
  "dropdown-menu": 1.6,
  "copy-button": 1.5,
  kbd: 1.8,
  spinner: 1.8,
  tabs: 1.3,
  select: 1.3,
  picker: 1.3,
};

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const phrase = (id: string, title: string) => {
  if (phrases[id]) return phrases[id];
  const word = title.toLowerCase();
  return `${/^[aeiou]/.test(word) ? "an" : "a"} ${word}`;
};

const shots: Shot[] = [
  {
    id: "starter",
    item: "landing-starter",
    preview: "/starter",
    src: starterShot,
    alt: "A landing page built from Zuri blocks, with a header, a split hero and a headline about learning skills.",
    title: "Landing starter",
    text: "A whole landing page: header, hero, sections and footer.",
    href: "/docs/blocks/landing-starter",
  },
  {
    id: "magazine",
    item: "magazine-hero",
    preview: "/starter/heroes/magazine",
    src: magazineShot,
    alt: "The magazine hero: a very large headline beside a tall picture with a saffron block behind it.",
    title: "Magazine hero",
    text: "A very large headline beside a tall picture.",
    href: "/docs/blocks/magazine-hero",
  },
  {
    id: "split",
    item: "split-hero",
    preview: "/starter/heroes/split",
    src: splitShot,
    alt: "The split hero: a headline, two buttons and three figures beside a large picture.",
    title: "Split hero",
    text: "Headline, actions and figures beside an image.",
    href: "/docs/blocks/split-hero",
  },
  {
    id: "fan",
    item: "card-fan-hero",
    preview: "/starter/heroes/fan",
    src: fanShot,
    alt: "The card fan hero: a centred headline over five cards fanned out in an arc.",
    title: "Card fan hero",
    text: "A centred headline over a fan of cards.",
    href: "/docs/blocks/card-fan-hero",
  },
];

const builtOn = ["React 19", "TypeScript", "Tailwind CSS v4", "Radix primitives", "shadcn CLI"];

const h2 =
  "m-0 text-balance font-display text-[clamp(2.5rem,5.5vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.035em]";

/** A white sheet on the paper background: the page's main content surface. */
function Sheet({
  children,
  id,
  label,
  dark,
}: {
  children: ReactNode;
  id?: string;
  label: string;
  /** Always dark, whatever the page theme: the `dark` class re-resolves the tokens inside. */
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={label}
      className={`mx-3 scroll-mt-20 rounded-[2.25rem] bg-background text-foreground sm:mx-5 ${dark ? "dark" : ""}`}
    >
      <div className={`${wrap} py-24 lg:py-32`}>{children}</div>
    </section>
  );
}

export default function Home() {
  const stats = registryStats();
  // Every component that has a live demo, so the list grows by itself as the registry does.
  const builderItems: BuilderItem[] = stats.items.flatMap((i) => {
    const demo = demoFor(i.name);
    if (!demo) return [];
    return [
      {
        id: i.name,
        phrase: phrase(i.name, i.title),
        group: titleCase(i.categories?.[0] ?? "other"),
        demo,
        scale: scales[i.name] ?? 1,
        command: `npx shadcn@latest add ${siteUrl}/r/${i.name}.json`,
      },
    ];
  });

  const figures = [
    { value: stats.count, label: "Components" },
    { value: stats.blocks, label: "Page blocks" },
    { value: stats.shelves.length, label: "Categories" },
  ];

  return (
    <>
      <SmoothScroll />
      <ThemeLab>
        <main className="flex flex-col gap-3 bg-paper pb-3 sm:gap-5 sm:pb-5">
          <Hero />

          <section aria-label="Built on" className={`${wrap} py-10`}>
            <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-x-10 gap-y-3 p-0 font-display text-lg font-semibold tracking-tight text-muted-foreground">
              {builtOn.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>

          <Sheet id="how" label="how-title">
            <Reveal className="mb-20 flex flex-col items-center gap-5 text-center lg:mb-28">
              <h2 id="how-title" className={`${h2} max-w-4xl`}>
                From install to shipped, one file at a time.
              </h2>
              <p className="m-0 max-w-xl text-pretty text-lg text-muted-foreground">
                No framework to adopt and no theme to fight. Take the part you need and keep going.
              </p>
            </Reveal>
            <Workflow />
          </Sheet>

          {/* A statement, not a testimonial: nothing here is attributed to anyone. */}
          <section aria-label="Why Zuri" className={`${wrap} py-24 lg:py-36`}>
            <Reveal>
              <p className="m-0 mx-auto max-w-5xl text-balance text-center font-display text-[clamp(2rem,4.6vw,4rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-muted-foreground/60">
                Every component is <span className="text-foreground">one file you can read</span> in
                a minute. No runtime to update, no styles to override,{" "}
                <span className="text-foreground">nothing hidden.</span>
              </p>
            </Reveal>
          </section>

          <Sheet label="pages-title" dark>
            <Reveal className="mb-14 grid gap-6 lg:mb-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
              <h2 id="pages-title" className={`${h2} max-w-3xl`}>
                Whole pages, not just parts.
              </h2>
              <p className="m-0 max-w-md text-pretty text-lg text-muted-foreground lg:justify-self-end">
                Blocks are complete sections built from the same components. These are running live:
                scroll them, click them, then install one and change the words.
              </p>
            </Reveal>
            <PagesShowcase shots={shots} command={`npx shadcn@latest add ${siteUrl}/r/`} />
          </Sheet>

          <section aria-label="The registry in numbers" className={`${wrap} py-20`}>
            <ul className="m-0 grid list-none grid-cols-3 gap-2 p-0 sm:gap-3">
              {figures.map((f, i) => (
                <Reveal
                  as="li"
                  key={f.label}
                  delay={i * 80}
                  className="flex flex-col items-center gap-2 rounded-[1.25rem] bg-background px-2 py-6 sm:rounded-[1.75rem] sm:px-6 sm:py-10"
                >
                  <span className="font-display text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
                    {f.value}
                  </span>
                  <span className="text-center font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground sm:text-xs">
                    {f.label}
                  </span>
                </Reveal>
              ))}
            </ul>
          </section>

          <Sheet label="play-title">
            <Reveal className="mb-12 flex flex-col gap-4">
              <h2 id="play-title" className={`${h2} max-w-3xl`}>
                Try it on before you take it.
              </h2>
            </Reveal>
            <Builder items={builderItems} initialId="dialog" />
          </Sheet>

          <Sheet label="shelves-title">
            <Reveal className="mb-12">
              <h2 id="shelves-title" className={`${h2} max-w-3xl`}>
                Every part, on its shelf.
              </h2>
            </Reveal>
            <Shelves shelves={stats.shelves} />
          </Sheet>

          {/* Plans. Free is true today; Pro has no price yet, and none is invented. */}
          <section aria-labelledby="plans-title" className={`${wrap} py-24 lg:py-32`}>
            <Reveal className="mb-12 flex flex-col items-center gap-4 text-center">
              <h2 id="plans-title" className={h2}>
                Free to copy.
              </h2>
              <p className="m-0 max-w-xl text-pretty text-lg text-muted-foreground">
                Everything here is yours the moment you install it. Pro will add more, once it is
                ready.
              </p>
            </Reveal>
            <Pricing
              className="mx-auto max-w-4xl"
              plans={[
                {
                  id: "free",
                  name: "Open source",
                  price: "Free",
                  period: "MIT licence",
                  features: [
                    "Every component and block on this site",
                    "Copied into your project, so you own the code",
                    "No account needed",
                  ],
                  action: (
                    <Link
                      href="/docs/installation"
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      Start installing
                    </Link>
                  ),
                },
                {
                  id: "pro",
                  name: "Pro",
                  price: "Not priced yet",
                  badge: "Coming later",
                  description:
                    "Extra items under a commercial licence. Plans and prices will be announced here.",
                },
              ]}
            />
          </section>
        </main>
      </ThemeLab>
      <NightCta />
      <HomeFooter />
    </>
  );
}
