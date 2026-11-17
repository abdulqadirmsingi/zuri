import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as schema from "@/db/schema";
import type { Db } from "./db";
import { getComponentCount, getInstallCounts, recordInstall } from "./install-events";

const migration = readFileSync("db/migrations/0000_install_events.sql", "utf8");
const since = new Date("2000-01-01");

async function setup() {
  const client = new PGlite();
  for (const statement of migration.split("--> statement-breakpoint")) await client.exec(statement);
  return { client, db: drizzle(client, { schema }) as unknown as Db };
}

const ev = (over: Partial<schema.InstallEventInsert> = {}): schema.InstallEventInsert => ({
  component: "button",
  version: "0.1.0",
  tier: "free",
  country: "TZ",
  source: "cli",
  visitorHash: "v1",
  ...over,
});

describe("install events", () => {
  let ctx: Awaited<ReturnType<typeof setup>>;
  beforeEach(async () => {
    ctx = await setup();
  });

  it("records one row per request", async () => {
    await recordInstall(ctx.db, ev());
    expect(await ctx.db.select().from(schema.installEvents)).toHaveLength(1);
  });

  it("same visitor twice: raw 2, unique 1", async () => {
    await recordInstall(ctx.db, ev());
    await recordInstall(ctx.db, ev());
    expect(await getComponentCount(ctx.db, "button", since)).toEqual({
      component: "button",
      raw: 2,
      unique: 1,
    });
  });

  it("counts different visitors separately and keeps components apart", async () => {
    await recordInstall(ctx.db, ev({ visitorHash: "a" }));
    await recordInstall(ctx.db, ev({ visitorHash: "b" }));
    await recordInstall(ctx.db, ev({ component: "zuri-tokens", visitorHash: "a" }));
    const counts = await getInstallCounts(ctx.db, since);
    expect(counts).toEqual([
      { component: "button", raw: 2, unique: 2 },
      { component: "zuri-tokens", raw: 1, unique: 1 },
    ]);
  });

  it("keeps bot and docs-preview rows but excludes them from counts", async () => {
    await recordInstall(ctx.db, ev({ source: "bot", visitorHash: "b1" }));
    await recordInstall(ctx.db, ev({ source: "docs-preview", visitorHash: "p1" }));
    expect(await ctx.db.select().from(schema.installEvents)).toHaveLength(2);
    expect(await getInstallCounts(ctx.db, since)).toEqual([]);
  });

  it("respects the since window", async () => {
    await recordInstall(ctx.db, ev());
    expect(await getInstallCounts(ctx.db, new Date(Date.now() + 60_000))).toEqual([]);
  });

  it("fails open: a broken database never throws", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    await ctx.client.close();
    await expect(recordInstall(ctx.db, ev())).resolves.toBeUndefined();
    expect(error).toHaveBeenCalledOnce();
    expect(JSON.stringify(error.mock.calls)).not.toContain("v1");
    error.mockRestore();
  });

  it("does nothing without a database", async () => {
    await expect(recordInstall(null, ev())).resolves.toBeUndefined();
  });
});
