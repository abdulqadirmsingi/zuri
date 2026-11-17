import { describe, expect, it } from "vitest";
import { parseItemName, readRegistryItem } from "./registry-files";

describe("parseItemName", () => {
  it("accepts kebab-case with or without .json", () => {
    expect(parseItemName("button")).toBe("button");
    expect(parseItemName("amount-input.json")).toBe("amount-input");
  });
  it.each(["../secret", "a/b", "Button", "", "-x", "a--b", "x".repeat(65), "..%2f"])(
    "rejects %s",
    (input) => expect(parseItemName(input)).toBeNull(),
  );
});

describe("readRegistryItem", () => {
  const loaders = {
    button: async () => ({ default: { name: "button", meta: { version: "0.1.0", tier: "pro" } } }),
    bare: async () => ({ default: { name: "bare" } }),
  };

  it("returns the item JSON with version and tier", async () => {
    const item = await readRegistryItem("button", loaders);
    expect(JSON.parse(item?.body ?? "{}").name).toBe("button");
    expect(item).toMatchObject({ version: "0.1.0", tier: "pro" });
  });
  it("defaults missing metadata", async () => {
    expect(await readRegistryItem("bare", loaders)).toMatchObject({ version: null, tier: "free" });
  });
  it("returns null for unknown names, including Object.prototype keys", async () => {
    expect(await readRegistryItem("nope", loaders)).toBeNull();
    expect(await readRegistryItem("constructor", loaders)).toBeNull();
  });
});
