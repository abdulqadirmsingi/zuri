import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(import.meta.dirname) } },
  test: {
    // Several tests start an in-process Postgres (PGlite) inside the test itself, and the first one
    // in a file also pays to compile its WebAssembly. That normally takes well under a second, but
    // on a busy 2-core CI runner it once took longer than vitest's default 5 seconds (a test timed
    // out at 5199 ms while its neighbours passed). A real hang still fails, just after 30 seconds.
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
