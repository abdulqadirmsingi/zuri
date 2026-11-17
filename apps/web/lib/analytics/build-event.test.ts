import { describe, expect, it } from "vitest";
import { buildInstallEvent } from "./build-event";

const input = {
  component: "button",
  version: "0.1.0",
  tier: "free" as const,
  headers: new Headers({
    "user-agent": "shadcn",
    "x-forwarded-for": "203.0.113.7",
    "x-vercel-ip-country": "TZ",
  }),
  secret: "s3cret",
  now: new Date("2026-11-17T08:00:00Z"),
};

describe("buildInstallEvent", () => {
  it("builds an event without any ip or user agent in it", () => {
    const event = buildInstallEvent(input);
    expect(event).toMatchObject({
      component: "button",
      source: "cli",
      country: "TZ",
      tier: "free",
    });
    const json = JSON.stringify(event);
    expect(json).not.toContain("203.0.113.7");
    expect(json).not.toContain("shadcn");
  });
  it("returns null without a secret", () => {
    expect(buildInstallEvent({ ...input, secret: undefined })).toBeNull();
    expect(buildInstallEvent({ ...input, secret: "" })).toBeNull();
  });
});
