"use client";

import { CopyButton } from "@registry/actions/copy-button/copy-button";
import { useTheme } from "next-themes";
import {
  type CSSProperties,
  createContext,
  type ReactNode,
  useContext,
  useId,
  useMemo,
  useState,
} from "react";

const DEFAULT_HUE = 60;
/** The default `--radius-md`, in pixels. */
const DEFAULT_RADIUS = 10;

const norm = (h: number) => ((Math.round(h) % 360) + 360) % 360;

interface Lab {
  hue: number;
  radius: number;
  setHue: (n: number) => void;
  setRadius: (n: number) => void;
  reset: () => void;
  css: string;
}

const Ctx = createContext<Lab | null>(null);

function useLab(): Lab {
  const lab = useContext(Ctx);
  if (!lab) throw new Error("Theme lab controls must be inside <ThemeLab>");
  return lab;
}

/**
 * Wraps part of the page and lets visitors re-theme it. It only sets CSS variables on a wrapper,
 * the same tokens a real project would override, so what you see is what you would paste into
 * your own stylesheet. Nothing is stored and nothing is sent anywhere.
 */
export function ThemeLab({ children }: { children: ReactNode }) {
  const [hue, setHue] = useState(DEFAULT_HUE);
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  const lab = useMemo<Lab>(() => {
    const h = norm(hue);
    const f = radius / DEFAULT_RADIUS;
    const rem = (n: number) => `${+(n * f).toFixed(3)}rem`;
    const css = [
      ":root {",
      `  --accent: oklch(0.76 0.16 ${h});`,
      `  --accent-ink: oklch(0.52 0.14 ${norm(h - 10)});`,
      `  --radius-sm: ${rem(0.375)};`,
      `  --radius-md: ${rem(0.625)};`,
      `  --radius-lg: ${rem(1)};`,
      "}",
    ].join("\n");
    return {
      hue,
      radius,
      setHue,
      setRadius,
      reset: () => {
        setHue(DEFAULT_HUE);
        setRadius(DEFAULT_RADIUS);
      },
      css,
    };
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

  return (
    <Ctx.Provider value={lab}>
      <div style={style as CSSProperties}>
        {children}
        <LabDock />
      </div>
    </Ctx.Provider>
  );
}

const spectrum = `linear-gradient(to right, ${Array.from(
  { length: 13 },
  (_, i) => `oklch(0.76 0.16 ${i * 30})`,
).join(", ")})`;

/** The floating controls. `sticky` keeps it at the bottom of the screen while the lab is in view. */
function LabDock() {
  const { hue, radius, setHue, setRadius, reset } = useLab();
  const hueId = useId();
  const radiusId = useId();
  return (
    <div className="pointer-events-none sticky bottom-4 z-[var(--z-sticky)] flex justify-center px-4">
      <fieldset className="pointer-events-auto m-0 flex w-full max-w-3xl min-w-0 flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-5 rounded-2xl border border-border bg-background px-4 py-2.5 shadow-lg sm:px-5 sm:py-3">
        <legend className="sr-only">Theme controls for this page</legend>
        <p className="m-0 hidden font-mono text-xs uppercase tracking-wider text-muted-foreground md:block">
          Tune this page
        </p>
        <div className="flex min-w-[6.5rem] flex-1 flex-col gap-1.5">
          <label htmlFor={hueId} className="font-mono text-xs uppercase tracking-wider">
            Accent <span className="text-muted-foreground">{norm(hue)}°</span>
          </label>
          <input
            id={hueId}
            type="range"
            min={0}
            max={360}
            value={hue}
            aria-valuetext={`Hue ${norm(hue)} degrees`}
            onChange={(e) => setHue(Number(e.target.value))}
            className="zuri-range w-full"
            style={{ backgroundImage: spectrum }}
          />
        </div>
        <div className="flex min-w-[6.5rem] flex-1 flex-col gap-1.5">
          <label htmlFor={radiusId} className="font-mono text-xs uppercase tracking-wider">
            Roundness <span className="text-muted-foreground">{radius}px</span>
          </label>
          <input
            id={radiusId}
            type="range"
            min={0}
            max={20}
            value={radius}
            aria-valuetext={`${radius} pixels`}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="zuri-range w-full"
          />
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-8 items-center rounded-md px-3 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Reset
        </button>
      </fieldset>
    </div>
  );
}

/** The CSS a project would paste to get the theme currently shown. Updates live. */
export function LabCode() {
  const { css } = useLab();
  return (
    <div className="relative rounded-xl border border-border bg-muted">
      <div className="flex items-center justify-between border-b border-border py-1 ps-4 pe-1">
        <p className="m-0 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          globals.css
        </p>
        <CopyButton value={css} iconOnly label="Copy CSS" variant="ghost" size="sm" />
      </div>
      <pre className="m-0 whitespace-pre-wrap px-4 py-3 font-mono text-sm leading-relaxed">
        <code>{css}</code>
      </pre>
    </div>
  );
}
