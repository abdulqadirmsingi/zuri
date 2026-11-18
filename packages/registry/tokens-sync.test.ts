import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const COLOURS = [
  "background",
  "foreground",
  "muted",
  "muted-foreground",
  "primary",
  "primary-foreground",
  "accent",
  "accent-foreground",
  "accent-ink",
  "border",
  "ring",
  "success",
  "warning",
  "danger",
  "control-border",
];
const RAW_LIGHT = [
  "glass-blur",
  "glass-bg",
  "glass-border",
  "glass-solid",
  "duration-fast",
  "duration-base",
  "duration-slow",
  "ease-out",
  "ease-in-out",
  "z-dropdown",
  "z-sticky",
  "z-overlay",
  "z-modal",
  "z-toast",
  "z-tooltip",
];
const RAW_DARK = ["glass-bg", "glass-border", "glass-solid"];

const css = readFileSync("../tokens/src/tokens.css", "utf8");
const registry = JSON.parse(readFileSync("registry.json", "utf8")) as {
  items: {
    name: string;
    cssVars?: Record<string, Record<string, string>>;
    css?: Record<string, Record<string, string>>;
  }[];
};
const item = registry.items.find((i) => i.name === "zuri-tokens");

/** Variables declared in the first block whose selector starts with `selector`. */
function vars(selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  const body = css.slice(css.indexOf("{", start) + 1, css.indexOf("\n}", start));
  return Object.fromEntries(
    [...body.matchAll(/--([a-z-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2]?.trim()]),
  );
}
const pick = (src: Record<string, string>, keys: string[]) =>
  Object.fromEntries(keys.map((k) => [k, src[k]]));

// Why: the registry item is what users install, tokens.css is what the site uses.
// They must never disagree, or the docs site would not look like installed components.
describe("zuri-tokens registry item matches packages/tokens", () => {
  const light = vars(".light {");
  // Motion, z-index and blur live in a :root-only block (see the comment in tokens.css).
  const rootOnly = vars(":root {");
  const dark = vars(':root[data-theme="dark"]');

  it("light colours", () => expect(item?.cssVars?.light).toEqual(pick(light, COLOURS)));
  it("dark colours", () => expect(item?.cssVars?.dark).toEqual(pick(dark, COLOURS)));
  it("raw light variables", () =>
    expect(item?.css?.[":root"]).toEqual(
      Object.fromEntries(RAW_LIGHT.map((k) => [`--${k}`, light[k] ?? rootOnly[k]])),
    ));
  it("raw dark variables", () =>
    expect(item?.css?.[".dark"]).toEqual(
      Object.fromEntries(RAW_DARK.map((k) => [`--${k}`, dark[k]])),
    ));
  it("maps every colour into the Tailwind theme", () =>
    expect(Object.keys(item?.cssVars?.theme ?? {}).sort()).toEqual(
      COLOURS.map((k) => `color-${k}`).sort(),
    ));

  // Regression: these lived in `:root, .light`, so a `.light`/`.dark` scope (as in the docs
  // preview frame) re-declared them and the reduced-motion override never applied inside it.
  it("keeps motion, z-index and blur out of the theme-scoped block", () => {
    for (const k of ["duration-base", "duration-slow", "ease-out", "z-sticky", "glass-blur"])
      expect(light[k], k).toBeUndefined();
    expect(rootOnly["duration-slow"]).toBe("300ms");
  });

  it("shortens motion for prefers-reduced-motion in both tokens.css and the item", () => {
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)\s*\{\s*:root\s*\{[^}]*--duration-slow:\s*0\.01ms/,
    );
    expect(item?.css?.["@media (prefers-reduced-motion: reduce)"]).toEqual({
      ":root": {
        "--duration-fast": "0.01ms",
        "--duration-base": "0.01ms",
        "--duration-slow": "0.01ms",
      },
    });
  });

  // Regression: bottom-nav used --duration-slow and --z-sticky, which the installable item
  // did not declare, so they would have been undefined in a user's project.
  it("declares every CSS variable that component source uses", () => {
    const declared = new Set<string>([
      ...Object.keys(item?.cssVars?.light ?? {}).map((k) => `--${k}`),
      ...Object.keys(item?.cssVars?.theme ?? {}).map((k) => `--${k}`),
      ...Object.keys(item?.css?.[":root"] ?? {}),
    ]);
    // Set inline by the component itself, not a token.
    const own = new Set(["--zuri-progress"]);
    const used = new Map<string, string>();
    for (const file of listSources("src"))
      for (const m of readFileSync(file, "utf8").matchAll(/var\((--[a-z0-9-]+)/g))
        used.set(m[1] as string, file);
    for (const [name, file] of used) {
      if (name.startsWith("--tw-") || own.has(name)) continue;
      expect(declared.has(name), `${name} (used in ${file})`).toBe(true);
    }
  });
});

function listSources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = `${dir}/${e.name}`;
    if (e.isDirectory()) return listSources(full);
    return /\.tsx?$/.test(e.name) && !/\.test\./.test(e.name) ? [full] : [];
  });
}
