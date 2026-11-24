import { Reveal } from "@registry/blocks/reveal/reveal";
import type { ReactNode } from "react";
import { LazyDemo } from "@/components/demos/lazy-demo";
import { Frame } from "./frame";

/** A 3×3 dot mark; each step lights a different pattern, so the three read as a set. */
function Dots({ on }: { on: number[] }) {
  return (
    <span aria-hidden="true" className="grid w-fit grid-cols-3 gap-1">
      {Array.from({ length: 9 }, (_, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: a fixed grid of nine dots that never reorders
          key={i}
          className={`size-1.5 rounded-full ${on.includes(i) ? "bg-accent-ink" : "bg-border"}`}
        />
      ))}
    </span>
  );
}

const code = "font-mono text-[0.8rem] leading-7 sm:text-sm";

const terminal = (
  <pre className={`m-0 whitespace-pre-wrap break-words p-6 ${code}`}>
    <span className="text-muted-foreground">$ </span>npx zuri add password-strength{"\n"}
    <span className="text-success">✔</span> Checking registry.{"\n"}
    <span className="text-success">✔</span> Installing dependencies.{"\n"}
    <span className="text-success">✔</span> Created 1 file:{"\n"}
    {"  "}- components/ui/password-strength.tsx
  </pre>
);

const tokens = (
  <pre className={`m-0 whitespace-pre-wrap break-words p-6 ${code}`}>
    <span className="text-muted-foreground">{"/* tokens.css */"}</span>
    {"\n"}:root {"{\n"}
    {"  "}--accent: oklch(0.76 0.16 60);{" "}
    <span aria-hidden="true" className="inline-block size-3 translate-y-0.5 rounded-sm bg-accent" />
    {"\n"}
    {"  "}--radius-md: 0.625rem;{"\n"}
    {"  "}--duration-base: 200ms;{"\n"}
    {"  "}--ease-out: cubic-bezier(0.23, 1, 0.32, 1);{"\n"}
    {"}"}
    {"\n"}
    <span className="text-muted-foreground">{"/* one change, every component follows */"}</span>
  </pre>
);

const steps: {
  id: string;
  title: string;
  text: string;
  points: string[];
  dots: number[];
  frame: { glow: "sunrise" | "bloom" | "tide"; title: string; body: ReactNode };
}[] = [
  {
    id: "copy",
    title: "Copy it",
    text: "One command puts the component in your project, along with the packages it needs.",
    points: [
      "Works through the shadcn CLI",
      "Or copy the single file by hand",
      "No runtime package to update",
    ],
    dots: [4],
    frame: { glow: "sunrise", title: "terminal", body: terminal },
  },
  {
    id: "shape",
    title: "Shape it",
    text: "Colour, corners and motion come from a handful of tokens. Change one and everything follows.",
    points: [
      "Light and dark from the same file",
      "Logical properties, so RTL works",
      "Glass with solid fallbacks",
    ],
    dots: [1, 3, 4, 5, 7],
    frame: { glow: "bloom", title: "tokens.css", body: tokens },
  },
  {
    id: "ship",
    title: "Ship it",
    text: "Keyboard support, focus and ARIA are already there. This one is running live, try it.",
    points: [
      "Visible focus, full keyboard use",
      "Honours reduced motion",
      "axe checks in the test suite",
    ],
    dots: [0, 2, 4, 6, 8],
    frame: {
      glow: "tide",
      title: "preview: password-strength",
      body: (
        <div className="grid h-full min-h-[18rem] place-items-center p-6">
          <div className="w-full max-w-sm">
            <LazyDemo name="password-default" />
          </div>
        </div>
      ),
    },
  },
];

/** Three steps, each beside a working picture of it. The rows alternate sides on wide screens. */
export function Workflow() {
  return (
    <ol className="m-0 flex list-none flex-col gap-20 p-0 lg:gap-28">
      {steps.map((s, i) => (
        <li
          key={s.id}
          className={`grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:gap-16 ${i % 2 ? "lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]" : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]"}`}
        >
          <Reveal
            from={i % 2 ? "end" : "start"}
            className={`flex min-w-0 flex-col gap-4 ${i % 2 ? "lg:order-2" : ""}`}
          >
            <Dots on={s.dots} />
            <h3 className="m-0 font-display text-4xl font-semibold tracking-tight">{s.title}</h3>
            <p className="m-0 max-w-sm text-pretty leading-relaxed text-muted-foreground">
              {s.text}
            </p>
            <ul className="m-0 mt-2 max-w-sm list-none p-0 text-sm">
              {s.points.map((p) => (
                <li key={p} className="border-t border-border py-3 last:border-b">
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100} className={`min-w-0 ${i % 2 ? "lg:order-1" : ""}`}>
            <Frame glow={s.frame.glow} title={s.frame.title}>
              {s.frame.body}
            </Frame>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
