import { Marquee } from "@registry/blocks/marquee/marquee";
import { Reveal } from "@registry/blocks/reveal/reveal";

// Neutral names, not real brands: the library never ships third-party logos.
const partners = [
  "Northwind",
  "Baobab Labs",
  "Kilele",
  "Mkoko",
  "Tembo & Co",
  "Savanna",
  "Pwani Works",
];

const chip =
  "inline-flex h-12 items-center rounded-full border border-border bg-background px-6 text-sm font-medium whitespace-nowrap";

function Chips() {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-8 p-0">
      {partners.map((p) => (
        <li key={p} className={chip}>
          {p}
        </li>
      ))}
    </ul>
  );
}

export function MarqueeDefault() {
  return (
    <div className="px-4 py-10">
      <Marquee>
        <Chips />
      </Marquee>
    </div>
  );
}

export function MarqueeReverse() {
  return (
    <div className="flex flex-col gap-4 px-4 py-10">
      <Marquee duration={40}>
        <Chips />
      </Marquee>
      <Marquee duration={40} reverse>
        <Chips />
      </Marquee>
    </div>
  );
}

const steps = [
  "Apply",
  "Meet your mentor",
  "Build a project",
  "Present it",
  "Get placed",
  "Mentor others",
];

export function RevealStagger() {
  return (
    <ol className="m-0 grid list-none gap-4 p-4 sm:grid-cols-2">
      {steps.map((s, i) => (
        <Reveal
          as="li"
          key={s}
          delay={(i % 2) * 100}
          className="rounded-2xl border border-border bg-muted p-6"
        >
          <p className="m-0 text-sm text-muted-foreground">Step {i + 1}</p>
          <p className="m-0 text-lg font-semibold">{s}</p>
        </Reveal>
      ))}
    </ol>
  );
}

export function RevealDirections() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {(["up", "fade", "start", "end"] as const).map((from) => (
        <Reveal key={from} from={from} className="rounded-2xl border border-border bg-muted p-6">
          <code>from="{from}"</code>
        </Reveal>
      ))}
    </div>
  );
}
