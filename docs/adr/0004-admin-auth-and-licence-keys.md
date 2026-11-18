# ADR 0004 — Admin auth and licence keys

Status: accepted. Deviates from PROMPT.md, which suggested Auth.js or Better Auth.

**Admin auth: one secret, no user accounts.** Zuri has a single owner, so full auth libraries and a users table are more surface area than value. `ADMIN_TOKEN` (32+ chars) is accepted as `Authorization: Bearer`, or exchanged at `/api/admin/login` for an HttpOnly, `SameSite=Strict` session cookie (12 h, stateless: `<expiry>.<hmac>`). If the token is unset, every admin endpoint answers 404. Comparisons hash first so length is not observable. Login is limited to 10 attempts/min/client. Mutations require `Content-Type: application/json` as a second CSRF layer. Revisit (Auth.js/Better Auth) if more than one admin is ever needed.

**Licence keys.** `zuri_live_` + 256 random bits. Only the sha256 is stored (plus a 4-char prefix for recognition); the plaintext is returned once at creation. A fast hash is appropriate because the key is high-entropy, not a human password. Revocation is immediate (checked on every request).

**Pro gating fails closed.** If the database is down or the lookup errors, Pro items return 401. (Install counting does the opposite and fails open; see ADR 0002.)

**Verified with the real shadcn CLI (4.23.0):** a `registries` entry in `components.json` with `headers: { "Authorization": "Bearer ${ZURI_KEY}" }` installs a Pro item when `ZURI_KEY` is set and fails without it.

**Not verified / not done:** whether the CLI forwards the header when a Pro item's `registryDependencies` use full URLs to a different registry entry; `licence_usage` (per-key usage counts); a payment-provider webhook that issues keys (no provider chosen: needs a Tanzania seller-support check); key-creation rate limiting.
