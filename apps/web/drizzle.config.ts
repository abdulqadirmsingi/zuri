import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./db/migrations",
  // Only needed for `drizzle-kit migrate`; `generate` works without it.
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
