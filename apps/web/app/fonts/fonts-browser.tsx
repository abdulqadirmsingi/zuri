"use client";

import { Button } from "@registry/actions/button/button";
import { EmptyState } from "@registry/display/empty-state/empty-state";
import { Input } from "@registry/inputs/input/input";
import Link from "next/link";
import { useMemo, useState } from "react";
import { fontCategories } from "@/lib/fonts-catalog";
import { emptyFilter, type FontFilter, filterFonts, isFiltering } from "@/lib/fonts-filter";
import { DEFAULT_PREVIEW, MAX_PREVIEW_LENGTH, previewText, weightSteps } from "@/lib/fonts-preview";
import type { FontWithFace } from "./fonts-faces";
import { RangeField } from "./range-field";

const SIZE = { min: 16, max: 72, initial: 36 } as const;

function FontCard({ font, text, size }: { font: FontWithFace; text: string; size: number }) {
  const styles = weightSteps(font).length;
  return (
    <Link
      href={`/fonts/${font.id}`}
      className="group flex h-full flex-col gap-4 rounded-2xl border border-border bg-background p-5 transition-colors duration-[var(--duration-base)] hover:border-control-border hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
    >
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-base font-medium group-hover:underline group-hover:underline-offset-4">
          {font.family}
        </span>
        <span className="shrink-0 text-xs text-muted-foreground">
          {styles} {styles === 1 ? "weight" : "weights"}
        </span>
      </span>
      {/* The sample is decoration: the name and designer carry the meaning for screen readers. */}
      <span
        aria-hidden="true"
        className="block h-32 overflow-hidden break-words leading-[1.15]"
        style={{ fontFamily: font.cssFamily, fontSize: size, fontWeight: 500 }}
      >
        {text}
      </span>
      <span className="mt-auto text-sm text-muted-foreground">{font.designer}</span>
    </Link>
  );
}

export function FontsBrowser({ fonts }: { fonts: FontWithFace[] }) {
  const [filter, setFilter] = useState<FontFilter>(emptyFilter);
  const [typed, setTyped] = useState("");
  const [size, setSize] = useState<number>(SIZE.initial);
  const shown = useMemo(() => filterFonts(fonts, filter) as FontWithFace[], [fonts, filter]);
  // Only offer styles the library really has, so no chip leads to an empty page.
  const categories = fontCategories.filter((c) => fonts.some((f) => f.category === c.value));
  const text = previewText(typed);
  const changed = typed !== "" || size !== SIZE.initial;

  return (
    <div className="flex flex-col gap-8">
      <search className="flex flex-col gap-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_11rem] lg:items-end">
          <Input
            type="search"
            aria-label="Search fonts"
            placeholder="Search fonts"
            value={filter.query}
            onChange={(e) => setFilter((f) => ({ ...f, query: e.target.value }))}
          />
          <Input
            aria-label="Preview text"
            placeholder={DEFAULT_PREVIEW}
            maxLength={MAX_PREVIEW_LENGTH}
            autoComplete="off"
            spellCheck={false}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
          />
          <RangeField
            label="Size"
            unit="px"
            value={size}
            min={SIZE.min}
            max={SIZE.max}
            onChange={setSize}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            shape="pill"
            variant={filter.category === "all" ? "default" : "outline"}
            aria-pressed={filter.category === "all"}
            onClick={() => setFilter((f) => ({ ...f, category: "all" }))}
          >
            All
          </Button>
          {categories.map((c) => (
            <Button
              key={c.value}
              size="sm"
              shape="pill"
              variant={filter.category === c.value ? "default" : "outline"}
              aria-pressed={filter.category === c.value}
              onClick={() => setFilter((f) => ({ ...f, category: c.value }))}
            >
              {c.label}
            </Button>
          ))}
          {isFiltering(filter) || changed ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setFilter(emptyFilter);
                setTyped("");
                setSize(SIZE.initial);
              }}
            >
              Reset
            </Button>
          ) : null}
          <p role="status" className="m-0 ms-auto text-sm text-muted-foreground">
            {shown.length === 1 ? "1 font" : `${shown.length} fonts`}
          </p>
        </div>
      </search>

      {shown.length === 0 ? (
        <EmptyState
          title="No fonts match"
          description="Try a different word, or reset to see every font."
          action={
            <Button
              onClick={() => {
                setFilter(emptyFilter);
              }}
            >
              Show all fonts
            </Button>
          }
        />
      ) : (
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((font) => (
            <li key={font.id} className="min-w-0">
              <FontCard font={font} text={text} size={size} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
