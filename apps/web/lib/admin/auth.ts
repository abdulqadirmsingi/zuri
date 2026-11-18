import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { bearerToken } from "@/lib/licence/keys";

export const SESSION_COOKIE = "zuri_admin";
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const MIN_TOKEN_LENGTH = 32;

/** Admin is disabled unless a long secret is configured. */
export function isAdminConfigured(token: string | undefined): token is string {
  return typeof token === "string" && token.length >= MIN_TOKEN_LENGTH;
}

/** Compare via sha256 so length differences are not observable through timing. */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

function sign(token: string, expiresAt: number): string {
  return createHmac("sha256", token).update(`admin-session:${expiresAt}`).digest("hex");
}

/** Cookie value: `<expiry ms>.<hmac>`. Stateless, expires, and is useless without the token. */
export function createSession(token: string, now: number): string {
  const expiresAt = now + SESSION_TTL_MS;
  return `${expiresAt}.${sign(token, expiresAt)}`;
}

export function verifySession(token: string, value: string | undefined, now: number): boolean {
  if (!value) return false;
  const [expiry, mac] = value.split(".");
  const expiresAt = Number(expiry);
  if (!mac || !Number.isFinite(expiresAt) || expiresAt <= now) return false;
  return safeEqual(mac, sign(token, expiresAt));
}

function cookieValue(header: string | null, name: string): string | undefined {
  for (const part of (header ?? "").split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return undefined;
}

/** True for a valid `Authorization: Bearer <ADMIN_TOKEN>` or a valid, unexpired session cookie. */
export function isAdminRequest(headers: Headers, token: string | undefined, now: number): boolean {
  if (!isAdminConfigured(token)) return false;
  const bearer = bearerToken(headers);
  if (bearer && safeEqual(bearer, token)) return true;
  return verifySession(token, cookieValue(headers.get("cookie"), SESSION_COOKIE), now);
}
