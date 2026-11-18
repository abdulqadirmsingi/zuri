import type { Metadata } from "next";
import { display, mono, sans } from "@/app/fonts";
import { fontsCatalog } from "@/lib/fonts-catalog";
import { FontsExplorer, type FontWithFace } from "./fonts-explorer";
import { familjenGrotesk, figtree } from "./library-fonts";

export const metadata: Metadata = {
  title: "Fonts",
  description:
    "A small, curated library of open fonts. Search, see them in real examples, and get the code to use them.",
};

// The CSS font-family string next/font generates for each loaded font.
const faces: Record<string, string> = {
  "bricolage-grotesque": display.style.fontFamily,
  "instrument-sans": sans.style.fontFamily,
  "martian-mono": mono.style.fontFamily,
  figtree: figtree.style.fontFamily,
  "familjen-grotesk": familjenGrotesk.style.fontFamily,
};

export default function FontsPage() {
  const fonts: FontWithFace[] = fontsCatalog.map((font) => ({
    ...font,
    cssFamily: faces[font.id] ?? "inherit",
  }));
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-8">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Fonts</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A small, curated set of open fonts. Search them, see each one in real examples (an
          article, a dashboard, a receipt), and copy the code to use it. Every font here is under
          the SIL Open Font Licence, so it is free to use, including commercially.
        </p>
      </header>
      <FontsExplorer fonts={fonts} />
    </main>
  );
}
