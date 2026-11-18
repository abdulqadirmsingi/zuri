import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Components import "@/lib/utils" (the shadcn convention), so map it like a user's project would.
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  test: { environment: "jsdom", setupFiles: ["./vitest.setup.ts"] },
});
