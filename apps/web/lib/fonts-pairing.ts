import { type FontEntry, fontsCatalog, nextFontName } from "./fonts-catalog";
import { toIdentifier } from "./fonts-snippets";

/** A heading font and a body font that go together. */
export interface Pairing {
  heading: FontEntry;
  body: FontEntry;
}

const isHeadingFont = (f: FontEntry) => f.uses[0] === "headings";
const isBodyFont = (f: FontEntry) => f.uses[0] === "body" || f.uses[0] === "ui";

/**
 * The catalogue's suggested pairings, each as heading + body. A pair is suggested when either font
 * lists the other in `pairsWith`, one is a heading font and the other a body font. Code fonts are
 * left out here (they pair with anything, as an accent), though the tool still lets you pick them.
 */
export function curatedPairings(fonts: FontEntry[] = fontsCatalog): Pairing[] {
  const found: Pairing[] = [];
  const seen = new Set<string>();
  const byId = new Map(fonts.map((f) => [f.id, f]));
  for (const a of fonts) {
    for (const id of a.pairsWith) {
      const b = byId.get(id);
      if (!b || b.id === a.id) continue;
      const [heading, body] =
        isHeadingFont(a) && isBodyFont(b)
          ? [a, b]
          : isHeadingFont(b) && isBodyFont(a)
            ? [b, a]
            : [];
      if (!heading || !body) continue;
      const key = `${heading.id}|${body.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      found.push({ heading, body });
    }
  }
  return found;
}

/** The suggested pairings that involve one font, in either role. */
export function pairingsFor(font: FontEntry, fonts: FontEntry[] = fontsCatalog): Pairing[] {
  return curatedPairings(fonts).filter((p) => p.heading.id === font.id || p.body.id === font.id);
}

export const DEFAULT_PAIRING = { heading: "bricolage-grotesque", body: "instrument-sans" } as const;

/**
 * Reads a pairing from URL parameters. Anything missing or not in the catalogue falls back to the
 * default, so a mistyped or old link still opens a working page, and nothing from the URL is ever
 * used as anything but a lookup key.
 */
export function parsePairing(
  params: { get(name: string): string | null },
  fonts: FontEntry[] = fontsCatalog,
): { heading: string; body: string } {
  const known = new Set(fonts.map((f) => f.id));
  const pick = (name: "heading" | "body") => {
    const value = params.get(name);
    return value && known.has(value) ? value : DEFAULT_PAIRING[name];
  };
  return { heading: pick("heading"), body: pick("body") };
}

export function pairingHref(heading: string, body: string): string {
  return `/fonts/pairings?heading=${encodeURIComponent(heading)}&body=${encodeURIComponent(body)}`;
}

const fallbacks = {
  display: "ui-sans-serif, system-ui, sans-serif",
  sans: "ui-sans-serif, system-ui, sans-serif",
  serif: "ui-serif, Georgia, serif",
  mono: "ui-monospace, monospace",
} as const;

/** The Tailwind theme role a font fills when it is the body font. */
function bodyRole(font: FontEntry): "sans" | "serif" | "mono" {
  return font.category === "mono" ? "mono" : font.category === "serif" ? "serif" : "sans";
}

/** Code to load both fonts with next/font and give each its role in the Tailwind v4 theme. */
export function pairingSnippet(heading: FontEntry, body: FontEntry): string {
  const same = heading.id === body.id;
  const fonts = same ? [heading] : [heading, body];
  const names = fonts.map(nextFontName).join(", ");
  const loaders = fonts
    .map((f) => {
      const subsets = ["latin", "latin-ext"].filter((s) => f.subsets.includes(s));
      return `export const ${toIdentifier(f.id)} = ${nextFontName(f)}({
  subsets: [${subsets.map((s) => `"${s}"`).join(", ")}],
  variable: "--font-${f.id}",
  display: "swap",
});`;
    })
    .join("\n\n");
  const classes = fonts.map((f) => `\${${toIdentifier(f.id)}.variable}`).join(" ");
  const role = bodyRole(body);
  return `/* fonts.ts */
import { ${names} } from "next/font/google";

${loaders}

/* app/layout.tsx */
<html lang="en" className={\`${classes}\`}>

/* app/globals.css */
@theme inline {
  --font-display: var(--font-${heading.id}), ${fallbacks.display};
  --font-${role}: var(--font-${body.id}), ${fallbacks[role]};
}`;
}
