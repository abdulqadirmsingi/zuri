import { Familjen_Grotesk, Figtree } from "next/font/google";

// Only the fonts library page imports this file, so these two fonts are downloaded for visitors
// of /fonts and nobody else. (The other three are already loaded site-wide in app/fonts.ts.)
// next/font self-hosts them: no request goes to Google from a visitor's browser.

export const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  variable: "--font-figtree",
  display: "swap",
});

export const familjenGrotesk = Familjen_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-familjen-grotesk",
  display: "swap",
});
