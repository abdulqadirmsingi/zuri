"use client";

import { useTheme } from "next-themes";
import {
  type CSSProperties,
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

export const DEFAULT_HUE = 60;
/** The default `--radius-md`, in pixels. */
export const DEFAULT_RADIUS = 10;

const norm = (h: number) => ((Math.round(h) % 360) + 360) % 360;

interface Lab {
  hue: number;
  radius: number;
  setHue: (n: number) => void;
  setRadius: (n: number) => void;
  /** The CSS a project would paste to get the theme currently shown. */
  css: string;
}

const Ctx = createContext<Lab | null>(null);

export function useThemeLab(): Lab {
  const lab = useContext(Ctx);
  if (!lab) throw new Error("useThemeLab must be used inside <ThemeLab>");
  return lab;
}

/**
 * Wraps part of the page and lets controls inside it re-theme all of it. It only sets CSS
 * variables on a wrapper: the same tokens a real project would override. Nothing is stored and
 * nothing is sent anywhere.
 */
export function ThemeLab({ children }: { children: ReactNode }) {
  const [hue, setHue] = useState(DEFAULT_HUE);
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  const css = useMemo(() => {
    const h = norm(hue);
    const f = radius / DEFAULT_RADIUS;
    const rem = (n: number) => `${+(n * f).toFixed(3)}rem`;
    return [
      ":root {",
      `  --accent: oklch(0.76 0.16 ${h});`,
      `  --accent-ink: oklch(0.52 0.14 ${norm(h - 10)});`,
      `  --radius-sm: ${rem(0.375)};`,
      `  --radius-md: ${rem(0.625)};`,
      `  --radius-lg: ${rem(1)};`,
      "}",
    ].join("\n");
  }, [hue, radius]);

  const style: Record<string, string> = {};
  if (hue !== DEFAULT_HUE) {
    const h = norm(hue);
    // Dark mode uses the lighter pair from tokens.css, so accent text stays readable on black.
    style["--accent"] = dark ? `oklch(0.78 0.15 ${norm(h + 2)})` : `oklch(0.76 0.16 ${h})`;
    style["--accent-ink"] = dark
      ? `oklch(0.8 0.14 ${norm(h + 2)})`
      : `oklch(0.52 0.14 ${norm(h - 10)})`;
  }
  if (radius !== DEFAULT_RADIUS) {
    const f = radius / DEFAULT_RADIUS;
    style["--radius-sm"] = `${0.375 * f}rem`;
    style["--radius-md"] = `${0.625 * f}rem`;
    style["--radius-lg"] = `${1 * f}rem`;
  }

  const lab = useMemo<Lab>(() => ({ hue, radius, setHue, setRadius, css }), [hue, radius, css]);
  return (
    <Ctx.Provider value={lab}>
      <div style={style as CSSProperties}>{children}</div>
    </Ctx.Provider>
  );
}
