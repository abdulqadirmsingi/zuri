import { createHash, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { licenceKeys } from "@/db/schema";
import type { Db } from "@/lib/analytics/db";

const PREFIX = "zuri_live_";

export function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

/** 256 bits of randomness, URL-safe. The plaintext is returned once and never stored. */
export function generateKey(): { key: string; hash: string; prefix: string } {
  const key = `${PREFIX}${randomBytes(32).toString("base64url")}`;
  return { key, hash: hashKey(key), prefix: key.slice(0, PREFIX.length + 4) };
}

/** Extracts the token from an `Authorization: Bearer <key>` header, or null. */
export function bearerToken(headers: Headers): string | null {
  const match = /^Bearer\s+(\S+)$/i.exec(headers.get("authorization") ?? "");
  return match?.[1] ?? null;
}

export async function createLicence(db: Db, input: { customerRef: string; tier?: string }) {
  const { key, hash, prefix } = generateKey();
  const [row] = await db
    .insert(licenceKeys)
    .values({
      keyHash: hash,
      keyPrefix: prefix,
      customerRef: input.customerRef,
      tier: input.tier ?? "pro",
    })
    .returning({ id: licenceKeys.id });
  // The only time the plaintext key exists outside the customer's hands.
  return { id: row?.id ?? 0, key, prefix };
}

/**
 * Fails CLOSED: with no database, or on any error, access is denied. This is the opposite of
 * install counting on purpose, so an outage can never hand out Pro items.
 */
export async function verifyKey(db: Db | null, key: string | null): Promise<boolean> {
  if (!db || !key) return false;
  try {
    const [row] = await db
      .select({ status: licenceKeys.status })
      .from(licenceKeys)
      .where(eq(licenceKeys.keyHash, hashKey(key)))
      .limit(1);
    return row?.status === "active";
  } catch {
    return false;
  }
}

export async function revokeKey(db: Db, id: number): Promise<boolean> {
  const rows = await db
    .update(licenceKeys)
    .set({ status: "revoked", revokedAt: new Date() })
    .where(eq(licenceKeys.id, id))
    .returning({ id: licenceKeys.id });
  return rows.length > 0;
}

/** Never returns hashes: the admin UI only needs the prefix to recognise a key. */
export async function listKeys(db: Db) {
  return db
    .select({
      id: licenceKeys.id,
      keyPrefix: licenceKeys.keyPrefix,
      customerRef: licenceKeys.customerRef,
      tier: licenceKeys.tier,
      status: licenceKeys.status,
      createdAt: licenceKeys.createdAt,
      revokedAt: licenceKeys.revokedAt,
    })
    .from(licenceKeys)
    .orderBy(licenceKeys.id);
}
