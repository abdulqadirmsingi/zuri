// Audits the docs pages with axe (WCAG 2.2 AA) in light and dark mode, in a real browser.
// Usage: start the site (pnpm dev or pnpm --filter web start), then `pnpm --filter web a11y`.
// BASE_URL defaults to http://localhost:3000; CHROME_PATH points at a Chromium binary if
// Playwright's own download is not installed.
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const base = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const pages = [
  "/",
  "/docs",
  "/docs/installation",
  "/docs/theming",
  "/docs/components",
  "/docs/components/button",
  "/docs/components/copy-button",
  "/docs/components/bottom-nav",
  "/docs/components/dialog",
  "/docs/components/popover",
  "/docs/components/tooltip",
  "/docs/components/label",
  "/docs/components/input",
  "/docs/components/textarea",
  "/docs/components/field",
  "/docs/components/checkbox",
  "/docs/components/switch",
  "/docs/components/radio-group",
  "/docs/components/select",
  "/docs/components/badge",
  "/docs/components/separator",
  "/docs/components/spinner",
  "/docs/components/skeleton",
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

for (const scheme of ["light", "dark"]) {
  const context = await browser.newContext({ colorScheme: scheme });
  const page = await context.newPage();
  for (const path of pages) {
    await page.goto(base + path);
    await page.waitForLoadState("networkidle");
    const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
    console.log(`${violations.length ? "FAIL" : "ok  "} ${scheme.padEnd(5)} ${path}`);
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
