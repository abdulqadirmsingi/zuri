export const appName = "Zuri";
export const docsRoute = "/docs";

// Placeholder until the real domain exists. Used in install commands shown on the docs.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

export const gitConfig = { user: "abdulqadirmsingi", repo: "zuri", branch: "main" };
