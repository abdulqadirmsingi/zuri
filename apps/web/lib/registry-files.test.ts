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
  const loaders = { button: async () => ({ default: { name: "button" } }) };

  it("returns the item JSON", async () => {
    expect(await readRegistryItem("button", loaders)).toBe('{"name":"button"}');
  });
  it("returns null for unknown names, including Object.prototype keys", async () => {
    expect(await readRegistryItem("nope", loaders)).toBeNull();
    expect(await readRegistryItem("constructor", loaders)).toBeNull();
  });
});
