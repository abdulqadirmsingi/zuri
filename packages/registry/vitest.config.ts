import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Components import "@/lib/utils" (the shadcn convention), so map it like a user's project would.
  resolve: {
    alias: [
      // A component that imports another uses the user-side path; map it to the source here.
      {
        find: "@/components/ui/button",
        replacement: path.resolve(import.meta.dirname, "src/actions/button/button"),
      },
      {
        find: "@/components/ui/input",
        replacement: path.resolve(import.meta.dirname, "src/inputs/input/input"),
      },
      { find: "@", replacement: path.resolve(import.meta.dirname, "src") },
    ],
  },
  test: { environment: "jsdom", setupFiles: ["./vitest.setup.ts"] },
});
