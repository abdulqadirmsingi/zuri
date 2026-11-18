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

/**
 * Pro licence keys. The plaintext key is shown once at creation and never stored:
 * only its sha256 (keys are 256 bits of randomness, so a fast hash is appropriate).
 */
export const licenceKeys = pgTable(
  "licence_keys",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    keyHash: text("key_hash").notNull().unique(),
    /** First characters of the key, so the owner can recognise it in the admin UI. */
    keyPrefix: text("key_prefix").notNull(),
    /** Opaque reference to the customer at the payment provider. No emails here. */
    customerRef: text("customer_ref").notNull(),
    tier: text("tier").notNull().default("pro"),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
  },
  (t) => [index("licence_keys_status_idx").on(t.status)],
);
