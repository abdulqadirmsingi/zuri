"use client";

import { CopyButton } from "@registry/actions/copy-button/copy-button";
import Link from "next/link";
import { type CSSProperties, type ReactNode, useId, useState } from "react";
import { useThemeLab } from "./theme-lab";

export interface BuilderItem {
  /** Registry name, also the docs slug. */
  id: string;
  /** Lower-case name used inside the sentence, e.g. "dropdown menu". */
  word: string;
  /** The live demo, rendered on the server and passed in. */
  demo: ReactNode;
  command: string;
  /** How much bigger than normal to show the demo on the stage. */
  scale: number;
}

const corners = [
  { word: "sharp", radius: 2 },
  { word: "soft", radius: 10 },
  { word: "round", radius: 20 },
];

const colours = [
  { word: "saffron", hue: 60 },
  { word: "coral", hue: 25 },
  { word: "leaf", hue: 150 },
  { word: "ocean", hue: 235 },
  { word: "plum", hue: 320 },
];

/**
 * A word in the sentence that is really a native `<select>`. A hidden copy of the chosen word sets
 * the width, so the control is exactly as wide as the word, in any browser.
 */
function Word({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <span className="relative inline-block align-baseline">
      <span aria-hidden="true" className="invisible whitespace-pre pe-[0.5em]">
        {value}
      </span>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-[0.15em] border-0 border-b-[0.07em] border-solid border-accent bg-transparent p-0 pe-[0.5em] text-accent-ink [font:inherit] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-background font-sans text-base text-foreground">
            {o}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute end-[0.05em] top-1/2 -translate-y-1/2 text-[0.28em] text-accent-ink"
      >
        ▼
      </span>
    </span>
  );
}

/**
 * The home page's hero: one sentence you finish by picking words. The choice re-themes the whole
 * page (the colour and corners are the real Zuri tokens) and the chosen component runs live below,
 * with the one command that installs it.
 */
export function Builder({ items }: { items: BuilderItem[] }) {
  const { hue, radius, setHue, setRadius, css } = useThemeLab();
  const [id, setId] = useState(items[0]?.id);
  const item = items.find((i) => i.id === id) ?? items[0];
  if (!item) return null;

  const colour = colours.find((c) => c.hue === hue)?.word ?? "saffron";
  const corner = corners.find((c) => c.radius === radius)?.word ?? "soft";

  return (
    <div className="flex flex-col gap-10">
      <p className="m-0 text-balance font-display text-[clamp(2.5rem,6.2vw,5.75rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
        Show me{" "}
        <Word
          label="Component"
          value={item.word}
          options={items.map((i) => i.word)}
          onChange={(w) => setId(items.find((i) => i.word === w)?.id)}
        />{" "}
        with{" "}
        <Word
          label="Corners"
          value={corner}
          options={corners.map((c) => c.word)}
          onChange={(w) => setRadius(corners.find((c) => c.word === w)?.radius ?? 10)}
        />{" "}
        corners in{" "}
        <Word
          label="Colour"
          value={colour}
          options={colours.map((c) => c.word)}
          onChange={(w) => setHue(colours.find((c) => c.word === w)?.hue ?? 60)}
        />
        .
      </p>

      <div className="relative flex min-h-[14rem] items-center sm:min-h-[20rem] justify-center overflow-hidden rounded-3xl border border-border bg-muted p-6 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:18px_18px] sm:p-10">
        <div
          key={item.id}
          style={{ "--stage-scale": item.scale } as CSSProperties}
          className="flex w-full max-w-md animate-[zuri-rise_var(--duration-slow)_var(--ease-out)] flex-wrap sm:scale-[var(--stage-scale)] items-center justify-center gap-3"
        >
          {item.demo}
        </div>
        <span
          aria-hidden="true"
          className="absolute bottom-4 start-5 font-mono text-xs uppercase tracking-wider text-muted-foreground"
        >
          Live. Try it.
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex min-w-0 flex-1 basis-96 items-center gap-2 rounded-xl border border-border bg-background py-1.5 ps-4 pe-1.5">
          <span aria-hidden="true" className="select-none font-mono text-sm text-accent-ink">
            $
          </span>
          <code className="min-w-0 flex-1 break-all font-mono text-xs sm:text-sm">
            {item.command}
          </code>
          <CopyButton
            value={item.command}
            iconOnly
            label="Copy the command"
            variant="ghost"
            size="sm"
          />
        </div>
        <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-wider">
          <span className="flex items-center">
            <CopyButton value={css} variant="ghost" size="sm" label="Copy theme CSS" />
          </span>
          <Link
            href={`/docs/components/${item.id}`}
            className="rounded-sm hover:text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Docs →
          </Link>
        </div>
      </div>
    </div>
  );
}
