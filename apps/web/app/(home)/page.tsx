import { Marquee } from "@registry/blocks/marquee/marquee";
import { Pricing } from "@registry/blocks/pricing/pricing";
import Image from "next/image";
import Link from "next/link";
import { demoFor } from "@/components/demos";
import { Builder, type BuilderItem } from "@/components/home/builder";
import { HomeFooter } from "@/components/home/home-footer";
import { InstallCommand } from "@/components/home/install-command";
import { InstallCount } from "@/components/home/install-count";
import { Shelves } from "@/components/home/shelves";
import { ThemeLab } from "@/components/home/theme-lab";
import { registryStats } from "@/lib/registry-stats";
import { siteUrl } from "@/lib/shared";
import fanShot from "@/public/home/fan.jpg";
import magazineShot from "@/public/home/magazine.jpg";
import splitShot from "@/public/home/split.jpg";
import starterShot from "@/public/home/starter.jpg";

const wrap = "mx-auto w-full max-w-[88rem] px-4 sm:px-8";
const label = "m-0 font-mono text-xs uppercase tracking-wider text-muted-foreground";

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

  return (
    <>
      <ThemeLab>
        <main>
          {/* Hero: one sentence you finish yourself. The choice re-themes the whole page. */}
          <section aria-labelledby="hero-title" className={`${wrap} pt-12 pb-24 lg:pt-16`}>
            <h1 id="hero-title" className="sr-only">
              Zuri: React components you copy, then own
            </h1>
            <p className={`${label} mb-6`}>
              {stats.count} components · {stats.blocks} blocks · finish the sentence
              <InstallCount />
            </p>
            <Builder items={builderItems} initialId="dialog" />
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

          {/* Page blocks, as pictures */}
          <section aria-labelledby="pages-title" className="overflow-hidden">
            <div className={`${wrap} py-24 lg:py-32`}>
              <h2
                id="pages-title"
                className="m-0 mb-14 max-w-3xl text-balance font-display text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl"
              >
                Whole pages, too.
              </h2>
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
            </div>
          </section>

          {/* Everything, by shelf. Counts and links come from the registry. */}
          <section aria-labelledby="shelves-title" className="border-t border-border">
            <div className={`${wrap} py-24 lg:py-32`}>
              <h2
                id="shelves-title"
                className="m-0 mb-12 max-w-3xl text-balance font-display text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl"
              >
                Pick a shelf.
              </h2>
              <Shelves shelves={stats.shelves} />
            </div>
          </section>

          {/* Three steps. The commands are the real ones. */}
          <section aria-labelledby="steps-title" className="border-t border-border">
            <div className={`${wrap} py-24 lg:py-32`}>
              <h2
                id="steps-title"
                className="m-0 mb-12 max-w-3xl text-balance font-display text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl"
              >
                Three steps, then it is yours.
              </h2>
              <ol className="m-0 grid list-none gap-10 p-0 lg:grid-cols-3">
                {[
                  {
                    title: "Set up shadcn",
                    text: "Once per project. Skip it if you already have a components.json.",
                    command: "npx shadcn@latest init",
                  },
                  {
                    title: "Add a component",
                    text: "The file is copied into your project, along with the packages it needs.",
                    command: `npx shadcn@latest add ${siteUrl}/r/button.json`,
                  },
                  {
                    title: "Change it",
                    text: "It is your code now. Edit it, restyle it, delete what you don't need.",
                  },
                ].map((step, i) => (
                  <li key={step.title} className="flex flex-col gap-4">
                    <span
                      aria-hidden="true"
                      className="font-display text-7xl font-semibold leading-none text-accent-ink"
                    >
                      {i + 1}
                    </span>
                    <h3 className="m-0 text-xl font-semibold tracking-tight">{step.title}</h3>
                    <p className="m-0 text-pretty leading-relaxed text-muted-foreground">
                      {step.text}
                    </p>
                    {step.command ? <InstallCommand command={step.command} /> : null}
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Plans. Free is true today; Pro has no price yet, and none is invented. */}
          <section aria-labelledby="plans-title" className="border-t border-border">
            <div className={`${wrap} py-24 lg:py-32`}>
              <h2
                id="plans-title"
                className="m-0 mb-4 max-w-3xl text-balance font-display text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl"
              >
                Free to copy.
              </h2>
              <p className="m-0 mb-12 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                Everything here is yours the moment you install it. Pro will add more, once it is
                ready.
              </p>
              <Pricing
                className="max-w-4xl"
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
            </div>
          </section>
        </main>
      </ThemeLab>
      <HomeFooter />
    </>
  );
}
