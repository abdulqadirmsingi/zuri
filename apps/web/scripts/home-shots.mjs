// Regenerates the pictures on the home page from the real blocks.
// Usage: start the site, then `BASE_URL=http://localhost:3000 node scripts/home-shots.mjs`.
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const base = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const out = new URL("../public/home/", import.meta.url).pathname;
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await (
  await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: "light" })
).newPage();

await page.goto(`${base}/starter`);
await page.waitForLoadState("networkidle");
await page.screenshot({ path: `${out}starter.jpg`, type: "jpeg", quality: 86 });

await page.goto(`${base}/starter/heroes`);
await page.waitForLoadState("networkidle");
for (const id of ["split", "magazine", "fan"]) {
  await page
    .locator(`#shot-${id}`)
    .screenshot({ path: `${out}${id}.jpg`, type: "jpeg", quality: 86 });
}
await browser.close();
console.log("Wrote starter, split, magazine and fan to public/home/");
