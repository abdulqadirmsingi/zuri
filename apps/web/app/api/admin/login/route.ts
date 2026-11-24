import { z } from "zod";
import {
  createSession,
  isAdminConfigured,
  SESSION_COOKIE,
  SESSION_TTL_MS,
  safeEqual,
} from "@/lib/admin/auth";
import { json, requireJson } from "@/lib/admin/guard";
import { clientIp } from "@/lib/analytics/visitor";
import { createRateLimiter } from "@/lib/rate-limit";

// Slows password-guessing: 10 attempts per minute per client.
const limiter = createRateLimiter({ limit: 10, windowMs: 60_000 });
const body = z.object({ token: z.string().min(1).max(512) });

export async function POST(request: Request) {
  const configured = process.env.ADMIN_TOKEN;
  if (!isAdminConfigured(configured)) return json({ error: "Not found" }, 404);

  const rate = limiter.check(clientIp(request.headers));
  if (!rate.ok)
    return json({ error: "Too many attempts" }, 429, { "Retry-After": String(rate.retryAfterSec) });

  const notJson = requireJson(request);
  if (notJson) return notJson;
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !safeEqual(parsed.data.token, configured))
    return json({ error: "Invalid token" }, 401);

  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const cookie = `${SESSION_COOKIE}=${createSession(configured, Date.now())}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_MS / 1000}${secure}`;
  return json({ ok: true }, 200, { "Set-Cookie": cookie });
}
