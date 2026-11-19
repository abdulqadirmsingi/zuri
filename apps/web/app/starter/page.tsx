import { LandingStarter } from "@registry/blocks/landing-starter/landing-starter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Landing page starter",
  description: "A complete landing page built from Zuri blocks. Copy it and change the words.",
};

// A full-page preview of the starter, outside the docs layout so it looks like a real site.
export default function StarterPage() {
  return <LandingStarter />;
}
