import { describe, expect, it } from "vitest";
import { createTestDb } from "@/test/pglite";
import {
  bearerToken,
  createLicence,
  generateKey,
  hashKey,
  listKeys,
  revokeKey,
  verifyKey,
} from "./keys";

describe("generateKey", () => {
  it("produces unique, prefixed keys whose hash differs from the key", () => {
    const a = generateKey();
    const b = generateKey();
    expect(a.key).toMatch(/^zuri_live_[A-Za-z0-9_-]{43}$/);
    expect(a.key).not.toBe(b.key);
    expect(a.hash).toBe(hashKey(a.key));
    expect(a.hash).not.toContain(a.key);
  });
});

describe("bearerToken", () => {
  it("extracts the token", () => {
    expect(bearerToken(new Headers({ authorization: "Bearer abc" }))).toBe("abc");
    expect(bearerToken(new Headers({ authorization: "bearer abc" }))).toBe("abc");
  });
  it.each(["", "Basic abc", "Bearer", "Bearer a b"])("rejects %j", (value) => {
    expect(bearerToken(new Headers(value ? { authorization: value } : {}))).toBeNull();
  });
});

describe("licence lifecycle", () => {
  it("verifies an active key, rejects unknown ones, and stores only the hash", async () => {
    const { db } = await createTestDb();
    const { key } = await createLicence(db, { customerRef: "cus_1" });
    expect(await verifyKey(db, key)).toBe(true);
    expect(await verifyKey(db, `${key}x`)).toBe(false);
    expect(await verifyKey(db, null)).toBe(false);
    expect(JSON.stringify(await listKeys(db))).not.toContain(key);
  });

  it("revocation takes effect immediately", async () => {
    const { db } = await createTestDb();
    const { id, key } = await createLicence(db, { customerRef: "cus_1" });
    expect(await revokeKey(db, id)).toBe(true);
    expect(await verifyKey(db, key)).toBe(false);
    expect(await revokeKey(db, 9999)).toBe(false);
  });

  it("lists keys by prefix only, with no hash column", async () => {
    const { db } = await createTestDb();
    const { prefix } = await createLicence(db, { customerRef: "cus_1" });
    const [row] = await listKeys(db);
    expect(row?.keyPrefix).toBe(prefix);
    expect(row).not.toHaveProperty("keyHash");
  });

  it("fails closed without a database or when the database errors", async () => {
    const { db, client } = await createTestDb();
    const { key } = await createLicence(db, { customerRef: "cus_1" });
    expect(await verifyKey(null, key)).toBe(false);
    await client.close();
    expect(await verifyKey(db, key)).toBe(false);
  });
});
