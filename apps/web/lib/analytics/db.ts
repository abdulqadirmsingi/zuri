import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

/** Works for postgres-js in production and PGlite in tests. */
export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

let cached: Db | null | undefined;

/**
 * Lazy so importing this module has no side effects. Returns null when DATABASE_URL is unset:
 * analytics is optional and must never stop the registry from working.
 */
export function getDb(): Db | null {
  if (cached !== undefined) return cached;
  const url = process.env.DATABASE_URL;
  cached = url ? drizzle(postgres(url, { max: 3, prepare: false }), { schema }) : null;
  return cached;
}
