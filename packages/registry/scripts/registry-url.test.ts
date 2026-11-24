import { describe, expect, it } from "vitest";
// @ts-expect-error plain .mjs build helper with no type declarations
import { resolveRegistryUrl } from "./registry-url.mjs";

describe("resolveRegistryUrl", () => {
  it("defaults to localhost for local development", () => {
    expect(resolveRegistryUrl({})).toBe("http://localhost:3000");
  });

  it("falls back to the site URL, so one variable is enough", () => {
    expect(resolveRegistryUrl({ NEXT_PUBLIC_SITE_URL: "https://example.com/" })).toBe(
      "https://example.com",
    );
  });

  it("prefers ZURI_REGISTRY_URL when both are set", () => {
    expect(
      resolveRegistryUrl({
        ZURI_REGISTRY_URL: "https://registry.example.com",
        NEXT_PUBLIC_SITE_URL: "https://example.com",
      }),
    ).toBe("https://registry.example.com");
  });

  it("refuses localhost on a production deploy", () => {
    expect(() => resolveRegistryUrl({ VERCEL_ENV: "production" })).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });

  it("allows localhost on previews and local builds", () => {
    expect(resolveRegistryUrl({ VERCEL_ENV: "preview" })).toBe("http://localhost:3000");
  });
});
