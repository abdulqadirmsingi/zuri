# Dependency audit decisions

CI runs `pnpm audit --prod --audit-level=high`. This file records why the audit is clean and what we chose to accept. Last reviewed 2026-11-18.

## Fixed with overrides

Both are in `pnpm-workspace.yaml` and both advisories have a patched release.

| Advisory | Where it came from | Fix |
|---|---|---|
| esbuild dev-server issue (moderate, `<=0.24.2`) | `drizzle-kit` → `@esbuild-kit/esm-loader` → `@esbuild-kit/core-utils` pinned an old esbuild | override that path to esbuild 0.25.12 |
| minimatch ReDoS (moderate, `<11.0.1`) | `shadcn` CLI → `ts-morph` → `@ts-morph/common` | override that path to minimatch 11.0.9 (it ships a CommonJS build) |

After the overrides, `pnpm registry:build` (which runs the shadcn CLI) and `drizzle-kit generate` were run and still work. Both are development tools: neither ships in the site.

## Accepted risk

**picomatch ReDoS through repeated extglobs, GHSA-fc5q-39xc-vjpf (high).**

- No patched version exists. 4.0.7 is the newest release on npm and is the vulnerable one, so there is nothing to upgrade to.
- The flaw needs an attacker to supply a glob pattern such as `+(*)`. In this repository picomatch is reached only through build tooling (Fumadocs reading our own content folder, the shadcn CLI, changesets) with fixed patterns that we wrote. It does not run on request data, and the registry and admin endpoints never build globs from user input.
- It is ignored by ID (`auditConfig.ignoreGhsas`), not by package, so any other picomatch advisory will still fail CI.

**Revisit** when a picomatch release newer than 4.0.7 appears: remove the ignore and run `pnpm update picomatch` (or a targeted override).

## How this was checked

With the original configuration `pnpm audit --prod --audit-level=high` exited 1; with the overrides and the exception it exits 0. A plain `pnpm audit` still lists the accepted advisory as ignored, so it stays visible.
