import { readdirSync, readFileSync } from "node:fs";
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

// Regression: a fresh `shadcn init` picks a Base UI style, and the CLI then rewrites `asChild` on
// triggers into Base UI's `render` prop. Zuri ships Radix primitives, so Picker and SiteHeader
// stopped compiling in those projects. The triggers are the button themselves, with no asChild.
describe("sources that the shadcn CLI rewrites", () => {
  const files = [
    "src/inputs/picker/picker.tsx",
    "src/blocks/site-header/site-header.tsx",
    "src/overlays/popover/popover.tsx",
    "src/overlays/dialog/dialog.tsx",
    "src/navigation/user-menu/user-menu.tsx",
  ];
  for (const file of files) {
    it(`${file} has no literal asChild on a Dialog or Popover trigger or a DropdownMenu item`, () => {
      expect(readFileSync(file, "utf8")).not.toMatch(
        /<(?:(?:Dialog|Popover)Trigger|DropdownMenuItem)\b[^>]*\sasChild\b/,
      );
    });
  }
});

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

  // Regression guard: Tailwind v4's translate-*, scale-* and rotate-* utilities set the standalone
  // `translate`, `scale` and `rotate` CSS properties, not `transform`. A `transition-[transform,...]`
  // list therefore does NOT animate them, and the motion silently does nothing (it happened to the
  // button press, the switch thumb, the strength meter and every overlay's entrance). jsdom cannot
  // see it, so the source is checked instead.
  it("lists translate, scale and rotate wherever a transition lists transform", () => {
    const sources = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const full = `${dir}/${e.name}`;
        if (e.isDirectory()) return sources(full);
        return /\.tsx$/.test(e.name) && !/\.test\./.test(e.name) ? [full] : [];
      });
    for (const file of sources("src")) {
      for (const m of readFileSync(file, "utf8").matchAll(/transition-\[([^\]]*)\]/g)) {
        const props = (m[1] ?? "").split(",");
        if (!props.includes("transform")) continue;
        for (const needed of ["translate", "scale", "rotate"])
          expect(props, `${file}: ${m[0]} is missing ${needed}`).toContain(needed);
      }
    }
  });

  // Regression guard: a component that relies on a zuri-* class for a fallback (such as
  // .zuri-pblur hiding its blur layers) must ship that class's CSS, or the fallback silently
  // does nothing in a user's project.
  it("ships the CSS for every zuri-* class its component source relies on", () => {
    const tokens = items.find((i) => i.name === "zuri-tokens") as
      | { css?: Record<string, unknown> }
      | undefined;
    const defined = (css: Record<string, unknown> | undefined) => JSON.stringify(css ?? {});
    for (const item of items as (Item & {
      files?: { path: string }[];
      css?: Record<string, unknown>;
    })[]) {
      for (const file of item.files ?? []) {
        const source = readFileSync(file.path, "utf8");
        for (const m of source.matchAll(/["' ](zuri-[a-z-]+)["' ]/g)) {
          const cls = `.${m[1]}`;
          if (/^zuri-(rise|shake|accordion-up|accordion-down)$/.test(m[1] ?? "")) continue; // keyframe names
          const found = defined(item.css).includes(cls) || defined(tokens?.css).includes(cls);
          expect(found, `${item.name} uses ${cls} but no CSS defines it`).toBe(true);
        }
      }
    }
  });
});
