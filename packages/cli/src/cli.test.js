import assert from "node:assert/strict";
import test from "node:test";
import { itemUrl, parseArgs } from "./cli.js";

test("builds a registry URL", () => {
  assert.equal(itemUrl("button", "https://x.test"), "https://x.test/r/button.json");
});

test("rejects names that could escape the path", () => {
  for (const bad of ["../etc", "a/b", "A", "", "x;rm", "https://evil.test"]) {
    assert.throws(() => itemUrl(bad, "https://x.test"));
  }
});

test("separates names from flags", () => {
  assert.deepEqual(parseArgs(["add", "a", "--overwrite", "b"]), {
    command: "add",
    names: ["a", "b"],
    flags: ["--overwrite"],
  });
});
