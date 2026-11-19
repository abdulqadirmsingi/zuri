import { Breadcrumbs } from "@registry/navigation/breadcrumbs/breadcrumbs";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { curatedPairings, pairingHref } from "@/lib/fonts-pairing";
import { clampWeight } from "@/lib/fonts-preview";
import { fontsWithFaces } from "../fonts-faces";
import { PairingTool } from "./pairing-tool";

export const metadata: Metadata = {
  title: "Font pairings",
  description: "Try a heading font with a body font, side by side, and copy the code for the pair.",
};

export default function PairingsPage() {
  const fonts = fontsWithFaces();
  const faces = new Map(fonts.map((f) => [f.id, f]));
  const pairs = curatedPairings(fonts);
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-14 px-4 pb-24 pt-10 sm:px-8 sm:pt-14">
      <header className="flex flex-col gap-4">
        <Breadcrumbs items={[{ label: "Fonts", href: "/fonts" }, { label: "Pairings" }]} />
        <h1 className="m-0 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Font pairings
        </h1>
        <p className="m-0 max-w-2xl text-lg text-muted-foreground">
          A good heading font and a good body font make a page feel designed. Choose one of each,
          see them together, then copy the code.
        </p>
      </header>

      {/* The tool reads the URL, which a statically built page can only do on the client. */}
      <Suspense fallback={<p className="text-muted-foreground">Loading the pairing tool…</p>}>
        <PairingTool fonts={fonts} />
      </Suspense>

      <section
        aria-labelledby="curated"
        className="flex flex-col gap-5 border-t border-border pt-10"
      >
        <h2 id="curated" className="m-0 text-2xl font-semibold tracking-tight">
          Pairings we like
        </h2>
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3">
          {pairs.map(({ heading, body }) => {
            const h = faces.get(heading.id);
            const b = faces.get(body.id);
            return (
              <li key={`${heading.id}-${body.id}`} className="min-w-0">
                <Link
                  href={pairingHref(heading.id, body.id)}
                  className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-background p-5 transition-colors duration-[var(--duration-base)] hover:border-control-border hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
                >
                  <span className="text-sm font-medium">
                    {heading.family} + {body.family}
                  </span>
                  <span aria-hidden="true" className="flex flex-col gap-2">
                    <span
                      className="block text-2xl leading-tight"
                      style={{ fontFamily: h?.cssFamily, fontWeight: clampWeight(heading, 700) }}
                    >
                      Send money in seconds
                    </span>
                    <span
                      className="block text-sm leading-relaxed text-muted-foreground"
                      style={{ fontFamily: b?.cssFamily }}
                    >
                      A phone is now a wallet. People pay school fees and send money home.
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
