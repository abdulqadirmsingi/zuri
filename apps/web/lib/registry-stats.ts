import { readFileSync } from "node:fs";
import path from "node:path";

interface Item {
  name: string;
  type: string;
  title: string;
  description?: string;
  categories?: string[];
  dependencies?: string[];
}

/**
 * Reads the real registry, so the numbers and names on the home page can never drift from what
 * can actually be installed. Runs at build time (the home page is static).
 */
export function registryStats() {
  const file = path.join(process.cwd(), "../../packages/registry/registry.json");
  const { items } = JSON.parse(readFileSync(file, "utf8")) as { items: Item[] };
  const components = items.filter((i) => i.type === "registry:ui");
  const blocks = items.filter((i) => i.type === "registry:block");
  return {
    count: components.length,
    blocks: blocks.length,
    names: components.map((c) => c.title),
    items: components,
  };
}
