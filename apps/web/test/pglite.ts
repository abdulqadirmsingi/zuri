import { readdirSync, readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "@/db/schema";
import type { Db } from "@/lib/analytics/db";

/** In-process Postgres with every generated migration applied, in order. Tests only. */
export async function createTestDb() {
  const client = new PGlite();
  const files = readdirSync("db/migrations")
    .filter((f) => f.endsWith(".sql"))
    .sort();
  for (const file of files) {
    const sql = readFileSync(`db/migrations/${file}`, "utf8");
    for (const statement of sql.split("--> statement-breakpoint")) await client.exec(statement);
  }
  return { client, db: drizzle(client, { schema }) as unknown as Db };
}
