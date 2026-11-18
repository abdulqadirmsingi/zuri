import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import {
  findFont,
  fontsCatalog,
  googleFontsUrl,
  LICENCE_NAME,
  nextFontName,
} from "./fonts-catalog";
import { emptyFilter, filterFonts, isFiltering } from "./fonts-filter";
import {
  clampWeight,
  DEFAULT_PREVIEW,
  glyphRows,
  MAX_PREVIEW_LENGTH,
  previewText,
  SIZE_RANGE,
  WEIGHT_RANGE,
  weightName,
  weightSteps,
} from "./fonts-preview";
import { applySnippet, nextFontSnippet, sampleWeights } from "./fonts-snippets";

type NextFontData = Record<
  string,
  { weights: string[]; axes?: { tag: string; min: number; max: number }[]; subsets: string[] }
>;
const nextData = createRequire(import.meta.url)(
  "next/dist/compiled/@next/font/dist/google/font-data.json",
) as NextFontData;

describe("fonts catalogue", () => {
  it("has unique kebab-case ids", () => {
    const ids = fontsCatalog.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("only lists fonts with a recorded copyright line, designer and https source", () => {
    for (const f of fontsCatalog) {
      expect(f.copyright, f.id).toMatch(/^Copyright \d{4} /);
      expect(f.designer, f.id).toBeTruthy();
      expect(f.sourceUrl, f.id).toMatch(/^https:\/\//);
      expect(f.copyright, f.id).toContain(f.sourceUrl);
    }
  });

  // Regression guard: a typo in a family name or an invented weight range would give people
  // a snippet that fails to build, so check against the data next/font itself uses.
  it("matches what next/font knows about each family", () => {
    for (const f of fontsCatalog) {
      const known = nextData[f.family];
      expect(known, `${f.family} is a Google font`).toBeDefined();
      const wght = known?.axes?.find((a) => a.tag === "wght");
      expect(f.weights, f.id).toEqual({ min: wght?.min, max: wght?.max });
      expect(f.axes[0], f.id).toBe("wght");
      expect([...f.axes].sort(), f.id).toEqual((known?.axes ?? []).map((a) => a.tag).sort());
      for (const s of f.subsets) expect(known?.subsets, `${f.id} ${s}`).toContain(s);
      expect(f.subsets, f.id).toContain("latin");
    }
  });

  it("refers only to fonts that exist when listing pairings", () => {
    for (const f of fontsCatalog) {
      for (const id of f.pairsWith) expect(findFont(id), `${f.id} pairs with ${id}`).toBeDefined();
      expect(f.pairsWith).not.toContain(f.id);
    }
  });

  it("builds next/font and Google Fonts names correctly", () => {
    const familjen = findFont("familjen-grotesk");
    expect(familjen && nextFontName(familjen)).toBe("Familjen_Grotesk");
    expect(familjen && googleFontsUrl(familjen)).toBe(
      "https://fonts.google.com/specimen/Familjen+Grotesk",
    );
    expect(LICENCE_NAME).toContain("1.1");
  });
});

describe("filterFonts", () => {
  it("returns everything for the empty filter", () => {
    expect(filterFonts(fontsCatalog, emptyFilter)).toHaveLength(fontsCatalog.length);
    expect(isFiltering(emptyFilter)).toBe(false);
  });

  it("matches words in any order and ignores case and surrounding spaces", () => {
    const ids = (q: string) =>
      filterFonts(fontsCatalog, { ...emptyFilter, query: q }).map((f) => f.id);
    expect(ids("  FIGTREE ")).toEqual(["figtree"]);
    expect(ids("grotesk familjen")).toEqual(["familjen-grotesk"]);
  });

  it("is accent-insensitive", () => {
    const hits = filterFonts(fontsCatalog, { ...emptyFilter, query: "grotésque" });
    expect(hits.map((f) => f.id)).toContain("bricolage-grotesque");
  });

  it("searches the designer and the description", () => {
    expect(
      filterFonts(fontsCatalog, { ...emptyFilter, query: "erik kennedy" }).map((f) => f.id),
    ).toEqual(["figtree"]);
    expect(filterFonts(fontsCatalog, { ...emptyFilter, query: "digit" }).map((f) => f.id)).toEqual([
      "martian-mono",
    ]);
  });

  it("filters by category", () => {
    const mono = filterFonts(fontsCatalog, { ...emptyFilter, category: "mono" });
    expect(mono.map((f) => f.id)).toEqual(["martian-mono"]);
    expect(filterFonts(fontsCatalog, { ...emptyFilter, category: "serif" })).toEqual([]);
  });

  it("requires every selected use", () => {
    const both = filterFonts(fontsCatalog, { ...emptyFilter, uses: ["ui", "headings"] });
    expect(both.map((f) => f.id)).toEqual(["figtree"]);
    const body = filterFonts(fontsCatalog, { ...emptyFilter, uses: ["body"] });
    expect(body.map((f) => f.id).sort()).toEqual([
      "familjen-grotesk",
      "figtree",
      "instrument-sans",
    ]);
  });

  it("combines search, category and use, and finds nothing for nonsense", () => {
    expect(
      filterFonts(fontsCatalog, { query: "sans", category: "sans", uses: ["ui"] })
        .map((f) => f.id)
        .sort(),
    ).toEqual(["figtree", "instrument-sans"]);
    expect(filterFonts(fontsCatalog, { ...emptyFilter, query: "zzzz" })).toEqual([]);
    expect(isFiltering({ ...emptyFilter, uses: ["ui"] })).toBe(true);
  });

  it("does not mutate the catalogue", () => {
    const before = fontsCatalog.map((f) => f.id);
    filterFonts(fontsCatalog, { ...emptyFilter, query: "figtree" });
    expect(fontsCatalog.map((f) => f.id)).toEqual(before);
  });
});

describe("snippets", () => {
  it("writes a next/font loader with the right import, variable and subsets", () => {
    const familjen = findFont("familjen-grotesk");
    if (!familjen) throw new Error("missing font");
    const code = nextFontSnippet(familjen);
    expect(code).toContain('import { Familjen_Grotesk } from "next/font/google";');
    expect(code).toContain("export const familjenGrotesk = Familjen_Grotesk({");
    expect(code).toContain('variable: "--font-familjen-grotesk"');
    expect(code).toContain('subsets: ["latin", "latin-ext"]');
    expect(code).not.toContain("vietnamese");
  });

  it("points the theme at the right role: headings, interface or mono", () => {
    const get = (id: string) => {
      const f = findFont(id);
      if (!f) throw new Error(id);
      return applySnippet(f);
    };
    expect(get("bricolage-grotesque")).toContain("--font-display: var(--font-bricolage-grotesque)");
    expect(get("instrument-sans")).toContain("--font-sans: var(--font-instrument-sans)");
    expect(get("martian-mono")).toContain(
      "--font-mono: var(--font-martian-mono), ui-monospace, monospace",
    );
    expect(get("figtree")).toContain("className={figtree.variable}");
  });

  it("never makes a variable refer to itself", () => {
    for (const f of fontsCatalog) {
      const css = applySnippet(f);
      const [name, value] = css.split("@theme inline {")[1]?.trim().split(":") ?? [];
      expect(value?.trim().startsWith(`var(${name?.trim()}`)).toBe(false);
    }
  });

  it("picks distinct sample weights inside each font's range", () => {
    for (const f of fontsCatalog) {
      const w = sampleWeights(f);
      expect(new Set(w).size).toBe(w.length);
      for (const x of w) {
        expect(x).toBeGreaterThanOrEqual(f.weights.min);
        expect(x).toBeLessThanOrEqual(f.weights.max);
      }
    }
    const instrument = findFont("instrument-sans");
    expect(instrument && sampleWeights(instrument)).toEqual([400, 700]);
  });
});

describe("type tester helpers", () => {
  it("falls back to the default text when nothing useful was typed", () => {
    expect(previewText("")).toBe(DEFAULT_PREVIEW);
    expect(previewText("   \n\t ")).toBe(DEFAULT_PREVIEW);
  });

  it("trims the text and caps its length", () => {
    expect(previewText("  Hello  ")).toBe("Hello");
    const long = "x".repeat(MAX_PREVIEW_LENGTH + 50);
    expect(previewText(long)).toHaveLength(MAX_PREVIEW_LENGTH);
  });

  it("keeps the typed text as typed, including accents and emoji", () => {
    expect(previewText("Café ☕ 2026")).toBe("Café ☕ 2026");
  });

  it("clamps a wanted weight into each font's real range", () => {
    const instrument = findFont("instrument-sans");
    const martian = findFont("martian-mono");
    if (!instrument || !martian) throw new Error("missing font");
    expect(clampWeight(instrument, 900)).toBe(700);
    expect(clampWeight(instrument, 100)).toBe(400);
    expect(clampWeight(instrument, 500)).toBe(500);
    expect(clampWeight(martian, 100)).toBe(100);
    expect(clampWeight(martian, 900)).toBe(800);
  });

  it("never returns a weight outside the font's range, for every font and every slider stop", () => {
    for (const f of fontsCatalog) {
      for (let w = WEIGHT_RANGE.min; w <= WEIGHT_RANGE.max; w += WEIGHT_RANGE.step) {
        const used = clampWeight(f, w);
        expect(used).toBeGreaterThanOrEqual(f.weights.min);
        expect(used).toBeLessThanOrEqual(f.weights.max);
      }
    }
  });

  it("starts the sliders inside their own ranges", () => {
    expect(SIZE_RANGE.initial).toBeGreaterThanOrEqual(SIZE_RANGE.min);
    expect(SIZE_RANGE.initial).toBeLessThanOrEqual(SIZE_RANGE.max);
    expect(WEIGHT_RANGE.initial).toBeGreaterThanOrEqual(WEIGHT_RANGE.min);
    expect(WEIGHT_RANGE.initial).toBeLessThanOrEqual(WEIGHT_RANGE.max);
    expect(glyphRows.join("")).toContain("0123456789");
  });

  it("uses English for every sample sentence", () => {
    expect(DEFAULT_PREVIEW).toMatch(/^[\x20-\x7E]+$/);
    expect(DEFAULT_PREVIEW.toLowerCase()).not.toMatch(/tuma|pesa|habari|karibu|urahisi/);
  });

  it("lists a font's real weights in steps of 100 for the ladder", () => {
    const get = (id: string) => {
      const f = findFont(id);
      if (!f) throw new Error(id);
      return weightSteps(f);
    };
    expect(get("instrument-sans")).toEqual([400, 500, 600, 700]);
    expect(get("bricolage-grotesque")).toEqual([200, 300, 400, 500, 600, 700, 800]);
    expect(get("martian-mono")).toEqual([100, 200, 300, 400, 500, 600, 700, 800]);
    for (const f of fontsCatalog) for (const w of weightSteps(f)) expect(clampWeight(f, w)).toBe(w);
  });

  it("names weights the usual way and falls back to the number", () => {
    expect(weightName(400)).toBe("Regular");
    expect(weightName(700)).toBe("Bold");
    expect(weightName(100)).toBe("Thin");
    expect(weightName(450)).toBe("450");
    for (const f of fontsCatalog)
      for (const w of weightSteps(f)) expect(weightName(w)).not.toMatch(/^\d+$/);
  });
});
