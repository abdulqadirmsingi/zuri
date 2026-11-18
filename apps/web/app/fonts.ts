import { Bricolage_Grotesque, Instrument_Sans, Martian_Mono } from "next/font/google";

// next/font downloads these at build time and serves them from our own origin:
// no request to Google from visitors' browsers, and it works on a self-hosted VPS.

/** Headlines: a characterful variable grotesque with optical size and width axes. */
export const display = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display-loaded",
  display: "swap",
});

/** Body and UI text: clean, slightly warm, very legible at small sizes. */
export const sans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans-loaded",
  display: "swap",
});

/** Code and numbers: wide, distinctive monospace. */
export const mono = Martian_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono-loaded",
  display: "swap",
});
