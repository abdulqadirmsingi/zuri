import { describe, expect, it } from "vitest";
import {
  createSession,
  isAdminConfigured,
  isAdminRequest,
  SESSION_COOKIE,
  SESSION_TTL_MS,
  verifySession,
} from "./auth";

const token = "a".repeat(32);
const now = 1_000_000;

describe("isAdminConfigured", () => {
  it("requires a long secret", () => {
    expect(isAdminConfigured(undefined)).toBe(false);
    expect(isAdminConfigured("short")).toBe(false);
    expect(isAdminConfigured(token)).toBe(true);
  });
});

describe("sessions", () => {
  it("accepts a fresh session and rejects an expired one", () => {
    const s = createSession(token, now);
    expect(verifySession(token, s, now + 1)).toBe(true);
    expect(verifySession(token, s, now + SESSION_TTL_MS)).toBe(false);
  });
  it("rejects tampering, other secrets and junk", () => {
    const s = createSession(token, now);
    const [expiry, mac] = s.split(".");
    expect(verifySession(token, `${Number(expiry) + 1_000_000}.${mac}`, now)).toBe(false);
    expect(verifySession("b".repeat(32), s, now)).toBe(false);
    for (const junk of [undefined, "", "x", "1.", ".abc", "NaN.abc"])
      expect(verifySession(token, junk, now)).toBe(false);
  });
});

describe("isAdminRequest", () => {
  const cookie = `${SESSION_COOKIE}=${createSession(token, now)}`;
  it("accepts the bearer token or a session cookie", () => {
    expect(isAdminRequest(new Headers({ authorization: `Bearer ${token}` }), token, now)).toBe(
      true,
    );
    expect(isAdminRequest(new Headers({ cookie: `a=b; ${cookie}` }), token, now)).toBe(true);
  });
  it("rejects wrong credentials and anonymous requests", () => {
    expect(isAdminRequest(new Headers({ authorization: "Bearer wrong" }), token, now)).toBe(false);
    expect(isAdminRequest(new Headers(), token, now)).toBe(false);
  });
  it("is disabled when the token is unset or too short, even with matching credentials", () => {
    expect(isAdminRequest(new Headers({ authorization: "Bearer short" }), "short", now)).toBe(
      false,
    );
    expect(isAdminRequest(new Headers({ authorization: "Bearer undefined" }), undefined, now)).toBe(
      false,
    );
  });
});
