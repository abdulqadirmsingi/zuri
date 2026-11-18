import type { FontCategory, FontEntry, FontUse } from "./fonts-catalog";

export interface FontFilter {
  /** Free text. Every word must match somewhere in the font's name, designer or description. */
  query: string;
  category: FontCategory | "all";
  /** A font must have every selected use. */
  uses: FontUse[];
}

export const emptyFilter: FontFilter = { query: "", category: "all", uses: [] };

export function isFiltering(filter: FontFilter): boolean {
  return filter.query.trim() !== "" || filter.category !== "all" || filter.uses.length > 0;
}

/** Lower-cases and strips accents, so "Grotésque" is found by "grotesque". */
function normalise(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

function haystack(font: FontEntry): string {
  return normalise(
    [font.family, font.category, font.designer, font.summary, font.bestFor, ...font.uses].join(" "),
  );
}

export function filterFonts(fonts: FontEntry[], filter: FontFilter): FontEntry[] {
  const words = normalise(filter.query).split(/\s+/).filter(Boolean);
  return fonts.filter((font) => {
    if (filter.category !== "all" && font.category !== filter.category) return false;
    if (!filter.uses.every((use) => font.uses.includes(use))) return false;
    const text = haystack(font);
    return words.every((word) => text.includes(word));
  });
}
