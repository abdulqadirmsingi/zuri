import { CardFanHero } from "@registry/blocks/card-fan-hero/card-fan-hero";
import { MagazineHero } from "@registry/blocks/magazine-hero/magazine-hero";
import { SplitHero } from "@registry/blocks/split-hero/split-hero";

// Original placeholder artwork: plain shapes, so the demos need no photos and nothing is copied.
function Art({ tone, label }: { tone: 1 | 2 | 3 | 4; label: string }) {
  const bg = [
    "from-accent to-muted",
    "from-muted to-accent",
    "from-foreground/15 to-accent",
    "from-accent to-foreground/20",
  ][tone - 1];
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 300 375"
      preserveAspectRatio="xMidYMid slice"
      className="block size-full"
    >
      <title>{label}</title>
      <foreignObject width="300" height="375">
        <div className={`size-full bg-gradient-to-br ${bg}`} />
      </foreignObject>
      <circle cx="210" cy="110" r="46" fill="var(--background)" opacity="0.85" />
      <path d="M0 375V270Q90 200 170 255T300 230V375Z" fill="var(--foreground)" opacity="0.8" />
    </svg>
  );
}

const primary =
  "inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const secondary =
  "inline-flex min-h-11 items-center rounded-full border border-control-border px-6 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function HeroSplit() {
  return (
    <SplitHero
      headingLevel={2}
      eyebrow="Applications open"
      title="Learn skills that build a career"
      description="Short, practical courses taught by people who do the work, with a mentor beside you from the first day."
      actions={
        <>
          <a href="#apply" className={primary}>
            Apply now
          </a>
          <a href="#courses" className={secondary}>
            See courses
          </a>
        </>
      }
      highlights={[
        { label: "Students", value: "1,200" },
        { label: "Courses", value: "24" },
        { label: "Placement", value: "9 in 10" },
      ]}
      media={
        <div className="aspect-[4/3]">
          <Art tone={1} label="Abstract hills under a pale sun" />
        </div>
      }
    />
  );
}

export function HeroSplitStart() {
  return (
    <SplitHero
      headingLevel={2}
      mediaPosition="start"
      title="Pay anyone, anywhere"
      description="Send money to a phone number in seconds."
      actions={
        <a href="#start" className={primary}>
          Get started
        </a>
      }
      media={
        <div className="aspect-[4/3]">
          <Art tone={3} label="Abstract hills in grey and saffron" />
        </div>
      }
    />
  );
}

export function HeroMagazine() {
  return (
    <MagazineHero
      headingLevel={2}
      eyebrow="Issue 04"
      title={
        <>
          Stories from
          <br />
          the coast
        </>
      }
      description="Essays, photographs and conversations from people shaping the Swahili coast."
      actions={
        <a href="#read" className={primary}>
          Start reading
        </a>
      }
      tags={["Essays", "Photography", "Food"]}
      badge="New issue"
      caption="Illustration by the Zuri team"
      media={<Art tone={2} label="Abstract hills under a pale sun" />}
    />
  );
}

export function HeroFan() {
  return (
    <CardFanHero
      headingLevel={2}
      eyebrow="Explore"
      title="Everything you need, in one place"
      description="Browse the collection and pick up where you left off."
      actions={
        <>
          <a href="#browse" className={primary}>
            Browse all
          </a>
          <a href="#about" className={secondary}>
            How it works
          </a>
        </>
      }
      cards={(["Maps", "Notes", "Guides", "Tools", "Stories"] as const).map((label, i) => ({
        id: label,
        label,
        media: <Art tone={((i % 4) + 1) as 1 | 2 | 3 | 4} label={`${label} cover`} />,
      }))}
    />
  );
}
