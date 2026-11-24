#!/usr/bin/env node
import { spawn } from "node:child_process";
import { HELP, itemUrl, parseArgs, registryBase } from "../src/cli.js";

const { command, names, flags } = parseArgs(process.argv.slice(2));

async function list() {
  const res = await fetch(itemUrl("index"));
  if (!res.ok) throw new Error(`Registry answered ${res.status}.`);
  const index = await res.json();
  for (const item of index.items ?? []) console.log(`${item.name}  ${item.description ?? ""}`);
}

function add() {
  if (names.length === 0)
    throw new Error("Say which component to add, e.g. `npx @abdulqadirmsingi/zuri add button`.");
  const urls = names.map((n) => itemUrl(n, registryBase()));
  // shell: false, so a component name can never become a shell command.
  const child = spawn("npx", ["--yes", "shadcn@latest", "add", ...urls, ...flags], {
    stdio: "inherit",
  });
  child.on("exit", (code) => process.exit(code ?? 1));
}

try {
  if (command === "add") add();
  else if (command === "list") await list();
  else console.log(HELP);
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
