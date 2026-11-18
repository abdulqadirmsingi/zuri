import type { Metadata } from "next";
import { FontsBrowser } from "./fonts-browser";
import { fontsWithFaces } from "./fonts-faces";

export const metadata: Metadata = {
  title: "Fonts",
  description: "A small library of open fonts. Preview your own text, then pick one to use.",
};

export default function FontsPage() {
  const fonts = fontsWithFaces();
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-12 sm:px-8 sm:pt-16">
      <header className="mb-10 max-w-2xl">
        <h1 className="m-0 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Fonts
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Open fonts, free to use. Type your own text to preview them, then pick one.
        </p>
      </header>
      <FontsBrowser fonts={fonts} />
    </main>
  );
}
