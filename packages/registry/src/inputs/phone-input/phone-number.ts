import type { Country } from "./countries";

/** E.164 allows at most 15 digits in total, country code included. */
export const MAX_DIGITS = 15;
/** Below this a number cannot be a complete international number. */
export const MIN_DIGITS = 8;

export const digitsOf = (text: string) => text.replace(/\D/g, "");

/** "7123456789" becomes "712 345 678 9". A plain grouping for readability, not a national format. */
export const groupDigits = (digits: string) => digits.replace(/(\d{3})(?=\d)/g, "$1 ");

/**
 * Finds the country whose dialling code starts these digits, preferring the longest code. Where a
 * code is shared (+1), `prefer` wins if it uses that code, otherwise the first in the list.
 */
export function findByDial(
  digits: string,
  countries: readonly Country[],
  prefer?: string,
): { country: Country; national: string } | null {
  let best: Country | undefined;
  for (const c of countries) {
    if (!digits.startsWith(c.dial)) continue;
    if (!best || c.dial.length > best.dial.length) best = c;
    else if (c.dial.length === best.dial.length && c.iso === prefer) best = c;
  }
  return best ? { country: best, national: digits.slice(best.dial.length) } : null;
}

/**
 * The international form, such as "+255712345678", or "" while no number has been typed. A single
 * leading zero is dropped when `stripLeadingZero` is set, because in many countries it is only
 * used when dialling inside the country.
 */
export function toE164(country: Country, national: string, stripLeadingZero = true): string {
  const n = stripLeadingZero ? national.replace(/^0/, "") : national;
  return n ? `+${country.dial}${n}` : "";
}

/** A length check only (8 to 15 digits). It cannot tell whether a number really exists. */
export function isPlausible(e164: string): boolean {
  const length = digitsOf(e164).length;
  return length >= MIN_DIGITS && length <= MAX_DIGITS;
}

/**
 * The flag emoji for an ISO 3166-1 alpha-2 code ("TZ" becomes 🇹🇿). It is plain text, made from two
 * regional-indicator letters, so it needs no image and no request. Systems without flag artwork
 * (Windows) show the two letters in boxes instead, which still reads as the country code.
 */
export function flagEmoji(iso: string): string {
  const code = iso.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return "";
  return String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}
