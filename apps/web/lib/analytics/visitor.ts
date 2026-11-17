import { createHash, createHmac } from "node:crypto";

/** UTC day, e.g. "2026-11-17". The salt changes when this changes. */
export function utcDay(now: Date): string {
  return now.toISOString().slice(0, 10);
}

/**
 * Daily salt derived from a secret, so nothing needs storing and yesterday's salt is not
 * reconstructible without the secret. Rotating it stops anyone being tracked across days.
 */
export function dailySalt(secret: string, day: string): string {
  return createHmac("sha256", secret).update(day).digest("hex");
}

/** sha256(daily_salt + ip + user_agent). The IP itself is never stored. */
export function visitorHash(input: {
  secret: string;
  now: Date;
  ip: string;
  userAgent: string;
}): string {
  const salt = dailySalt(input.secret, utcDay(input.now));
  return createHash("sha256").update(`${salt}\n${input.ip}\n${input.userAgent}`).digest("hex");
}

/** Hosting platforms set x-forwarded-for; the first entry is the original client. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}
