import { Marquee } from "@registry/blocks/marquee/marquee";
import Image from "next/image";
import Link from "next/link";
import { Demo } from "@/components/demos";
import { Builder, type BuilderItem } from "@/components/home/builder";
import { HomeFooter } from "@/components/home/home-footer";
import { ThemeLab } from "@/components/home/theme-lab";
import { registryStats } from "@/lib/registry-stats";
import { siteUrl } from "@/lib/shared";
import fanShot from "@/public/home/fan.jpg";
import magazineShot from "@/public/home/magazine.jpg";
import splitShot from "@/public/home/split.jpg";
import starterShot from "@/public/home/starter.jpg";

const wrap = "mx-auto w-full max-w-[88rem] px-4 sm:px-8";
const label = "m-0 font-mono text-xs uppercase tracking-wider text-muted-foreground";

// The words offered in the hero sentence, and the live demo that goes with each.
const choices = [
  { id: "dialog", word: "a dialog", demo: "dialog-default", scale: 1.6 },
  { id: "dropdown-menu", word: "a dropdown menu", demo: "dropdown-menu-default", scale: 1.6 },
  { id: "tabs", word: "some tabs", demo: "tabs-default", scale: 1.3 },
  { id: "switch", word: "a switch", demo: "switch-default", scale: 1.6 },
  { id: "accordion", word: "an accordion", demo: "accordion-default", scale: 1.1 },
  { id: "select", word: "a select", demo: "select-default", scale: 1.3 },
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
  const builderItems: BuilderItem[] = choices.map((c) => ({
    id: c.id,
    word: c.word,
    demo: <Demo name={c.demo} />,
    command: `npx shadcn@latest add ${siteUrl}/r/${c.id}.json`,
    scale: c.scale,
  }));

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
            </p>
            <Builder items={builderItems} />
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
        </main>
      </ThemeLab>
      <HomeFooter />
    </>
  );
}
