# Running Zuri locally

Requirements: Node 22+, pnpm 10 (`corepack enable`), and optionally Postgres.

Everything below was run for real on macOS except where marked **untested**.

## 1. Install and start (no database needed)

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. The registry works immediately:
`curl http://localhost:3000/r/button.json`

Without a database, installs are simply not counted, and Pro items and the admin dashboard are unavailable.

## 2. Add a database (installs, admin, Pro keys)

Pick one.

**A. Docker** (**untested** on the author's machine: the Docker daemon was not running)
```bash
pnpm db:up          # starts Postgres on 127.0.0.1:5432
```
`DATABASE_URL=postgres://zuri:zuri_dev@127.0.0.1:5432/zuri`

**B. Homebrew Postgres** (the same Postgres 15 binaries were used for all testing, on a different port)
```bash
brew services start postgresql@15
createdb zuri
```
`DATABASE_URL=postgres://localhost:5432/zuri`

Then:
```bash
cp apps/web/.env.example apps/web/.env.local
```
Edit `apps/web/.env.local`:
- `DATABASE_URL` as above.
- `ZURI_HASH_SECRET=` and `ADMIN_TOKEN=`: use two different values from `openssl rand -hex 32`.

```bash
pnpm db:migrate     # creates the tables
pnpm dev            # restart so it picks up .env.local
```

## 3. Use the admin dashboard

Go to http://localhost:3000/admin/login and paste your `ADMIN_TOKEN`.
You get install totals, top components, countries, sources, never-installed components, and Pro licence key management.
A new key is shown **once**; copy it immediately.

API (same token): `curl -H "Authorization: Bearer $ADMIN_TOKEN" http://localhost:3000/api/admin/stats`

## 4. See an install being counted

In any shadcn-initialised project:
```bash
npx shadcn@latest add http://localhost:3000/r/button.json
```
Refresh `/admin`. One install shows as **1** in the big number but several in "raw requests": the CLI fetches each item more than once (see `docs/adr/0002-install-counting.md`).

## 5. Pro items with a licence key

Create a key in `/admin`, then in the project's `components.json`:
```json
"registries": {
  "@zuri": {
    "url": "http://localhost:3000/r/{name}.json",
    "headers": { "Authorization": "Bearer ${ZURI_KEY}" }
  }
}
```
```bash
ZURI_KEY=zuri_live_... npx shadcn@latest add @zuri/<pro-item>
```
No Pro items exist yet; this was verified by temporarily marking `button` as Pro. Without a valid key the server answers 401.

## 6. Production build

```bash
pnpm build
pnpm --filter web start
```
In production the admin cookie is `Secure`, so use HTTPS (or `localhost`).
When the registry is served from a real domain, set `ZURI_REGISTRY_URL=https://your.domain` before `pnpm registry:build`, because Pro/dependency URLs in the registry JSON are generated from it (default `http://localhost:3000`).

## 7. Checks

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

## 8. Accessibility audit (real browser, WCAG 2.2 AA)

CI runs this same audit on every push to `main` and `develop` and on pull requests (the `a11y` job in `.github/workflows/ci.yml`), so a regression shows up as a failing check. You only need to run it by hand while you work.

With the site running (`pnpm dev` or `pnpm --filter web start`):
```bash
pnpm --filter web exec playwright install chromium   # once
BASE_URL=http://localhost:3000 pnpm --filter web a11y
```
It audits every docs page in light and dark with axe and exits non-zero on any violation. If your dev server is on another port, change `BASE_URL`; set `CHROME_PATH` to use an existing Chromium.

## Troubleshooting
- `/r/...` returns 500: the registry was not built. `pnpm dev` and `pnpm build` do it for you; otherwise run `pnpm registry:build`.
- `/admin` returns 404: `ADMIN_TOKEN` is unset or shorter than 32 characters (this is deliberate).
- Installs are not counted: `DATABASE_URL` or `ZURI_HASH_SECRET` is missing, or you have not run `pnpm db:migrate`.
- Too many requests (429): you hit the per-minute limit; set `ZURI_RATE_LIMIT_PER_MIN` higher for local testing.

## Home page pictures

The pictures on the home page are screenshots of the real blocks. After changing a hero or the starter, start the site and run `BASE_URL=http://localhost:3000 node apps/web/scripts/home-shots.mjs` to refresh `apps/web/public/home/`.
