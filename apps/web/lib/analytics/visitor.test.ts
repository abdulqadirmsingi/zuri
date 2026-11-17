import { describe, expect, it } from "vitest";
import { classifySource, isCountedSource } from "./source";
import { clientIp, dailySalt, visitorHash } from "./visitor";

const base = { secret: "s3cret", ip: "203.0.113.7", userAgent: "shadcn" };
const day1 = new Date("2026-11-17T08:00:00Z");

describe("visitorHash", () => {
  it("is stable within a UTC day", () => {
    const a = visitorHash({ ...base, now: day1 });
    expect(visitorHash({ ...base, now: new Date("2026-11-17T23:59:59Z") })).toBe(a);
  });
  it("changes the next day, so visitors cannot be linked across days", () => {
    expect(visitorHash({ ...base, now: day1 })).not.toBe(
      visitorHash({ ...base, now: new Date("2026-11-18T00:00:01Z") }),
    );
  });
  it("differs per ip and user agent, and per secret", () => {
    const a = visitorHash({ ...base, now: day1 });
    expect(visitorHash({ ...base, ip: "198.51.100.1", now: day1 })).not.toBe(a);
    expect(visitorHash({ ...base, userAgent: "other", now: day1 })).not.toBe(a);
    expect(visitorHash({ ...base, secret: "x", now: day1 })).not.toBe(a);
  });
  it("never contains the ip", () => {
    expect(visitorHash({ ...base, now: day1 })).not.toContain("203.0.113.7");
    expect(dailySalt("s", "2026-11-17")).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("clientIp", () => {
  it("uses the first x-forwarded-for entry, then x-real-ip, then unknown", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "1.1.1.1, 2.2.2.2" }))).toBe("1.1.1.1");
    expect(clientIp(new Headers({ "x-real-ip": "3.3.3.3" }))).toBe("3.3.3.3");
    expect(clientIp(new Headers())).toBe("unknown");
  });
});

describe("classifySource", () => {
  const h = (init: Record<string, string>) => new Headers(init);
  it("recognises the shadcn CLI", () =>
    expect(classifySource(h({ "user-agent": "shadcn" }))).toBe("cli"));
  it("flags crawlers", () => {
    expect(classifySource(h({ "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1)" }))).toBe(
      "bot",
    );
    expect(classifySource(h({ "user-agent": "HeadlessChrome/120" }))).toBe("bot");
  });
  it("flags docs previews even with a cli user agent", () => {
    expect(classifySource(h({ "x-zuri-source": "docs-preview", "user-agent": "shadcn" }))).toBe(
      "docs-preview",
    );
  });
  it("falls back to unknown, including a missing user agent", () => {
    expect(classifySource(h({ "user-agent": "curl/8.0" }))).toBe("unknown");
    expect(classifySource(h({}))).toBe("unknown");
  });
  it("counts cli and unknown, not bots or previews", () => {
    expect(
      ["cli", "unknown", "bot", "docs-preview"].map((s) => isCountedSource(s as never)),
    ).toEqual([true, true, false, false]);
  });
});
