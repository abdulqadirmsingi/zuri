/**
 * The fonts library's data. Every entry is an open font under the SIL Open Font Licence 1.1,
 * verified against the Google Fonts repository (each sits under its `ofl/` directory), with the
 * designer, copyright line and axes taken from that repository's metadata. Only fonts whose
 * licence allows free use and redistribution may be added here.
 */
export type FontCategory = "sans" | "serif" | "mono" | "display";
export type FontUse = "headings" | "body" | "ui" | "numbers" | "code";

export const fontUses: { value: FontUse; label: string }[] = [
  { value: "headings", label: "Headings" },
  { value: "body", label: "Body text" },
  { value: "ui", label: "Interfaces" },
  { value: "numbers", label: "Numbers" },
  { value: "code", label: "Code" },
];

export const fontCategories: { value: FontCategory; label: string }[] = [
  { value: "sans", label: "Sans" },
  { value: "serif", label: "Serif" },
  { value: "mono", label: "Mono" },
  { value: "display", label: "Display" },
];

export interface FontEntry {
  /** Stable kebab-case id, also used for the CSS variable name. */
  id: string;
  /** The family name exactly as Google Fonts spells it. */
  family: string;
  category: FontCategory;
  designer: string;
  /** The copyright line from the font's OFL.txt. Keep it with any redistribution. */
  copyright: string;
  /** Upstream source repository. */
  sourceUrl: string;
  weights: { min: number; max: number };
  /** Variable axes beyond the weight axis are listed too; "wght" is always first. */
  axes: string[];
  subsets: string[];
  uses: FontUse[];
  /** One sentence on what the font is like. */
  summary: string;
  /** Our opinion on where it works best. */
  bestFor: string;
  /** Ids of fonts that pair well with this one. */
  pairsWith: string[];
  /** Where Zuri itself uses it, if it does. */
  inZuri?: string;
}

export const LICENCE_NAME = "SIL Open Font Licence 1.1";
export const LICENCE_URL = "https://openfontlicense.org";

