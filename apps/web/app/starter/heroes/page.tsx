import type { Metadata } from "next";
import { HeroFan, HeroMagazine, HeroSplit } from "@/components/demos/hero-demos";

export const metadata: Metadata = {
  title: "Hero blocks",
  description: "The three hero blocks at full width.",
  robots: { index: false },
};

// Full-width previews of the hero blocks. The home page's pictures are screenshots of these
// (see scripts/home-shots.mjs), so the images always show real components.
export default function HeroesPage() {
  return (
    <main>
      <div id="shot-split">
        <HeroSplit />
      </div>
      <div id="shot-magazine">
        <HeroMagazine />
      </div>
      <div id="shot-fan">
        <HeroFan />
      </div>
    </main>
  );
}
