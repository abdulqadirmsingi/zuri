# ADR 0001 — Phase 0 tooling choices

Status: accepted (owner said "use your recommendations").

| Area | Choice | Why |
|---|---|---|
| Package manager / build | pnpm workspaces + Turborepo | Specified in PROMPT.md. |
| Lint + format | Biome | One fast tool; fewer dependencies than ESLint + Prettier. |
| Docs | Fumadocs (added in the docs-shell step) | Less custom MDX plumbing to maintain. |
| Analytics DB tests | PGlite (in-process Postgres) | No Docker needed to run tests; production stays Postgres (Neon or Supabase, undecided). |
| TypeScript | 5.9.x, not 7.x | Latest major (7.0.2) is newer than the Next.js and Biome ecosystem has been checked against. Revisit once verified. |
| Site URL / npm scope | `NEXT_PUBLIC_SITE_URL` config; `zuri.dev` and `@zuri` remain placeholders | Domain and scope availability are unchecked. |
| Payment provider | Deferred | Must verify Tanzania seller support (Polar, Lemon Squeezy) before an ADR. Nothing assumed. |

Tokens are plain CSS variables (`packages/tokens`) mapped to Tailwind v4 via `@theme inline`, so copied components work without the monorepo.
