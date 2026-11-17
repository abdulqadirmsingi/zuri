# ADR 0003 — Build platform-first; host later on a Contabo VPS

Status: accepted (owner decision). Supersedes the "Hosting: Vercel" line in PROMPT.md and the Neon/Supabase option in ADR 0001.

- **Now:** build the site, docs and components with no server-side services. Install counting stays optional and is disabled when `DATABASE_URL` / `ZURI_HASH_SECRET` are unset.
- **Later:** run the Next.js app on a Contabo VPS (`next start` or Docker behind a reverse proxy) with self-hosted Postgres on the same machine. No code change is needed for the database.
- **To do at deploy time:** TLS and reverse proxy; Postgres backups (daily, per ANALYTICS.md §9); a source for the country header (the code reads `x-vercel-ip-country`, which will not exist off Vercel; use a proxy/GeoIP header or leave the column empty); keep the proxy setting `x-forwarded-for` so visitor hashing sees the client IP; edge caching of `/r` is lost, so consider proxy caching only after a count-safe design.
- **Not verified:** Contabo plan, OS, bandwidth and network details. Check before choosing a plan.
