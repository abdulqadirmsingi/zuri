import { describe, expect, it } from "vitest";
import { findFont, fontsCatalog } from "./fonts-catalog";
import {
  curatedPairings,
  DEFAULT_PAIRING,
  pairingHref,
  pairingSnippet,
  pairingsFor,
  parsePairing,
} from "./fonts-pairing";
import { toIdentifier } from "./fonts-snippets";

const font = (id: string) => {
  const f = findFont(id);
  if (!f) throw new Error(`missing font ${id}`);
  return f;
};
const params = (q: Record<string, string>) => ({ get: (name: string) => q[name] ?? null });

describe("curatedPairings", () => {
  it("only pairs a heading font with a body font, and never a font with itself", () => {
    const pairs = curatedPairings();
    expect(pairs.length).toBeGreaterThan(5);
    for (const { heading, body } of pairs) {
      expect(heading.id).not.toBe(body.id);
      expect(heading.uses[0], heading.id).toBe("headings");
      expect(["body", "ui"], body.id).toContain(body.uses[0]);
    }
  });

  it("lists each pairing once, in a stable order", () => {
    const keys = curatedPairings().map((p) => `${p.heading.id}|${p.body.id}`);
    expect(new Set(keys).size).toBe(keys.length);
    expect(curatedPairings().map((p) => `${p.heading.id}|${p.body.id}`)).toEqual(keys);
  });

  it("finds a pair whichever font lists the other, and does not leave code fonts in", () => {
    const keys = curatedPairings().map((p) => `${p.heading.id}|${p.body.id}`);
    expect(keys).toContain("bricolage-grotesque|instrument-sans"); // listed on both sides
    expect(keys).toContain("fraunces|figtree"); // listed only on the heading font's side
    expect(keys.some((k) => k.includes("martian-mono"))).toBe(false);
  });

  it("gives every heading font at least one partner", () => {
    for (const f of fontsCatalog.filter((x) => x.uses[0] === "headings")) {
      expect(
        curatedPairings().some((p) => p.heading.id === f.id),
        f.id,
      ).toBe(true);
    }
  });

  it("ignores ids that are not in the list it is given", () => {
    const only = [font("fraunces"), font("figtree")];
    expect(curatedPairings(only).map((p) => `${p.heading.id}|${p.body.id}`)).toEqual([
      "fraunces|figtree",
    ]);
    expect(curatedPairings([font("fraunces")])).toEqual([]);
  });
});

describe("pairingsFor", () => {
  it("returns the pairings a font is in, in either role", () => {
    const sans = pairingsFor(font("instrument-sans"));
    expect(sans.length).toBeGreaterThan(2);
    expect(sans.every((p) => p.body.id === "instrument-sans")).toBe(true);
    const fraunces = pairingsFor(font("fraunces"));
    expect(fraunces.every((p) => p.heading.id === "fraunces")).toBe(true);
  });
  it("returns nothing for a font with no suggested partner", () => {
    expect(pairingsFor(font("martian-mono"))).toEqual([]);
  });
});

describe("parsePairing", () => {
  it("reads valid ids", () => {
    expect(parsePairing(params({ heading: "fraunces", body: "figtree" }))).toEqual({
      heading: "fraunces",
      body: "figtree",
    });
  });

  it("falls back to the default for missing, unknown or hostile values", () => {
    expect(parsePairing(params({}))).toEqual(DEFAULT_PAIRING);
    expect(parsePairing(params({ heading: "nope", body: "also-nope" }))).toEqual(DEFAULT_PAIRING);
    expect(
      parsePairing(params({ heading: "<script>alert(1)</script>", body: "../../etc/passwd" })),
    ).toEqual(DEFAULT_PAIRING);
    expect(parsePairing(params({ heading: "__proto__", body: "constructor" }))).toEqual(
      DEFAULT_PAIRING,
    );
  });

  it("falls back one side at a time", () => {
    expect(parsePairing(params({ heading: "syne", body: "nope" }))).toEqual({
      heading: "syne",
      body: DEFAULT_PAIRING.body,
    });
  });

  it("allows the same font on both sides", () => {
    expect(parsePairing(params({ heading: "figtree", body: "figtree" }))).toEqual({
      heading: "figtree",
      body: "figtree",
    });
  });

  it("builds links that parse back to the same pairing", () => {
    for (const { heading, body } of curatedPairings()) {
      const url = new URL(pairingHref(heading.id, body.id), "http://x");
      expect(parsePairing(url.searchParams)).toEqual({ heading: heading.id, body: body.id });
    }
  });
});

describe("pairingSnippet", () => {
  it("loads both fonts and gives each its role", () => {
    const code = pairingSnippet(font("fraunces"), font("instrument-sans"));
    expect(code).toContain('import { Fraunces, Instrument_Sans } from "next/font/google";');
    expect(code).toContain("export const fraunces = Fraunces({");
    expect(code).toContain("export const instrumentSans = Instrument_Sans({");
    // biome-ignore lint/suspicious/noTemplateCurlyInString: the generated code really contains a template literal.
    expect(code).toContain("className={`${fraunces.variable} ${instrumentSans.variable}`}");
    expect(code).toContain("--font-display: var(--font-fraunces)");
    expect(code).toContain("--font-sans: var(--font-instrument-sans)");
  });

  it("uses the serif role for a serif body font", () => {
    const code = pairingSnippet(font("unbounded"), font("source-serif-4"));
    expect(code).toContain("--font-serif: var(--font-source-serif-4), ui-serif, Georgia, serif");
    expect(code).toContain('import { Unbounded, Source_Serif_4 } from "next/font/google";');
  });

  it("loads a font once when it is on both sides", () => {
    const code = pairingSnippet(font("figtree"), font("figtree"));
    expect(code.match(/export const figtree = /g)).toHaveLength(1);
    expect(code).toContain('import { Figtree } from "next/font/google";');
    // biome-ignore lint/suspicious/noTemplateCurlyInString: the generated code really contains a template literal.
    expect(code).toContain("className={`${figtree.variable}`}");
  });

  it("is valid-looking for every pair in the catalogue, and never refers to itself", () => {
    for (const { heading, body } of curatedPairings()) {
      const code = pairingSnippet(heading, body);
      expect(code).toContain(`export const ${toIdentifier(heading.id)} = `);
      expect(code).toContain(`export const ${toIdentifier(body.id)} = `);
      expect(code).not.toMatch(/--font-(\w+): var\(--font-\1\)/);
    }
  });
});
