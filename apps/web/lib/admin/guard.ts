import { type Db, getDb } from "@/lib/analytics/db";
import { isAdminConfigured, isAdminRequest } from "./auth";

const noStore = { "Cache-Control": "no-store" };

export function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { ...noStore, ...extra } });
}

/**
 * Returns a Response to send back when the caller must not proceed, otherwise null.
 * Unconfigured admin answers 404 so the endpoints do not advertise themselves.
 */
export function requireAdmin(request: Request, now = Date.now()): Response | null {
  const token = process.env.ADMIN_TOKEN;
  if (!isAdminConfigured(token)) return json({ error: "Not found" }, 404);
  if (!isAdminRequest(request.headers, token, now)) return json({ error: "Unauthorized" }, 401);
  return null;
}

/** Mutations must be JSON: with SameSite=Strict cookies this blocks cross-site form posts. */
export function requireJson(request: Request): Response | null {
  const type = request.headers.get("content-type") ?? "";
  return type.toLowerCase().startsWith("application/json")
    ? null
    : json({ error: "Expected application/json" }, 415);
}

export function requireDb(): Db | Response {
  return getDb() ?? json({ error: "Database not configured" }, 503);
}
