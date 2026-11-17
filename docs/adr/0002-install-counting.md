# ADR 0002 — Install counting design

Status: accepted. Implements `docs/ANALYTICS.md` §2.

- **Counted in the route, not at the edge.** `/r/[name]` records inside `after()`, so the response is not delayed. `Cache-Control` is `s-maxage=0` on purpose: a CDN hit would skip the function and swallow the count. Revisit with a beacon design if registry traffic makes this expensive.
- **Fail open.** `recordInstall` never throws. Verified with the database stopped: the response is still 200 with valid JSON.
- **No secret, no counting.** `ZURI_HASH_SECRET` salts the daily hash; without it an IP hash could be brute-forced, so events are skipped instead.
- **Never log event values.** Drizzle puts query parameters (including the visitor hash) in `error.message`; only the error type and Postgres code are logged. A test enforces this.
- **Source detection.** The shadcn CLI (4.23.0) sends `User-Agent: shadcn`, verified by capturing a real request. Bots are matched by a small pattern list. The docs site marks its own fetches with `x-zuri-source: docs-preview`. Headline counts `cli` and `unknown`; `bot` and `docs-preview` rows are kept but excluded.
- **Raw hits are inflated; use `unique`.** One `shadcn add button` produced 4 rows (button x3, zuri-tokens x1) because the CLI fetches an item more than once. The headline number is therefore the de-duplicated one: one per visitor per component per UTC day (the salt rotates at UTC midnight, so "per 24 h" is implemented as "per UTC day").
- **Not done yet:** `?v=` version selection, owner-request exclusion, CI IP exclusion, per-visitor rate limiting, the `component_daily` rollup.
