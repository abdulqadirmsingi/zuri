export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the caller may retry; 0 when ok. */
  retryAfterSec: number;
}

export interface RateLimiter {
  check(key: string): RateLimitResult;
}

/**
 * Fixed-window limiter held in memory. Good enough for one server process (our VPS plan);
 * with several instances each would enforce its own limit. Keys are never persisted.
 */
export function createRateLimiter(options: {
  limit: number;
  windowMs: number;
  maxKeys?: number;
  now?: () => number;
}): RateLimiter {
  const { limit, windowMs, maxKeys = 10_000, now = Date.now } = options;
  const windows = new Map<string, { start: number; count: number }>();

  return {
    check(key) {
      const t = now();
      if (windows.size >= maxKeys) {
        // Bound memory: drop expired windows first, and if still full, start over.
        for (const [k, w] of windows) if (t - w.start >= windowMs) windows.delete(k);
        if (windows.size >= maxKeys) windows.clear();
      }
      const current = windows.get(key);
      if (!current || t - current.start >= windowMs) {
        windows.set(key, { start: t, count: 1 });
        return { ok: true, retryAfterSec: 0 };
      }
      current.count += 1;
      if (current.count <= limit) return { ok: true, retryAfterSec: 0 };
      return {
        ok: false,
        retryAfterSec: Math.max(1, Math.ceil((current.start + windowMs - t) / 1000)),
      };
    },
  };
}
