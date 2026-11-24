import type { FontEntry } from "./fonts-catalog";

/** What the tester shows until someone types their own text. */
export const DEFAULT_PREVIEW = "Send money in seconds";
export const MAX_PREVIEW_LENGTH = 120;

export const SIZE_RANGE = { min: 16, max: 96, step: 1, initial: 56 } as const;
export const WEIGHT_RANGE = { min: 100, max: 900, step: 50, initial: 500 } as const;

/** The text to set in each specimen: what was typed, trimmed and capped, or the default. */
export function previewText(typed: string): string {
  const text = typed.trim().slice(0, MAX_PREVIEW_LENGTH);
  return text === "" ? DEFAULT_PREVIEW : text;
}

/**
 * The weight to use for a font. A font only has weights inside its own range (Instrument Sans
 * runs 400 to 700), so a wish for 900 gets the closest weight the font really has instead of the
 * browser silently faking bold.
 */
export function clampWeight(font: FontEntry, wanted: number): number {
  return Math.min(Math.max(wanted, font.weights.min), font.weights.max);
}

/** Every character set a visitor might want to check, in the order they are shown. */
export const glyphRows = [
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "abcdefghijklmnopqrstuvwxyz",
  "0123456789 .,;:!?@#&%$€£",
] as const;

/** The weights a font really has, in steps of 100, for the weight ladder. */
export function weightSteps(font: FontEntry): number[] {
  const first = Math.ceil(font.weights.min / 100) * 100;
  const steps: number[] = [];
  for (let w = first; w <= font.weights.max; w += 100) steps.push(w);
  return steps.length > 0 ? steps : [font.weights.min];
}

const weightNames: Record<number, string> = {
  100: "Thin",
  200: "Extra Light",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "Semi Bold",
  700: "Bold",
  800: "Extra Bold",
  900: "Black",
};

/** The usual name for a weight, e.g. 700 is "Bold". Falls back to the number. */
export function weightName(weight: number): string {
  return weightNames[weight] ?? String(weight);
}
