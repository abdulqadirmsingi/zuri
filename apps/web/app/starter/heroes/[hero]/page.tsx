import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroFan, HeroMagazine, HeroSplit } from "@/components/demos/hero-demos";

const heroes = { split: HeroSplit, magazine: HeroMagazine, fan: HeroFan } as const;

export const metadata: Metadata = { title: "Hero block", robots: { index: false } };

export function generateStaticParams() {
  return Object.keys(heroes).map((hero) => ({ hero }));
}

// One hero on its own page, so the home page can show it live in a frame at desktop width.
export default async function HeroPage({ params }: { params: Promise<{ hero: string }> }) {
  const { hero } = await params;
  const Hero = Object.hasOwn(heroes, hero) ? heroes[hero as keyof typeof heroes] : undefined;
  if (!Hero) notFound();
  return (
    <main>
      <Hero />
    </main>
  );
}
