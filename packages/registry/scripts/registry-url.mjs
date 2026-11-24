/**
 * The public address the registry JSON should point at, with no trailing slash.
 *
 * registryDependencies must be absolute URLs, so they are written at build time. One variable is
 * enough: ZURI_REGISTRY_URL wins if set, otherwise the site's own NEXT_PUBLIC_SITE_URL is used.
 * On a production deploy a localhost address is an error, because it would make every install
 * that has a dependency (such as the tokens) fail on the user's machine.
 */
export function resolveRegistryUrl(env = process.env) {
  const raw = env.ZURI_REGISTRY_URL || env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const base = raw.replace(/\/+$/, "");
  if (env.VERCEL_ENV === "production" && /localhost|127\.0\.0\.1/.test(base)) {
    throw new Error(
      `The registry URL is "${base}" on a production build. Set NEXT_PUBLIC_SITE_URL (or ZURI_REGISTRY_URL) to the public address, e.g. https://components.example.com.`,
    );
  }
  return base;
}
