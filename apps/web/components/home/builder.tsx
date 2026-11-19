"use client";

import { CopyButton } from "@registry/actions/copy-button/copy-button";
import { Picker } from "@registry/inputs/picker/picker";
import Link from "next/link";
import { type CSSProperties, useState } from "react";
import { LazyDemo } from "@/components/demos/lazy-demo";
import { useThemeLab } from "./theme-lab";

export interface BuilderItem {
  /** Registry name, also the docs slug. */
  id: string;
  /** What the sentence says, with its article: "a dialog", "some tabs". */
  phrase: string;
  /** The heading the component is listed under. */
  group: string;
  /** Name of the live demo. */
  demo: string;
  /** How much bigger than normal to show the demo on the stage. */
  scale: number;
  command: string;
}

const corners = [
  { value: "sharp", label: "sharp", radius: 2 },
  { value: "soft", label: "soft", radius: 10 },
  { value: "round", label: "round", radius: 20 },
];

const colours = [
  { value: "saffron", label: "saffron", hue: 60 },
  { value: "coral", label: "coral", hue: 25 },
  { value: "leaf", label: "leaf", hue: 150 },
  { value: "ocean", label: "ocean", hue: 235 },
  { value: "plum", label: "plum", hue: 320 },
];

/**
 * The home page's hero: one sentence you finish by picking words. The words are our own Picker, so
 * the list can be long (it has search and groups) and looks the same everywhere. The choice
 * re-themes the whole page with the real Zuri tokens, and the chosen component runs live below,
 * with the one command that installs it.
 */
export function Builder({ items, initialId }: { items: BuilderItem[]; initialId?: string }) {
  const { hue, radius, setHue, setRadius, css } = useThemeLab();
  const [id, setId] = useState(initialId ?? items[0]?.id);
  const item = items.find((i) => i.id === id) ?? items[0];
  if (!item) return null;

  const colour = colours.find((c) => c.hue === hue)?.value ?? "saffron";
  const corner = corners.find((c) => c.radius === radius)?.value ?? "soft";

  return (
    <div className="flex flex-col gap-10">
      <p className="m-0 text-balance font-display text-[clamp(2.5rem,6.2vw,5.75rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
        Show me{" "}
        <Picker
          variant="inline"
          aria-label="Component"
          searchLabel="Search components"
          panelLabel="Components"
          emptyText="No component matches"
          options={items.map((i) => ({
            value: i.id,
            label: i.phrase,
            group: i.group,
            keywords: [i.id.replace(/-/g, " ")],
          }))}
          value={item.id}
          onValueChange={setId}
        />{" "}
        with{" "}
        <Picker
          variant="inline"
          aria-label="Corners"
          panelLabel="Corners"
          options={corners}
          value={corner}
          onValueChange={(v) => setRadius(corners.find((c) => c.value === v)?.radius ?? 10)}
        />{" "}
        corners in{" "}
        <Picker
          variant="inline"
          aria-label="Colour"
          panelLabel="Colours"
          options={colours}
          value={colour}
          onValueChange={(v) => setHue(colours.find((c) => c.value === v)?.hue ?? 60)}
        />
        .
      </p>

      <div className="relative flex min-h-[14rem] items-center justify-center overflow-hidden rounded-3xl border border-border bg-muted p-6 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:18px_18px] sm:min-h-[20rem] sm:p-10">
        <div
          key={item.id}
          style={{ "--stage-scale": item.scale } as CSSProperties}
          className="flex w-full max-w-md animate-[zuri-rise_var(--duration-slow)_var(--ease-out)] flex-wrap items-center justify-center gap-3 sm:scale-[var(--stage-scale)]"
        >
          <LazyDemo name={item.demo} />
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
