import { and, gte, inArray, sql } from "drizzle-orm";
import { installEvents } from "@/db/schema";
import type { Db } from "./db";

const COUNTED = ["cli", "unknown"];
const counted = inArray(installEvents.source, COUNTED);
const DAY = 86_400_000;

// count(...) comes back from Postgres as bigint text, so cast to int.
const rawCount = sql<number>`count(*)::int`;
const uniqueCount = sql<number>`count(distinct (${installEvents.visitorHash}, ${installEvents.component}))::int`;

export interface Totals {
  raw: number;
  unique: number;
}
export interface Overview {
  totals: { allTime: Totals; last30d: Totals; last7d: Totals; today: Totals };
  topComponents: { component: string; raw: number; unique: number }[];
  byCountry: { country: string; unique: number }[];
  /** All sources, including bots and previews, so the owner can see what is being excluded. */
  bySource: { source: string; raw: number }[];
  byTier: { tier: string; unique: number }[];
  neverInstalled: string[];
}

async function totalsSince(db: Db, since: Date | null): Promise<Totals> {
  const where = since ? and(counted, gte(installEvents.createdAt, since)) : counted;
  const [row] = await db
    .select({ raw: rawCount, unique: uniqueCount })
    .from(installEvents)
    .where(where);
  return { raw: row?.raw ?? 0, unique: row?.unique ?? 0 };
}

/** Headline numbers use the de-duplicated count (see ADR 0002). `now` is injectable for tests. */
export async function getOverview(
  db: Db,
  knownComponents: string[],
  now = new Date(),
): Promise<Overview> {
  const since30 = new Date(now.getTime() - 30 * DAY);
  const startOfToday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const in30 = and(counted, gte(installEvents.createdAt, since30));

  const [allTime, last30d, last7d, today] = await Promise.all([
    totalsSince(db, null),
    totalsSince(db, since30),
    totalsSince(db, new Date(now.getTime() - 7 * DAY)),
    totalsSince(db, startOfToday),
  ]);

  const topComponents = await db
    .select({ component: installEvents.component, raw: rawCount, unique: uniqueCount })
    .from(installEvents)
    .where(in30)
    .groupBy(installEvents.component)
    .orderBy(sql`2 desc`, installEvents.component)
    .limit(20);

  const countries = await db
    .select({ country: installEvents.country, unique: uniqueCount })
    .from(installEvents)
    .where(in30)
    .groupBy(installEvents.country)
    .orderBy(sql`2 desc`);

  const bySource = await db
    .select({ source: installEvents.source, raw: rawCount })
    .from(installEvents)
    .where(gte(installEvents.createdAt, since30))
    .groupBy(installEvents.source)
    .orderBy(sql`2 desc`);

  const byTier = await db
    .select({ tier: installEvents.tier, unique: uniqueCount })
    .from(installEvents)
    .where(in30)
    .groupBy(installEvents.tier)
    .orderBy(sql`2 desc`);

  const installed = await db
    .selectDistinct({ component: installEvents.component })
    .from(installEvents)
    .where(counted);
  const seen = new Set(installed.map((r) => r.component));

  return {
    totals: { allTime, last30d, last7d, today },
    topComponents,
    byCountry: countries.map((c) => ({ country: c.country ?? "unknown", unique: c.unique })),
    bySource,
    byTier,
    neverInstalled: knownComponents.filter((c) => !seen.has(c)).sort(),
  };
}

/** Below this the number would make the site look empty, so it is not shown (ANALYTICS.md §6). */
export const MIN_PUBLIC_INSTALLS = 10;

/** The one number shown publicly: de-duplicated installs, or null while it is too small to show. */
export async function getPublicInstalls(db: Db): Promise<number | null> {
  const { unique } = await totalsSince(db, null);
  return unique >= MIN_PUBLIC_INSTALLS ? unique : null;
}
