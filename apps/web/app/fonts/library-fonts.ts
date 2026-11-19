import {
  Familjen_Grotesk,
  Figtree,
  Fraunces,
  Source_Serif_4,
  Syne,
  Unbounded,
} from "next/font/google";

// Only the fonts library pages import this file, so these fonts are downloaded for visitors
// of /fonts and nobody else. (The other three are already loaded site-wide in app/fonts.ts.)
// next/font self-hosts them: no request goes to Google from a visitor's browser.

export const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  variable: "--font-figtree",
  display: "swap",
  // No preload hint: Next adds one for EVERY loader to EVERY page, so each library font would be
  // downloaded on every page of the site. Without it the file is fetched only when text set in
  // the font is on screen, which is only on the fonts pages.
  preload: false,
});

export const familjenGrotesk = Familjen_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-familjen-grotesk",
  display: "swap",
  // No preload hint: Next adds one for EVERY loader to EVERY page, so each library font would be
  // downloaded on every page of the site. Without it the file is fetched only when text set in
  // the font is on screen, which is only on the fonts pages.
  preload: false,
});

export const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
  // No preload hint: Next adds one for EVERY loader to EVERY page, so each library font would be
  // downloaded on every page of the site. Without it the file is fetched only when text set in
  // the font is on screen, which is only on the fonts pages.
  preload: false,
});

export const sourceSerif4 = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  variable: "--font-source-serif-4",
  display: "swap",
  // No preload hint: Next adds one for EVERY loader to EVERY page, so each library font would be
  // downloaded on every page of the site. Without it the file is fetched only when text set in
  // the font is on screen, which is only on the fonts pages.
  preload: false,
});

export const unbounded = Unbounded({
  subsets: ["latin", "latin-ext"],
  variable: "--font-unbounded",
  display: "swap",
  // No preload hint: Next adds one for EVERY loader to EVERY page, so each library font would be
  // downloaded on every page of the site. Without it the file is fetched only when text set in
  // the font is on screen, which is only on the fonts pages.
  preload: false,
});

export const syne = Syne({
  subsets: ["latin", "latin-ext"],
  variable: "--font-syne",
  display: "swap",
  // No preload hint: Next adds one for EVERY loader to EVERY page, so each library font would be
  // downloaded on every page of the site. Without it the file is fetched only when text set in
  // the font is on screen, which is only on the fonts pages.
  preload: false,
});
