import { display, mono, sans } from "@/app/fonts";
import { type FontEntry, fontsCatalog } from "@/lib/fonts-catalog";
import { familjenGrotesk, figtree, fraunces, sourceSerif4, syne, unbounded } from "./library-fonts";

/** A catalogue entry plus the CSS font-family string next/font generated for it. */
export type FontWithFace = FontEntry & { cssFamily: string };

const faces: Record<string, string> = {
  "bricolage-grotesque": display.style.fontFamily,
  "instrument-sans": sans.style.fontFamily,
  "martian-mono": mono.style.fontFamily,
  figtree: figtree.style.fontFamily,
  "familjen-grotesk": familjenGrotesk.style.fontFamily,
  fraunces: fraunces.style.fontFamily,
  "source-serif-4": sourceSerif4.style.fontFamily,
  unbounded: unbounded.style.fontFamily,
  syne: syne.style.fontFamily,
};

export function fontsWithFaces(): FontWithFace[] {
  return fontsCatalog.map((font) => ({ ...font, cssFamily: faces[font.id] ?? "inherit" }));
}
