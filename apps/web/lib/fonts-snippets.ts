import { type FontEntry, nextFontName } from "./fonts-catalog";

/** "source-serif-4" becomes sourceSerif4. Digits count too, or the name would not be valid JavaScript. */
export const toIdentifier = (id: string) =>
  id.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());

/** The Tailwind theme variable the font should fill, chosen from what it is. */
function themeVariable(
  font: FontEntry,
): "--font-sans" | "--font-serif" | "--font-display" | "--font-mono" {
  if (font.category === "mono") return "--font-mono";
  if (font.category === "serif") return "--font-serif";
  if (font.category === "display" || font.uses[0] === "headings") return "--font-display";
  return "--font-sans";
}

const fallbacks = {
  "--font-sans": "ui-sans-serif, system-ui, sans-serif",
  "--font-serif": "ui-serif, Georgia, serif",
  "--font-display": "ui-sans-serif, system-ui, sans-serif",
  "--font-mono": "ui-monospace, monospace",
} as const;

/** Step 1: load the font with next/font so it is self-hosted (visitors make no request to Google). */
export function nextFontSnippet(font: FontEntry): string {
  const name = nextFontName(font);
  const subsets = ["latin", "latin-ext"].filter((s) => font.subsets.includes(s));
  return `import { ${name} } from "next/font/google";

export const ${toIdentifier(font.id)} = ${name}({
  subsets: [${subsets.map((s) => `"${s}"`).join(", ")}],
  variable: "--font-${font.id}",
  display: "swap",
});`;
}

/** Step 2: add the font's variable to <html> and point the Tailwind v4 theme at it. */
export function applySnippet(font: FontEntry): string {
  const ident = toIdentifier(font.id);
  const variable = themeVariable(font);
  return `/* app/layout.tsx */
<html lang="en" className={${ident}.variable}>

/* app/globals.css */
@theme inline {
  ${variable}: var(--font-${font.id}), ${fallbacks[variable]};
}`;
}

/** The weights worth showing for a font: its lightest, a regular, and its heaviest. */
export function sampleWeights(font: FontEntry): number[] {
  const regular = Math.min(Math.max(400, font.weights.min), font.weights.max);
  return [...new Set([font.weights.min, regular, font.weights.max])];
}