export const fontsCatalog: FontEntry[] = [
  {
    id: "bricolage-grotesque",
    family: "Bricolage Grotesque",
    category: "sans",
    designer: "Mathieu Triay",
    copyright:
      "Copyright 2022 The Bricolage Grotesque Project Authors (https://github.com/ateliertriay/bricolage)",
    sourceUrl: "https://github.com/ateliertriay/bricolage",
    weights: { min: 200, max: 800 },
    axes: ["wght", "opsz", "wdth"],
    subsets: ["latin", "latin-ext", "vietnamese"],
    uses: ["headings"],
    summary: "A characterful grotesque with optical size, width and weight axes.",
    bestFor:
      "Headlines and hero text. The optical-size axis keeps small sizes sturdy and large sizes expressive.",
    pairsWith: ["instrument-sans", "martian-mono", "source-serif-4"],
    inZuri: "Headlines on this site",
  },
  {
    id: "instrument-sans",
    family: "Instrument Sans",
    category: "sans",
    designer: "Rodrigo Fuenzalida, Jordan Egstad",
    copyright:
      "Copyright 2022 The Instrument Sans Project Authors (https://github.com/Instrument/instrument-sans)",
    sourceUrl: "https://github.com/Instrument/instrument-sans",
    weights: { min: 400, max: 700 },
    axes: ["wght", "wdth"],
    subsets: ["latin", "latin-ext"],
    uses: ["body", "ui"],
    summary: "A clean, slightly warm sans that stays legible at small sizes.",
    bestFor: "Body text and interface labels, where long reading and small type both matter.",
    pairsWith: ["bricolage-grotesque", "martian-mono"],
    inZuri: "Body and interface text on this site",
  },
  {
    id: "martian-mono",
    family: "Martian Mono",
    category: "mono",
    designer: "Roman Shamin, Evil Martians",
    copyright:
      "Copyright 2021 The Martian Mono Project Authors (https://github.com/evilmartians/mono)",
    sourceUrl: "https://github.com/evilmartians/mono",
    weights: { min: 100, max: 800 },
    axes: ["wght", "wdth"],
    subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"],
    uses: ["code", "numbers"],
    summary: "A wide, distinctive monospace with weight and width axes.",
    bestFor: "Code, and columns of figures where every digit must line up, such as amounts.",
    pairsWith: ["instrument-sans", "figtree"],
    inZuri: "Code and figures on this site",
  },
  {
    id: "figtree",
    family: "Figtree",
    category: "sans",
    designer: "Erik Kennedy",
    copyright:
      "Copyright 2022 The Figtree Project Authors (https://github.com/erikdkennedy/figtree)",
    sourceUrl: "https://github.com/erikdkennedy/figtree",
    weights: { min: 300, max: 900 },
    axes: ["wght"],
    subsets: ["latin", "latin-ext"],
    uses: ["ui", "body", "headings"],
    summary: "A friendly, geometric sans with a wide range of weights.",
    bestFor:
      "Dashboards and product interfaces. It stays clear in dense screens and works for headings too.",
    pairsWith: ["martian-mono"],
  },
  {
    id: "familjen-grotesk",
    family: "Familjen Grotesk",
    category: "sans",
    designer: "Familjen STHLM AB",
    copyright:
      "Copyright 2021 The Familjen Grotesk Project Authors (https://github.com/Familjen-Sthlm/Familjen-Grotesk)",
    sourceUrl: "https://github.com/Familjen-Sthlm/Familjen-Grotesk",
    weights: { min: 400, max: 700 },
    axes: ["wght"],
    subsets: ["latin", "latin-ext", "vietnamese"],
    uses: ["headings", "body"],
    summary: "A grotesque with quirky details that give pages a human, editorial voice.",
    bestFor: "Marketing and editorial pages: headings with personality, and readable body copy.",
    pairsWith: ["martian-mono", "instrument-sans"],
  },
  {
    id: "fraunces",
    family: "Fraunces",
    category: "serif",
    designer: "Undercase Type, Phaedra Charles, Flavia Zimbardi",
    copyright:
      "Copyright 2018 The Fraunces Project Authors (https://github.com/undercasetype/Fraunces)",
    sourceUrl: "https://github.com/undercasetype/Fraunces",
    weights: { min: 100, max: 900 },
    axes: ["wght", "opsz", "SOFT", "WONK"],
    subsets: ["latin", "latin-ext", "vietnamese"],
    uses: ["headings", "body"],
    summary: 'A soft, old-style serif with optical size, softness and a quirky "wonk" axis.',
    bestFor:
      "Editorial headings and warm, characterful body text. Large sizes show off its soft curves.",
    pairsWith: ["instrument-sans", "figtree"],
  },
  {
    id: "source-serif-4",
    family: "Source Serif 4",
    category: "serif",
    designer: "Frank Grießhammer",
    copyright:
      "Copyright 2014 The Source Serif 4 Project Authors (https://github.com/adobe-fonts/source-serif)",
    sourceUrl: "https://github.com/adobe-fonts/source-serif",
    weights: { min: 200, max: 900 },
    axes: ["wght", "opsz"],
    subsets: ["cyrillic", "cyrillic-ext", "greek", "latin", "latin-ext", "vietnamese"],
    uses: ["body", "headings"],
    summary: "A clear, workmanlike serif with an optical size axis, made for long reading.",
    bestFor:
      "Articles, documentation and anything read at length, with headings in the same family.",
    pairsWith: ["instrument-sans", "martian-mono"],
  },
  {
    id: "unbounded",
    family: "Unbounded",
    category: "display",
    designer: "NaN",
    copyright:
      "Copyright 2022 The Unbounded Project Authors (https://github.com/googlefonts/unbounded)",
    sourceUrl: "https://github.com/googlefonts/unbounded",
    weights: { min: 200, max: 900 },
    axes: ["wght"],
    subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"],
    uses: ["headings"],
    summary: "A wide, rounded display face with a bold, modern, slightly futuristic feel.",
    bestFor: "Hero headlines, logos and short bold statements. It is too wide for long text.",
    pairsWith: ["instrument-sans", "figtree", "source-serif-4"],
  },
  {
    id: "syne",
    family: "Syne",
    category: "display",
    designer: "Bonjour Monde, Lucas Descroix, George Triantafyllakos",
    copyright:
      "Copyright 2017 The Syne Project Authors (https://gitlab.com/bonjour-monde/fonderie/syne-typeface)",
    sourceUrl: "https://gitlab.com/bonjour-monde/fonderie/syne-typeface",
    weights: { min: 400, max: 800 },
    axes: ["wght"],
    subsets: ["greek", "latin", "latin-ext"],
    uses: ["headings"],
    summary: "An expressive display family whose heaviest weights become extra wide and dramatic.",
    bestFor: "Posters, event pages and bold headings where the type itself is the design.",
    pairsWith: ["instrument-sans", "martian-mono"],
  },
];

export function findFont(id: string): FontEntry | undefined {
  return fontsCatalog.find((font) => font.id === id);
}

/** Google Fonts' page for a family, for people who want to download the files. */
export function googleFontsUrl(font: FontEntry): string {
  return `https://fonts.google.com/specimen/${font.family.replaceAll(" ", "+")}`;
}

/** The name `next/font/google` exports the family under, e.g. "Familjen_Grotesk". */
export function nextFontName(font: FontEntry): string {
  return font.family.replaceAll(" ", "_");
}
