# ANALYTICS.md — Seeing installs and usage

Goal: the owner can see **how many times each component was installed, how people use the site, and what's popular** — without collecting personal data.

## 1. What can and cannot be measured (be honest in the docs)
- ✅ **Install requests**: every `shadcn add <zuri-url>` fetches `/r/<name>.json` from our server. We can count those. This approximates installs; it does **not** prove the component is used in production, and it can't see manual copy-paste.
- ✅ **Docs-site behaviour**: page views, search queries, copy-code clicks, "view code" opens, theme toggles, which previews are used.
- ❌ We cannot see inside users' apps. Don't claim "used by N sites" — say "installed N times".

## 2. Install counting (the key feature)
All registry JSON is served through a Next.js route handler `apps/web/app/r/[name]/route.ts` (not as static files), which:
1. Looks up the prebuilt registry JSON for `name` (and optional `?v=` version).
2. Records an event (async, non-blocking; never slows or breaks the response).
3. Returns the JSON with edge caching headers for the body (counting must still run — use `waitUntil`/`after()` or a lightweight beacon design; verify caching doesn't swallow counts).

**Event fields:** `component`, `version`, `tier`, `timestamp`, `country` (from edge geo header), `source` (`cli` | `docs-preview` | `bot` | `unknown`, derived from user-agent), `visitor_hash`.
**`visitor_hash`** = `sha256(daily_rotating_salt + ip + user_agent)`. The IP itself is **never stored**. Salt rotates daily, so a person cannot be tracked across days.
**De-duplication:** count one install per `visitor_hash` + `component` per 24 h for the headline number (keep raw hits too).
**Exclusions:** the site's own preview fetches, known bots/crawlers, CI IP ranges if identifiable, and the owner's requests.
**Dependencies:** when a component pulls registry dependencies (other Zuri items), each fetch counts for that item.

## 3. Data model (Postgres + Drizzle)
- `install_events(id, component, version, tier, country, source, visitor_hash, created_at)`
- `component_daily(component, day, installs_raw, installs_unique)` — nightly rollup (cron) for fast charts
- `site_events(id, name, props jsonb, path, country, visitor_hash, created_at)` — copy-code, search, theme toggle, etc. (or use PostHog/Plausible for this)
- `licence_keys(id, key_hash, customer_ref, tier, status, created_at, revoked_at)` and `licence_usage(key_id, component, day, count)` for Pro
- Retention: raw events 13 months, rollups forever. Index on `(component, created_at)`.

## 4. Docs-site analytics
Use a privacy-friendly tool (**Plausible**, **Umami**, or **PostHog** with cookies disabled). Track custom events: `copy_install_command`, `copy_prompt` (props: component, target), `build_prompt` (props: number of components), `copy_code`, `open_code_tab`, `change_theme`, `search`, `filter_category`, `click_pro_cta`, `request_component_submit`. Respect Do-Not-Track. No cross-site tracking, no fingerprinting beyond the daily hash.

## 5. Admin dashboard (`/admin`, owner-only)
- Total installs (all-time, 30 d, 7 d, today) with trend charts
- Top components (table + bar chart), fastest-growing, never-installed (candidates to improve or remove)
- Installs by country, by source, by tier
- Component detail page: install history, referrers, docs views, copy-code rate
- Pro: active keys, revenue (from payment provider webhooks), key usage, revocation
- Export CSV; email/Telegram weekly digest (optional)
- Charts: follow accessible colour palettes; every chart has a table fallback

## 6. Public display
- Install-count badge on each component page and a "N installs" counter on the landing page (rounded, e.g. "1.2k"; hide when < 10 to avoid looking empty).
- Public `/stats` page (optional) and an embeddable SVG badge.

## 7. npm packages
npm shows download counts for `@zuri/*` packages; also pull them from the npm downloads API into the dashboard (cached daily).

## 8. Optional own CLI (later)
If a `npx @abdulqadirmsingi/zuri add` wrapper is built: anonymous, opt-out telemetry (`ZURI_TELEMETRY=0`), documented clearly, first-run notice, same hashing rules.

## 9. Privacy and compliance
- Publish a **Privacy** page listing exactly what is collected and why.
- No cookies for anonymous visitors → no consent banner needed for these analytics (confirm with local/EU rules).
- No IPs, emails or device IDs stored in analytics tables. Customer emails exist only in the payment provider and the licence table.
- Rate-limit `/r/*` (e.g. per hashed visitor) to prevent count inflation and abuse; log anomalies.
- Back up the database daily.

## 10. Acceptance tests
- Installing a component into a fresh app via the CLI creates exactly one *unique* install per component. (Measured: the CLI fetches an item several times, so raw `install_events` rows are about 3x higher; see ADR 0002.)
- Same visitor installing twice in a day increments raw but not unique.
- Bot user-agents and docs previews are excluded from the headline number.
- Endpoint still returns valid JSON if the database is down (fail open).
- Dashboard numbers match the database.
