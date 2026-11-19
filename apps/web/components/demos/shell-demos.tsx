import { ClosingCta } from "@registry/blocks/closing-cta/closing-cta";
import { Pricing } from "@registry/blocks/pricing/pricing";
import { SectionHeading } from "@registry/blocks/section-heading/section-heading";
import { SiteFooter } from "@registry/blocks/site-footer/site-footer";
import { SiteHeader } from "@registry/blocks/site-header/site-header";
import { Testimonials } from "@registry/blocks/testimonials/testimonials";

const primary =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const onAccent =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-accent-foreground px-6 text-sm font-medium text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const links = [
  { label: "Courses", href: "#courses" },
  { label: "Mentors", href: "#mentors" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export function HeaderDemo() {
  return (
    <SiteHeader
      brand={
        <a href="#top" className="text-lg tracking-tight">
          Kilele
        </a>
      }
      links={links}
      current="#courses"
      actions={
        <a href="#start" className={primary}>
          Get started
        </a>
      }
    />
  );
}

export function FooterDemo() {
  return (
    <SiteFooter
      brand="Kilele"
      description="Practical courses taught by people who do the work."
      columns={[
        {
          title: "Learn",
          links: [
            { label: "Courses", href: "#courses" },
            { label: "Mentors", href: "#mentors" },
            { label: "Pricing", href: "#pricing" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "About us", href: "#about" },
            { label: "Careers", href: "#careers" },
            { label: "Contact", href: "#contact" },
          ],
        },
        {
          title: "Legal",
          links: [
            { label: "Privacy", href: "#privacy" },
            { label: "Terms", href: "#terms" },
          ],
        },
      ]}
      legal="© 2026 Kilele. All rights reserved."
    />
  );
}

export function HeadingDemo() {
  return (
    <div className="flex flex-col gap-12 px-4 py-10">
      <SectionHeading
        eyebrow="Courses"
        title="Pick a path and start this week"
        description="Every course ends with a project you can show an employer."
      />
      <SectionHeading
        align="center"
        eyebrow="Mentors"
        title="Learn from people in the field"
        description="Working professionals, matched to your goals."
      />
    </div>
  );
}

export function CtaDemo() {
  return (
    <ClosingCta
      title="Ready to start learning?"
      description="Join the next intake. Places are limited."
      actions={
        <a href="#apply" className={primary}>
          Apply now
        </a>
      }
    />
  );
}

export function CtaAccentDemo() {
  return (
    <ClosingCta
      tone="accent"
      title="Ready to start learning?"
      description="Join the next intake. Places are limited."
      actions={
        <a href="#apply" className={onAccent}>
          Apply now
        </a>
      }
    />
  );
}

// Sample content only. The plan names and figures are placeholders, not Zuri's pricing.
const outline =
  "inline-flex min-h-11 w-full items-center justify-center rounded-full border border-border px-6 text-sm font-medium text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const onPrimary =
  "inline-flex min-h-11 w-full items-center justify-center rounded-full bg-primary-foreground px-6 text-sm font-medium text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function PricingDemo() {
  return (
    <div className="px-4 py-10">
      <Pricing
        plans={[
          {
            id: "basic",
            name: "Sample basic",
            price: "Your price",
            period: "per month",
            description: "Placeholder plan. Replace every figure with your own.",
            features: ["First feature", "Second feature", "Third feature"],
            action: (
              <a href="#basic" className={outline}>
                Choose basic
              </a>
            ),
          },
          {
            id: "plus",
            name: "Sample plus",
            price: "Your price",
            period: "per month",
            badge: "Example",
            description: "The featured plan has the filled look.",
            featured: true,
            features: ["Everything in basic", "Fourth feature", "Fifth feature"],
            action: (
              <a href="#plus" className={onPrimary}>
                Choose plus
              </a>
            ),
          },
        ]}
      />
    </div>
  );
}

export function TestimonialsDemo() {
  return (
    <div className="px-4 py-10">
      <Testimonials
        items={[
          {
            id: "1",
            quote: "Sample quote. Replace this with a real one, used with the person's permission.",
            name: "Sample Person",
            role: "Example Company",
          },
          {
            id: "2",
            quote: "Short quotes read best. Two sentences is plenty.",
            name: "Another Sample",
            role: "Example Studio",
          },
          {
            id: "3",
            quote: "Never publish a made-up testimonial as if it were real.",
            name: "Third Sample",
          },
        ]}
      />
    </div>
  );
}
