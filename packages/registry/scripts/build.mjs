// Renders registry.json (with __REGISTRY_URL__ placeholders) and runs `shadcn build`.
// Why: registryDependencies must be absolute URLs, and the site domain is still a placeholder.
import { spawnSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";

const base = (process.env.ZURI_REGISTRY_URL ?? "http://localhost:3000").replace(/\/$/, "");
const out = process.env.ZURI_REGISTRY_OUT ?? "../../apps/web/public/r";
const rendered = "registry.generated.json";

writeFileSync(
  rendered,
  readFileSync("registry.json", "utf8").replaceAll("__REGISTRY_URL__", `${base}/r`),
);
const res = spawnSync("pnpm", ["exec", "shadcn", "build", rendered, "-o", out], {
  stdio: "inherit",
});
rmSync(rendered, { force: true });
process.exit(res.status ?? 1);
