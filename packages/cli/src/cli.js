// A thin wrapper: Zuri is a shadcn-compatible registry, so the heavy lifting (writing files,
// installing dependencies, Tailwind setup) stays in the shadcn CLI. This only builds the URLs.

export const DEFAULT_REGISTRY = "https://components.abdulqadirmsingi.com";

const NAME = /^[a-z0-9][a-z0-9-]*$/;

/** Base URL of the registry; ZURI_REGISTRY lets you point at a local dev server. */
export function registryBase(env = process.env) {
  return (env.ZURI_REGISTRY || DEFAULT_REGISTRY).replace(/\/+$/, "");
}

/** Turns `button` into its registry URL. Throws on anything that is not a plain item name. */
export function itemUrl(name, base = registryBase()) {
  if (!NAME.test(name)) throw new Error(`"${name}" is not a valid component name.`);
  return `${base}/r/${name}.json`;
}

/** Splits argv into the command, component names and flags to forward to shadcn. */
export function parseArgs(argv) {
  const [command, ...rest] = argv;
  const names = [];
  const flags = [];
  for (const arg of rest) (arg.startsWith("-") ? flags : names).push(arg);
  return { command, names, flags };
}

export const HELP = `zuri — beautiful React components you own

Usage
  npx zuri add <component...> [shadcn flags]   Add components to your project
  npx zuri list                                 Show what is available

Examples
  npx zuri add otp-input
  npx zuri add button card --overwrite

Docs: ${DEFAULT_REGISTRY}
`;
