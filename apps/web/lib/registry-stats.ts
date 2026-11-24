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

export interface Shelf {
  id: string;
  items: { name: string; title: string; href: string }[];
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

  // Shelves: every installable item with a docs page, grouped by its first category, in the
  // order the registry lists them. "motion" blocks sit with the other blocks' docs section.
  const shelves: Shelf[] = [];
  for (const item of [...components, ...blocks]) {
    const id = item.categories?.[0] ?? "other";
    let shelf = shelves.find((x) => x.id === id);
    if (!shelf) {
      shelf = { id, items: [] };
      shelves.push(shelf);
    }
    shelf.items.push({
      name: item.name,
      title: item.title,
      href: `/docs/${item.type === "registry:block" ? "blocks" : "components"}/${item.name}`,
    });
  }
  return {
    shelves,
    count: components.length,
    blocks: blocks.length,
    names: components.map((c) => c.title),
    items: components,
  };
}
