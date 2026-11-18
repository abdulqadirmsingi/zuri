import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type Item = {
  name: string;
  cssVars?: {
    theme?: Record<string, string>;
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
  registryDependencies?: string[];
  meta?: { version?: string; tier?: string };
};
const { items } = JSON.parse(readFileSync("registry.json", "utf8")) as { items: Item[] };

describe("registry.json", () => {
  it("gives every item a version and tier", () => {
    for (const item of items) {
      expect(item.meta?.version, item.name).toBeTruthy();
      expect(["free", "pro"], item.name).toContain(item.meta?.tier);
    }
  });

  // Regression: the CLI mirrors cssVars.light keys into @theme inline, so non-colour
  // variables there became circular (--ease-out: var(--ease-out)). Declare them via `css`.
  it("keeps cssVars to colours and never self-referencing", () => {
    for (const item of items) {
      const { theme = {}, light = {}, dark = {} } = item.cssVars ?? {};
      for (const [key, value] of Object.entries(theme)) expect(value).not.toBe(`var(--${key})`);
      for (const key of [...Object.keys(light), ...Object.keys(dark)])
        expect(key, `${item.name}: ${key}`).not.toMatch(/^(glass|duration|ease|radius|shadow|z)-/);
    }
  });

  it("uses a templated URL for registry dependencies", () => {
    for (const item of items)
      for (const dep of item.registryDependencies ?? [])
        expect(dep).toMatch(/^__REGISTRY_URL__\/[a-z0-9-]+\.json$/);
  });

  // Regression guard: a component that animates with a zuri keyframe must ship it, or the
  // animation silently does nothing in a user's project.
  it("ships every zuri keyframe its component source uses", () => {
    for (const item of items as (Item & {
      files?: { path: string }[];
      css?: Record<string, unknown>;
    })[]) {
      for (const file of item.files ?? []) {
        const source = readFileSync(file.path, "utf8");
        for (const m of source.matchAll(/animate-\[(zuri-[a-z-]+)_/g)) {
          expect(Object.keys(item.css ?? {}), `${item.name} uses ${m[1]}`).toContain(
            `@keyframes ${m[1]}`,
          );
        }
      }
    }
  });
});
