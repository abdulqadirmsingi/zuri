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
      {
        find: "@/components/ui/avatar",
        replacement: path.resolve(import.meta.dirname, "src/display/avatar/avatar"),
      },
      {
        find: "@/components/ui/dialog",
        replacement: path.resolve(import.meta.dirname, "src/overlays/dialog/dialog"),
      },
      {
        find: "@/components/ui/dropdown-menu",
        replacement: path.resolve(import.meta.dirname, "src/overlays/dropdown-menu/dropdown-menu"),
      },
      {
        find: "@/components/ui/closing-cta",
        replacement: path.resolve(import.meta.dirname, "src/blocks/closing-cta/closing-cta"),
      },
      {
        find: "@/components/ui/marquee",
        replacement: path.resolve(import.meta.dirname, "src/blocks/marquee/marquee"),
      },
      {
        find: "@/components/ui/reveal",
        replacement: path.resolve(import.meta.dirname, "src/blocks/reveal/reveal"),
      },
      {
        find: "@/components/ui/section-heading",
        replacement: path.resolve(
          import.meta.dirname,
          "src/blocks/section-heading/section-heading",
        ),
      },
      {
        find: "@/components/ui/site-footer",
        replacement: path.resolve(import.meta.dirname, "src/blocks/site-footer/site-footer"),
      },
      {
        find: "@/components/ui/site-header",
        replacement: path.resolve(import.meta.dirname, "src/blocks/site-header/site-header"),
      },
      {
        find: "@/components/ui/split-hero",
        replacement: path.resolve(import.meta.dirname, "src/blocks/split-hero/split-hero"),
      },
      { find: "@", replacement: path.resolve(import.meta.dirname, "src") },
    ],
  },
  test: { environment: "jsdom", setupFiles: ["./vitest.setup.ts"] },
});
