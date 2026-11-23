import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const base = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const pages = [
  "/",
  "/fonts",
  "/fonts/figtree",
  "/fonts/martian-mono",
  "/fonts/fraunces",
  "/fonts/pairings",
  "/fonts/unbounded",
  "/docs",
  "/docs/installation",
  "/docs/theming",
  "/docs/faq",
  "/docs/components",
  "/docs/blocks",
  "/docs/components/button",
  "/docs/components/copy-button",
  "/docs/components/theme-switch",
  "/docs/components/expanding-button-group",
  "/docs/components/bottom-nav",
  "/docs/components/swell-nav",
  "/docs/components/dialog",
  "/docs/components/popover",
  "/docs/components/tooltip",
  "/docs/components/alert-dialog",
  "/docs/components/dropdown-menu",
  "/docs/components/tabs",
  "/docs/components/accordion",
  "/docs/components/breadcrumbs",
  "/docs/components/user-menu",
  "/docs/components/label",
  "/docs/components/input",
  "/docs/components/input-group",
  "/docs/components/textarea",
  "/docs/components/field",
  "/docs/components/password-strength",
  "/docs/components/checkbox",
  "/docs/components/switch",
  "/docs/components/radio-group",
  "/docs/components/select",
  "/docs/components/picker",
  "/docs/components/badge",
  "/docs/components/separator",
  "/docs/components/spinner",
  "/docs/components/skeleton",
  "/docs/components/progressive-blur",
  "/docs/blocks/landing-starter",
  "/starter",
  "/docs/blocks/split-hero",
  "/docs/blocks/magazine-hero",
  "/docs/blocks/card-fan-hero",
  "/docs/blocks/site-header",
  "/docs/blocks/site-footer",
  "/docs/blocks/section-heading",
  "/docs/blocks/closing-cta",
  "/docs/blocks/pricing",
  "/docs/blocks/testimonials",
  "/docs/blocks/marquee",
  "/docs/blocks/reveal",
  "/docs/components/kbd",
  "/docs/components/progress",
  "/docs/components/card",
  "/docs/components/avatar",
  "/docs/components/empty-state",
  "/docs/components/stat",
];
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
let failures = 0;

// Narrow screens expose problems desktop hides, such as sideways-scrolling regions that
// keyboard users cannot reach, so audit both.
const viewports = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "320px", width: 320, height: 700 },
];
for (const viewport of viewports)
  for (const scheme of ["light", "dark"]) {
    const context = await browser.newContext({ colorScheme: scheme, viewport });
    const page = await context.newPage();
    for (const path of pages) {
      await page.goto(base + path);
      await page.waitForLoadState("networkidle");
      const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
      console.log(
        `${violations.length ? "FAIL" : "ok  "} ${viewport.name.padEnd(7)} ${scheme.padEnd(5)} ${path}`,
      );
      for (const v of violations) {
        failures += v.nodes.length;
        console.log(`   - ${v.id} (${v.impact}): ${v.help}`);
        for (const n of v.nodes.slice(0, 3))
          console.log(
            `       ${n.target.join(" ")}  ${(n.failureSummary ?? "").split("\n")[1] ?? ""}`,
          );
      }
    }
    await context.close();
  }

await browser.close();
if (failures) {
  console.error(`\n${failures} accessibility violation(s).`);
  process.exit(1);
}
console.log("\nNo accessibility violations.");
