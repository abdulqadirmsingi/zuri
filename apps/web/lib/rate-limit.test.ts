import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

function setup(limit = 3, maxKeys?: number) {
  let t = 1_000_000;
  const limiter = createRateLimiter({ limit, windowMs: 60_000, maxKeys, now: () => t });
  return {
    limiter,
    advance: (ms: number) => {
      t += ms;
    },
  };
}

describe("createRateLimiter", () => {
  it("allows up to the limit then blocks with a retry hint", () => {
    const { limiter, advance } = setup();
    expect([1, 2, 3].map(() => limiter.check("a").ok)).toEqual([true, true, true]);
    advance(10_000);
    expect(limiter.check("a")).toEqual({ ok: false, retryAfterSec: 50 });
  });
  it("tracks keys independently", () => {
    const { limiter } = setup(1);
    expect(limiter.check("a").ok).toBe(true);
    expect(limiter.check("b").ok).toBe(true);
    expect(limiter.check("a").ok).toBe(false);
  });
  it("resets after the window", () => {
    const { limiter, advance } = setup(1);
    limiter.check("a");
    expect(limiter.check("a").ok).toBe(false);
    advance(60_000);
    expect(limiter.check("a").ok).toBe(true);
  });
  it("stays bounded when many keys arrive", () => {
    const { limiter } = setup(1, 5);
    for (let i = 0; i < 50; i++) expect(limiter.check(`k${i}`).ok).toBe(true);
  });
});
