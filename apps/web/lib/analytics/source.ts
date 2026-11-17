export type InstallSource = "cli" | "docs-preview" | "bot" | "unknown";

// Deliberately small: the aim is to keep obvious crawlers out of the headline number,
// not to be a complete bot list.
const BOT_PATTERN =
  /bot|crawl|spider|slurp|headlesschrome|lighthouse|pingdom|uptimerobot|facebookexternalhit|embedly|preview/i;

/**
 * The shadcn CLI (verified with 4.23.0) sends `User-Agent: shadcn`. The docs site marks its
 * own preview fetches with `x-zuri-source: docs-preview`; that header is spoofable, but the only
 * thing spoofing it can do is exclude a request from the count.
 */
export function classifySource(headers: Headers): InstallSource {
  if (headers.get("x-zuri-source") === "docs-preview") return "docs-preview";
  const ua = headers.get("user-agent") ?? "";
  if (BOT_PATTERN.test(ua)) return "bot";
  if (ua.toLowerCase().startsWith("shadcn")) return "cli";
  return "unknown";
}

/** Sources that count toward the headline number (raw hits are always kept). */
export function isCountedSource(source: InstallSource): boolean {
  return source === "cli" || source === "unknown";
}
