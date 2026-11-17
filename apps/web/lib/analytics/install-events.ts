import { and, count, countDistinct, gte, inArray } from "drizzle-orm";
import { type InstallEventInsert, installEvents } from "@/db/schema";
import type { Db } from "./db";

/** Sources that count toward the headline number. Keep in sync with `isCountedSource`. */
const COUNTED = ["cli", "unknown"];

/**
 * Fail open: a database problem must never break or slow the registry response, so this
 * never throws, and event values are never logged.
 */
export async function recordInstall(db: Db | null, event: InstallEventInsert): Promise<void> {
  if (!db) return;
  try {
    await db.insert(installEvents).values(event);
  } catch (error) {
    console.error("install event not recorded:", safeErrorSummary(error));
  }
}

/**
 * Drizzle puts the query parameters (including the visitor hash) in `error.message`,
 * so log only the error type and the Postgres error code.
 */
function safeErrorSummary(error: unknown): string {
  const name = error instanceof Error ? error.name : "UnknownError";
  const cause = error instanceof Error ? error.cause : undefined;
  const code =
    cause && typeof cause === "object" && "code" in cause ? String(cause.code) : undefined;
  return code ? `${name} (${code})` : name;
}

export interface InstallCount {
  component: string;
  /** Every counted request (bots and docs previews excluded). */
  raw: number;
  /** One per visitor per UTC day, because the visitor hash rotates daily. */
  unique: number;
}

export async function getInstallCounts(db: Db, since: Date): Promise<InstallCount[]> {
  return db
    .select({
      component: installEvents.component,
      raw: count(),
      unique: countDistinct(installEvents.visitorHash),
    })
    .from(installEvents)
    .where(and(gte(installEvents.createdAt, since), inArray(installEvents.source, COUNTED)))
    .groupBy(installEvents.component)
    .orderBy(installEvents.component);
}

export async function getComponentCount(db: Db, component: string, since: Date) {
  const rows = await getInstallCounts(db, since);
  return rows.find((r) => r.component === component) ?? { component, raw: 0, unique: 0 };
}
