import { buttonVariants } from "@registry/actions/button/button";
import { Badge } from "@registry/display/badge/badge";
import { Stat } from "@registry/display/stat/stat";
import { Breadcrumbs } from "@registry/navigation/breadcrumbs/breadcrumbs";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  findFont,
  fontCategories,
  fontsCatalog,
  googleFontsUrl,
  LICENCE_NAME,
  LICENCE_URL,
} from "@/lib/fonts-catalog";
import { glyphRows, weightName, weightSteps } from "@/lib/fonts-preview";
import { applySnippet, nextFontSnippet } from "@/lib/fonts-snippets";
import { CodeBlock } from "../code-block";
import { fontsWithFaces } from "../fonts-faces";
import { FontTester } from "./font-tester";

export const dynamicParams = false;

export function generateStaticParams() {
  return fontsCatalog.map((font) => ({ id: font.id }));
}

export async function generateMetadata({ params }: PageProps<"/fonts/[id]">): Promise<Metadata> {
  const { id } = await params;
  const font = findFont(id);
  return font ? { title: font.family, description: `${font.summary} ${font.bestFor}` } : {};
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-5 border-t border-border pt-10">
      <h2 id={id} className="m-0 text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function FontPage({ params }: PageProps<"/fonts/[id]">) {
  const { id } = await params;
  const font = fontsWithFaces().find((f) => f.id === id);
  if (!font) notFound();
  const face = { fontFamily: font.cssFamily };
  const category = fontCategories.find((c) => c.value === font.category)?.label ?? font.category;
  const pairs = font.pairsWith.map((pid) => findFont(pid)).filter((f) => f !== undefined);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-4 pb-24 pt-10 sm:px-8 sm:pt-14">
      <header className="flex flex-col gap-5">
        <Breadcrumbs items={[{ label: "Fonts", href: "/fonts" }, { label: font.family }]} />
        <h1
          className="m-0 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl"
          style={face}
        >
          {font.family}
        </h1>
        <p className="m-0 text-lg text-muted-foreground">
          Designed by {font.designer} · {category}
        </p>
        <p className="m-0 max-w-2xl text-lg">{font.summary}</p>
        <div className="flex flex-wrap items-center gap-3">
          <a href="#use" className={buttonVariants({ shape: "pill", size: "lg" })}>
            Get this font
          </a>
          <a
            href={googleFontsUrl(font)}
            rel="noopener noreferrer"
            target="_blank"
            className={buttonVariants({ variant: "outline", shape: "pill", size: "lg" })}
          >
            View on Google Fonts
          </a>
          {font.inZuri ? <Badge variant="secondary">{font.inZuri}</Badge> : null}
        </div>
      </header>

      <Section id="try" title="Try it">
        <FontTester font={font} />
      </Section>

      <Section id="weights" title="Weights">
        <ul className="m-0 flex list-none flex-col p-0" aria-label={`${font.family} weights`}>
          {weightSteps(font).map((w) => (
            <li
              key={w}
              className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-4 border-b border-border py-3 last:border-b-0 sm:grid-cols-[8rem_minmax(0,1fr)]"
            >
              <span className="text-sm text-muted-foreground">
                {weightName(w)} <span className="tabular-nums">{w}</span>
              </span>
              <span
                aria-hidden="true"
                className="truncate text-3xl"
                style={{ ...face, fontWeight: w }}
              >
                Send money in seconds
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="characters" title="Characters">
        <div aria-hidden="true" className="flex flex-col gap-2 text-2xl leading-snug" style={face}>
          {glyphRows.map((row) => (
            <span key={row} className="break-all">
              {row}
            </span>
          ))}
        </div>
        <p className="m-0 text-sm text-muted-foreground">Supports {font.subsets.join(", ")}.</p>
      </Section>

      <Section id="in-use" title="In use">
        <div
          aria-hidden="true"
          className="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-4"
          style={face}
        >
          <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-border p-5">
            <h3 className="m-0 text-xl font-semibold leading-snug">
              Why mobile money changed everything
            </h3>
            <p className="m-0 text-sm leading-relaxed text-muted-foreground">
              A phone is now a wallet. People pay school fees, shop and send money home without
              visiting a bank.
            </p>
          </div>
          <div className="flex min-w-0 flex-col justify-center rounded-2xl border border-border p-5">
            <Stat
              label="Revenue"
              value="TZS 1,240,000"
              change="12%"
              trend="up"
              changeLabel="vs last month"
            />
          </div>
          <div className="flex min-w-0 flex-col justify-center rounded-2xl border border-border p-5">
            <dl className="m-0 flex flex-col gap-1.5 text-sm tabular-nums">
              <div className="flex justify-between gap-3">
                <dt>School fees</dt>
                <dd className="m-0 whitespace-nowrap">TZS 45,000</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Service fee</dt>
                <dd className="m-0 whitespace-nowrap">TZS 12,500</dd>
              </div>
              <div className="mt-1 flex justify-between gap-3 border-t border-border pt-2 font-semibold">
                <dt>Total</dt>
                <dd className="m-0 whitespace-nowrap">TZS 57,500</dd>
              </div>
            </dl>
          </div>
        </div>
        <p className="m-0 text-muted-foreground">{font.bestFor}</p>
      </Section>

      <Section id="use" title="Use this font">
        <p className="m-0 text-muted-foreground">
          Self-host it with next/font, so visitors never make a request to Google.
        </p>
        <CodeBlock label="1. Load the font" code={nextFontSnippet(font)} />
        <CodeBlock label="2. Apply it" code={applySnippet(font)} />
        <p className="m-0 text-sm text-muted-foreground">
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
      </Section>

      {pairs.length > 0 ? (
        <Section id="pairs" title="Pairs well with">
          <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
            {pairs.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/fonts/${p.id}`}
                  className={buttonVariants({ variant: "outline", shape: "pill" })}
                >
                  {p.family}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </main>
  );
}
