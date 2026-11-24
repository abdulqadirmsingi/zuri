import { ClosingCta } from "@/components/ui/closing-cta";
import { Marquee } from "@/components/ui/marquee";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { SplitHero } from "@/components/ui/split-hero";

// This file is a starting point, not a library: copy it, then change the words and the structure.
// Everything is plain data at the top, so a first edit is only text.

const brand = "Kilele";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Partners", href: "#partners" },
];

const partners = ["Northwind", "Baobab Labs", "Mkoko", "Tembo & Co", "Savanna", "Pwani Works"];

const features = [
  { title: "Practical courses", body: "Short lessons built around real projects, not slides." },
  { title: "A mentor beside you", body: "Regular check-ins with someone who does the work." },
  { title: "Work you can show", body: "Finish with a portfolio piece an employer can open." },
];

const steps = [
  { title: "Apply", body: "Tell us what you want to learn. It takes five minutes." },
  { title: "Get matched", body: "We pair you with a mentor and a starting course." },
  { title: "Build and ship", body: "Make something real, then present it." },
];

const columns = [
  {
    title: "Learn",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Partners", href: "#partners" },
      { label: "Contact", href: "#contact" },
    ],
  },
];

const button =
  "inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const primary = `${button} bg-primary text-primary-foreground`;
const outline = `${button} border border-control-border`;
const onAccent = `${button} bg-accent-foreground text-accent`;

/**
 * A complete landing page built from Zuri blocks: header, hero, partner strip, features, steps,
 * closing call to action and footer. It is a Server Component; only the header menu, the marquee
 * and the reveal effect run on the client.
 */
export function LandingStarter() {
  return (
    <>
      <SiteHeader
        sticky
        brand={<a href="#top">{brand}</a>}
        links={links}
        actions={
          <a href="#contact" className={primary}>
            Get started
          </a>
        }
      />

      <main id="top">
        <SplitHero
          eyebrow="Applications open"
          title="Learn skills that build a career"
          description="Short, practical courses taught by people who do the work, with a mentor beside you from day one."
          actions={
            <>
              <a href="#contact" className={primary}>
                Apply now
              </a>
              <a href="#how" className={outline}>
                See how it works
              </a>
            </>
          }
          highlights={[
            { label: "Students", value: "1,200" },
            { label: "Courses", value: "24" },
            { label: "Placement", value: "9 in 10" },
          ]}
          media={
            // Replace with your own image: <img src="…" alt="…" className="aspect-[4/3] size-full object-cover" />
            <div
              role="img"
              aria-label="Placeholder illustration: replace this with your own image"
              className="aspect-[4/3] bg-gradient-to-br from-accent to-muted"
            />
          }
        />

        <section id="partners" aria-labelledby="partners-title" className="px-4 py-12 sm:px-8">
          <p id="partners-title" className="m-0 mb-6 text-center text-sm text-muted-foreground">
            Trusted by teams across the region
          </p>
          <Marquee>
            <ul className="m-0 flex list-none flex-wrap gap-8 p-0">
              {partners.map((p) => (
                <li
                  key={p}
                  className="inline-flex h-12 items-center whitespace-nowrap rounded-full border border-border px-6 text-sm font-medium"
                >
                  {p}
                </li>
              ))}
            </ul>
          </Marquee>
        </section>

        <section
          id="features"
          aria-labelledby="features-title"
          className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-16 sm:px-8"
        >
          <Reveal>
            <SectionHeading
              eyebrow="Features"
              title="Everything you need to get going"
              description="Three things that make the difference between watching and doing."
              titleId="features-title"
            />
          </Reveal>
          <ul className="m-0 mt-10 grid list-none gap-4 p-0 md:grid-cols-3">
            {features.map((f, i) => (
              <Reveal
                as="li"
                key={f.title}
                delay={i * 90}
                className="rounded-2xl border border-border bg-muted p-6"
              >
                <h3 className="m-0 text-lg font-semibold">{f.title}</h3>
                <p className="m-0 mt-2 text-muted-foreground">{f.body}</p>
              </Reveal>
            ))}
          </ul>
        </section>

        <section
          id="how"
          aria-labelledby="how-title"
          className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-16 sm:px-8"
        >
          <Reveal>
            <SectionHeading
              eyebrow="How it works"
              title="From first message to first project"
              titleId="how-title"
            />
          </Reveal>
          <ol className="m-0 mt-10 grid list-none gap-4 p-0 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 90} className="flex flex-col gap-2">
                <span className="text-sm font-medium text-accent-ink">Step {i + 1}</span>
                <h3 className="m-0 text-lg font-semibold">{s.title}</h3>
                <p className="m-0 text-muted-foreground">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </section>

        <ClosingCta
          id="contact"
          tone="accent"
          title="Ready to start learning?"
          description="Join the next intake. Places are limited."
          actions={
            <a href="mailto:hello@example.com" className={onAccent}>
              Apply now
            </a>
          }
        />
      </main>

      <SiteFooter
        brand={brand}
        description="Practical courses taught by people who do the work."
        columns={columns}
        legal={`© 2026 ${brand}. All rights reserved.`}
      />
    </>
  );
}
