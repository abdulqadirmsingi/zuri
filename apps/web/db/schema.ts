import { bigserial, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * One row per request to /r/<name>. No IPs, emails or device IDs: `visitor_hash` is a
 * daily-rotating salted hash, so a person cannot be followed across days.
 */
export const installEvents = pgTable(
  "install_events",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    component: text("component").notNull(),
    version: text("version"),
    tier: text("tier").notNull(),
    country: text("country"),
    source: text("source").notNull(),
    visitorHash: text("visitor_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("install_events_component_created_idx").on(t.component, t.createdAt),
    index("install_events_visitor_component_idx").on(t.visitorHash, t.component),
  ],
);

export type InstallEventInsert = typeof installEvents.$inferInsert;
