import { SESSION_COOKIE } from "@/lib/admin/auth";
import { json, requireJson } from "@/lib/admin/guard";

export async function POST(request: Request) {
  const notJson = requireJson(request);
  if (notJson) return notJson;
  return json({ ok: true }, 200, {
    "Set-Cookie": `${SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`,
  });
}
