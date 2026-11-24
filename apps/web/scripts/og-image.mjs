import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const logo = readFileSync("public/brand/zuri-logo.svg", "utf8").replace(
  /<title[^>]*>.*?<\/title>/,
  "",
);
// Renders the social preview card (app/opengraph-image.png) from the running dev server, so it
// uses the site's own fonts. Usage: pnpm dev, then `node scripts/og-image.mjs [out.png] [base-url]`.
// It captures at 2x; downscale to 1200x630 before saving it into app/.
const out = process.argv[2] ?? "og-2x.png";
const base = process.argv[3] ?? "http://localhost:3000";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
await p.goto(`${base}/`, { waitUntil: "networkidle" });
await p.evaluate((logo) => {
  document.documentElement.className =
    document.documentElement.className.replace(/\bdark\b/, "") + " light";
  document.documentElement.style.colorScheme = "light";
  document.body.innerHTML = `
  <style>
    body{margin:0;background:#fff}
    .og{position:relative;width:1200px;height:630px;overflow:hidden;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px}
    .g{position:absolute;border-radius:9999px;filter:blur(80px)}
    .logo svg{height:132px;width:auto;display:block}
    .url{position:relative;font-family:var(--font-mono);font-size:24px;color:#57534e;letter-spacing:.01em}
  </style>
  <div class="og">
    <div class="g" style="width:460px;height:460px;left:-170px;top:-210px;background:oklch(0.88 0.12 65);opacity:.85"></div>
    <div class="g" style="width:420px;height:420px;right:-150px;top:-190px;background:oklch(0.84 0.12 330);opacity:.7"></div>
    <div class="g" style="width:480px;height:480px;right:-180px;bottom:-250px;background:oklch(0.84 0.09 250);opacity:.8"></div>
    <div class="g" style="width:400px;height:400px;left:-150px;bottom:-230px;background:oklch(0.9 0.1 150);opacity:.7"></div>
    <div class="logo">${logo}</div>
    <div class="url">components.abdulqadirmsingi.com</div>
  </div>`;
}, logo);
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(500);
await p.locator(".og").screenshot({ path: out });
await b.close();
