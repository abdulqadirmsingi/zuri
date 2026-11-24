import { clientIp } from "./analytics/visitor";
import { createRateLimiter, type RateLimitResult } from "./rate-limit";

const perMinute = Number(process.env.ZURI_RATE_LIMIT_PER_MIN) || 120;

// Keyed by IP, held only in this process's memory (never written to the database or logs).
const limiter = createRateLimiter({ limit: perMinute, windowMs: 60_000 });

export function checkRegistryRate(headers: Headers): RateLimitResult {
  return limiter.check(clientIp(headers));
}
