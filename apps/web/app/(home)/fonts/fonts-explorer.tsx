"use client";

import { Button } from "@registry/actions/button/button";
import { CopyButton } from "@registry/actions/copy-button/copy-button";
import { Badge } from "@registry/display/badge/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@registry/display/card/card";
import { EmptyState } from "@registry/display/empty-state/empty-state";
import { Stat } from "@registry/display/stat/stat";
import { Input } from "@registry/inputs/input/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@registry/navigation/tabs/tabs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@registry/overlays/dialog/dialog";
import { useId, useMemo, useState } from "react";
import {
  type FontCategory,
  type FontEntry,
  type FontUse,
  findFont,
  fontCategories,
  fontUses,
  googleFontsUrl,
  LICENCE_NAME,
  LICENCE_URL,
} from "@/lib/fonts-catalog";
import { emptyFilter, type FontFilter, filterFonts, isFiltering } from "@/lib/fonts-filter";
import { applySnippet, nextFontSnippet, sampleWeights } from "@/lib/fonts-snippets";

/** A catalogue entry plus the CSS font-family string next/font generated for it. */
export type FontWithFace = FontEntry & { cssFamily: string };

export function FontsExplorer({ fonts }: { fonts: FontWithFace[] }) {
  const searchId = useId();
  const [filter, setFilter] = useState<FontFilter>(emptyFilter);
  const shown = useMemo(() => filterFonts(fonts, filter) as FontWithFace[], [fonts, filter]);

  const toggleUse = (use: FontUse) =>
    setFilter((f) => ({
      ...f,
      uses: f.uses.includes(use) ? f.uses.filter((u) => u !== use) : [...f.uses, use],
    }));

  return (
    <div className="flex flex-col gap-6">
      <search className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={searchId} className="text-sm font-medium">
            Search fonts
          </label>
          <Input
            id={searchId}
            type="search"
            placeholder="Try “mono”, “headings” or a designer’s name"
            value={filter.query}
            onChange={(e) => setFilter((f) => ({ ...f, query: e.target.value }))}
            className="max-w-md"
          />
        </div>

        <fieldset className="flex min-w-0 flex-col gap-2 border-0 p-0">
          <legend className="mb-1 text-sm font-medium">Style</legend>
          <div className="flex flex-wrap gap-2">
            {[{ value: "all" as const, label: "All" }, ...fontCategories].map((c) => (
              <Button
                key={c.value}
                size="sm"
                shape="pill"
                variant={filter.category === c.value ? "default" : "outline"}
                aria-pressed={filter.category === c.value}
                onClick={() =>
                  setFilter((f) => ({ ...f, category: c.value as FontCategory | "all" }))
                }
              >
                {c.label}
              </Button>
            ))}
          </div>
        </fieldset>

        <fieldset className="flex min-w-0 flex-col gap-2 border-0 p-0">
          <legend className="mb-1 text-sm font-medium">Good for</legend>
          <div className="flex flex-wrap gap-2">
            {fontUses.map((u) => (
              <Button
                key={u.value}
                size="sm"
                shape="pill"
                variant={filter.uses.includes(u.value) ? "default" : "outline"}
                aria-pressed={filter.uses.includes(u.value)}
                onClick={() => toggleUse(u.value)}
              >
                {u.label}
              </Button>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center gap-3">
          <p role="status" className="text-sm text-muted-foreground">
            {shown.length === fonts.length
              ? `Showing all ${fonts.length} fonts`
              : `Showing ${shown.length} of ${fonts.length} fonts`}
          </p>
          {isFiltering(filter) ? (
            <Button size="sm" variant="ghost" onClick={() => setFilter(emptyFilter)}>
              Clear filters
            </Button>
          ) : null}
        </div>
      </search>

      {shown.length === 0 ? (
        <EmptyState
          title="No fonts match"
          description="Try a different word, or clear the filters to see every font."
          action={<Button onClick={() => setFilter(emptyFilter)}>Clear filters</Button>}
        />
      ) : (
        <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 lg:grid-cols-2">
          {shown.map((font) => (
            <li key={font.id} className="min-w-0">
              <FontCard font={font} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FontCard({ font }: { font: FontWithFace }) {
  const pairs = font.pairsWith.map((id) => findFont(id)?.family).filter(Boolean);
  const category = fontCategories.find((c) => c.value === font.category)?.label ?? font.category;
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle as="h2" className="text-xl">
            {font.family}
          </CardTitle>
          <Badge variant="outline">{category}</Badge>
          {font.inZuri ? <Badge variant="secondary">{font.inZuri}</Badge> : null}
        </div>
        <CardDescription>{font.summary}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* The specimen is real text set in the font itself. */}
        <div
          className="rounded-lg border border-border bg-muted/40 p-4"
          style={{ fontFamily: font.cssFamily }}
        >
          <p className="text-3xl font-semibold leading-tight">Tuma pesa kwa urahisi</p>
          <p className="mt-2 text-base">
            The quick brown fox jumps over the lazy dog. Habari, karibu Zuri!
          </p>
          <p className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-2xl">
            {sampleWeights(font).map((w) => (
              <span key={w} style={{ fontWeight: w }}>
                Aa <span className="text-xs text-muted-foreground">{w}</span>
              </span>
            ))}
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium">See it in use</h3>
          <Tabs defaultValue="article">
            <TabsList aria-label={`${font.family} examples`} variant="line">
              <TabsTrigger value="article">Article</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="receipt">Receipt</TabsTrigger>
            </TabsList>
            <div style={{ fontFamily: font.cssFamily }}>
              <TabsContent value="article" className="pt-3">
                <h4 className="text-xl font-semibold leading-snug">
                  Why mobile money changed everything
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  A phone is now a wallet. People pay school fees, shop and send money home without
                  visiting a bank, and good type makes every one of those screens easier to trust.
                </p>
              </TabsContent>
              <TabsContent value="dashboard" className="pt-3">
                <div className="flex flex-wrap gap-8">
                  <Stat
                    label="Revenue"
                    value="TZS 1,240,000"
                    change="12%"
                    trend="up"
                    changeLabel="vs last month"
                  />
                  <Stat label="Failed payments" value="14" change="3%" trend="down" />
                </div>
              </TabsContent>
              <TabsContent value="receipt" className="pt-3">
                <dl className="m-0 flex max-w-xs flex-col gap-1.5 text-sm tabular-nums">
                  <div className="flex justify-between gap-4">
                    <dt>School fees</dt>
                    <dd className="m-0">TZS 45,000</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Service fee</dt>
                    <dd className="m-0">TZS 12,500</dd>
                  </div>
                  <div className="mt-1 flex justify-between gap-4 border-t border-border pt-2 font-semibold">
                    <dt>Total</dt>
                    <dd className="m-0">TZS 57,500</dd>
                  </div>
                </dl>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-muted-foreground">Best for</dt>
          <dd className="m-0">{font.bestFor}</dd>
          <dt className="text-muted-foreground">Designer</dt>
          <dd className="m-0">{font.designer}</dd>
          <dt className="text-muted-foreground">Weights</dt>
          <dd className="m-0">
            {font.weights.min}–{font.weights.max}
            {font.axes.length > 1 ? ` · extra axes: ${font.axes.slice(1).join(", ")}` : ""}
          </dd>
          {pairs.length ? (
            <>
              <dt className="text-muted-foreground">Pairs with</dt>
              <dd className="m-0">{pairs.join(", ")}</dd>
            </>
          ) : null}
        </dl>

        <GetFont font={font} />
      </CardContent>
    </Card>
  );
}

function Code({ label, code }: { label: string; code: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium">{label}</h3>
        <CopyButton value={code} label="Copy" size="sm" />
      </div>
      {/* The block scrolls sideways on narrow screens, so it is focusable and named. */}
      <section
        aria-label={`${label} code`}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region needs a tab stop so keyboard users can scroll it.
        tabIndex={0}
        className="overflow-x-auto rounded-md bg-muted p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <pre className="m-0 font-mono text-xs leading-relaxed">
          <code>{code}</code>
        </pre>
      </section>
    </div>
  );
}

function GetFont({ font }: { font: FontWithFace }) {
  return (
    <Dialog>
      <DialogTrigger className="inline-flex min-h-10 w-fit items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
        Get {font.family}
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Use {font.family}</DialogTitle>
          <DialogDescription>
            Self-host it with next/font, so visitors never make a request to Google.
          </DialogDescription>
        </DialogHeader>
        <Code label="1. Load the font" code={nextFontSnippet(font)} />
        <Code label="2. Apply it" code={applySnippet(font)} />
        <div className="flex flex-col gap-2 text-sm">
          <h3 className="font-medium">Licence</h3>
          <p className="m-0 text-muted-foreground">
            {font.family} is under the{" "}
            <a
              className="underline underline-offset-4"
              href={LICENCE_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              {LICENCE_NAME}
            </a>
            : free to use, including in commercial work. If you pass the font files on, keep this
            notice with them: <span className="font-mono text-xs">{font.copyright}</span>
          </p>
          <p className="m-0 flex flex-wrap gap-x-4 gap-y-1">
            <a
              className="underline underline-offset-4"
              href={googleFontsUrl(font)}
              rel="noopener noreferrer"
              target="_blank"
            >
              Download from Google Fonts
            </a>
            <a
              className="underline underline-offset-4"
              href={font.sourceUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Source repository
            </a>
          </p>
        </div>
        <DialogClose className="inline-flex min-h-10 w-fit items-center justify-center rounded-md border border-border px-4 text-sm font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          Done
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
