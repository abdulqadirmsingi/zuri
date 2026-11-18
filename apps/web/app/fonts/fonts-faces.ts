import { display, mono, sans } from "@/app/fonts";
import { type FontEntry, fontsCatalog } from "@/lib/fonts-catalog";
import { familjenGrotesk, figtree } from "./library-fonts";

/** A catalogue entry plus the CSS font-family string next/font generated for it. */
export type FontWithFace = FontEntry & { cssFamily: string };

const faces: Record<string, string> = {
  "bricolage-grotesque": display.style.fontFamily,
  "instrument-sans": sans.style.fontFamily,
  "martian-mono": mono.style.fontFamily,
  figtree: figtree.style.fontFamily,
  "familjen-grotesk": familjenGrotesk.style.fontFamily,
};

export function fontsWithFaces(): FontWithFace[] {
  return fontsCatalog.map((font) => ({ ...font, cssFamily: faces[font.id] ?? "inherit" }));
}
