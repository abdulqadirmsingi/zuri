import { describe, expect, it } from "vitest";
import { COUNTRIES } from "./countries";
import { digitsOf, findByDial, groupDigits, isPlausible, toE164 } from "./phone-number";

const tz = COUNTRIES.find((c) => c.iso === "TZ");
if (!tz) throw new Error("TZ missing");

describe("countries", () => {
  it("has unique ISO codes, numeric dial codes and no leading plus", () => {
    expect(new Set(COUNTRIES.map((c) => c.iso)).size).toBe(COUNTRIES.length);
    for (const c of COUNTRIES) {
      expect(c.iso).toMatch(/^[A-Z]{2}$/);
      expect(c.dial).toMatch(/^[1-9]\d{0,3}$/);
    }
  });
  it("is sorted by name", () => {
    const names = COUNTRIES.map((c) => c.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, "en")));
  });
  it("lists the default dialling codes correctly", () => {
    const dial = (iso: string) => COUNTRIES.find((c) => c.iso === iso)?.dial;
    expect([dial("TZ"), dial("KE"), dial("UG"), dial("RW"), dial("GB"), dial("US")]).toEqual([
      "255",
      "254",
      "256",
      "250",
      "44",
      "1",
    ]);
  });
});

describe("phone number helpers", () => {
  it("keeps only digits", () => expect(digitsOf("+255 (712) 345-678")).toBe("255712345678"));
  it("groups in threes", () => {
    expect(groupDigits("712")).toBe("712");
    expect(groupDigits("7123456789")).toBe("712 345 678 9");
    expect(groupDigits("")).toBe("");
  });
  it("finds the country by the longest dial code", () => {
    expect(findByDial("255712345678", COUNTRIES)?.country.iso).toBe("TZ");
    expect(findByDial("255712345678", COUNTRIES)?.national).toBe("712345678");
    // +20 is Egypt, +211 is South Sudan: the longer matching code must not be shadowed.
    expect(findByDial("211912345678", COUNTRIES)?.country.iso).toBe("SS");
    expect(findByDial("20100123456", COUNTRIES)?.country.iso).toBe("EG");
    expect(findByDial("000", COUNTRIES)).toBeNull();
  });
  it("prefers the current country when a code is shared", () => {
    expect(findByDial("14165550100", COUNTRIES)?.country.iso).toBe("CA");
    expect(findByDial("14165550100", COUNTRIES, "US")?.country.iso).toBe("US");
    expect(findByDial("14165550100", COUNTRIES, "CA")?.country.iso).toBe("CA");
  });
  it("builds E.164, dropping one leading zero only when asked", () => {
    expect(toE164(tz, "712345678")).toBe("+255712345678");
    expect(toE164(tz, "0712345678")).toBe("+255712345678");
    expect(toE164(tz, "0712345678", false)).toBe("+2550712345678");
    expect(toE164(tz, "")).toBe("");
    expect(toE164(tz, "0")).toBe("");
  });
  it("checks only the length", () => {
    expect(isPlausible("+255712345678")).toBe(true);
    expect(isPlausible("+2557")).toBe(false);
    expect(isPlausible("+1234567890123456")).toBe(false);
    expect(isPlausible("")).toBe(false);
  });
});
