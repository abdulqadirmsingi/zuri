import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { registryStats } from "./registry-stats";

describe("registryStats", () => {
  it("counts the real registry items", () => {
    const s = registryStats();
    expect(s.count).toBeGreaterThan(30);
    expect(s.blocks).toBeGreaterThan(5);
    expect(s.names).toHaveLength(s.count);
  });
  it("lists readable titles, not slugs", () => {
    const { names } = registryStats();
    expect(names).toContain("Button");
    expect(names.every((n) => !n.includes("-"))).toBe(true);
  });
  it("shelves hold every item once, and each links to a docs page that exists", () => {
    const { shelves, count, blocks } = registryStats();
    const all = shelves.flatMap((x) => x.items);
    expect(all).toHaveLength(count + blocks);
    for (const { href } of all) {
      const slug = href.replace("/docs/", "");
      expect(existsSync(`content/docs/${slug}.mdx`), href).toBe(true);
    }
  });
});
