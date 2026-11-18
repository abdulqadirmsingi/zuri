import { describe, expect, it } from "vitest";
import { type InstallEventInsert, installEvents } from "@/db/schema";
import { createTestDb } from "@/test/pglite";
import { getOverview } from "./stats";

const now = new Date("2026-11-18T12:00:00Z");
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000);
const ev = (over: Partial<InstallEventInsert> = {}): InstallEventInsert => ({
  component: "button",
  version: "0.1.0",
  tier: "free",
  country: "TZ",
  source: "cli",
  visitorHash: "v1",
  createdAt: hoursAgo(1),
  ...over,
});

describe("getOverview", () => {
  it("is all zeros and lists every known component as never installed when empty", async () => {
    const { db } = await createTestDb();
    const o = await getOverview(db, ["button", "zuri-tokens"], now);
    expect(o.totals.allTime).toEqual({ raw: 0, unique: 0 });
    expect(o.neverInstalled).toEqual(["button", "zuri-tokens"]);
    expect(o.topComponents).toEqual([]);
  });

  it("separates time windows, de-duplicates visitors and excludes bots from totals", async () => {
    const { db } = await createTestDb();
    await db.insert(installEvents).values([
      ev(), // today
      ev(), // same visitor again today: raw+1, unique unchanged
      ev({ visitorHash: "v2", createdAt: hoursAgo(24 * 3) }), // 3 days ago
      ev({ visitorHash: "v3", createdAt: hoursAgo(24 * 20), country: "KE" }), // 20 days ago
      ev({ visitorHash: "v4", createdAt: hoursAgo(24 * 60) }), // 60 days ago
      ev({ visitorHash: "b", source: "bot" }), // never in totals
      ev({ component: "zuri-tokens", visitorHash: "v1" }),
    ]);
    const o = await getOverview(db, ["button", "zuri-tokens", "card"], now);
    expect(o.totals.today).toEqual({ raw: 3, unique: 2 }); // button x2 (1 unique) + tokens
    expect(o.totals.last7d.unique).toBe(3);
    expect(o.totals.last30d.unique).toBe(4);
    expect(o.totals.allTime.unique).toBe(5);
    expect(o.topComponents[0]).toMatchObject({ component: "button" });
    expect(o.byCountry.map((c) => c.country).sort()).toEqual(["KE", "TZ"]);
    expect(o.bySource.find((s) => s.source === "bot")?.raw).toBe(1);
    expect(o.neverInstalled).toEqual(["card"]);
  });

  it("labels a missing country as unknown", async () => {
    const { db } = await createTestDb();
    await db.insert(installEvents).values(ev({ country: null }));
    expect((await getOverview(db, [], now)).byCountry).toEqual([{ country: "unknown", unique: 1 }]);
  });
});
