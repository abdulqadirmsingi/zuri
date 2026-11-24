import { describe, expect, it } from "vitest";
import { createTestDb } from "@/test/pglite";
import { canAccess } from "./access";
import { createLicence, revokeKey } from "./keys";

const bearer = (key: string) => new Headers({ authorization: `Bearer ${key}` });

describe("canAccess", () => {
  it("lets anyone fetch free items, even with no database", async () => {
    expect(await canAccess("free", new Headers(), null)).toBe(true);
  });
  it("requires an active key for pro items", async () => {
    const { db } = await createTestDb();
    const { id, key } = await createLicence(db, { customerRef: "c" });
    expect(await canAccess("pro", new Headers(), db)).toBe(false);
    expect(await canAccess("pro", bearer("wrong"), db)).toBe(false);
    expect(await canAccess("pro", bearer(key), db)).toBe(true);
    await revokeKey(db, id);
    expect(await canAccess("pro", bearer(key), db)).toBe(false);
  });
  it("denies pro items when there is no database", async () => {
    expect(await canAccess("pro", bearer("zuri_live_x"), null)).toBe(false);
  });
});
