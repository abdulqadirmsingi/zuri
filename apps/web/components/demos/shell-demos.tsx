import { ClosingCta } from "@registry/blocks/closing-cta/closing-cta";
import { SectionHeading } from "@registry/blocks/section-heading/section-heading";
import { SiteFooter } from "@registry/blocks/site-footer/site-footer";
import { SiteHeader } from "@registry/blocks/site-header/site-header";

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
