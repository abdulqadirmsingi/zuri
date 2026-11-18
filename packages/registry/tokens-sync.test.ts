import { readFileSync } from "node:fs";
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
];
const RAW_LIGHT = [
  "glass-blur",
  "glass-bg",
  "glass-border",
  "glass-solid",
  "duration-base",
  "ease-out",
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
  const dark = vars(':root[data-theme="dark"]');

  it("light colours", () => expect(item?.cssVars?.light).toEqual(pick(light, COLOURS)));
  it("dark colours", () => expect(item?.cssVars?.dark).toEqual(pick(dark, COLOURS)));
  it("raw light variables", () =>
    expect(item?.css?.[":root"]).toEqual(
      Object.fromEntries(RAW_LIGHT.map((k) => [`--${k}`, light[k]])),
    ));
  it("raw dark variables", () =>
    expect(item?.css?.[".dark"]).toEqual(
      Object.fromEntries(RAW_DARK.map((k) => [`--${k}`, dark[k]])),
    ));
  it("maps every colour into the Tailwind theme", () =>
    expect(Object.keys(item?.cssVars?.theme ?? {}).sort()).toEqual(
      COLOURS.map((k) => `color-${k}`).sort(),
    ));
});
