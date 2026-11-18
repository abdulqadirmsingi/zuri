import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { isAdminConfigured, SESSION_COOKIE, verifySession } from "./auth";

/** For admin pages: 404 when admin is disabled, redirect to login when not signed in. */
export async function requireAdminPage(): Promise<void> {
  const token = process.env.ADMIN_TOKEN;
  if (!isAdminConfigured(token)) notFound();
  const jar = await cookies();
  if (!verifySession(token, jar.get(SESSION_COOKIE)?.value, Date.now())) redirect("/admin/login");
}
