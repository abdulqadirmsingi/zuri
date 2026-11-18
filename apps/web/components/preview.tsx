"use client";

import { type ReactNode, useId, useState } from "react";

const themes = ["light", "dark"] as const;
const widths = [
  ["Mobile", "22.5rem"],
  ["Tablet", "48rem"],
  ["Desktop", "100%"],
] as const;

const toggle =
  "min-h-8 rounded-md px-3 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-pressed:bg-primary aria-pressed:text-primary-foreground";

/**
 * Live preview frame. The theme toggle scopes light/dark tokens to the frame only.
 * The width toggle constrains the frame's width, but media queries still follow the real
 * viewport, so it previews container-driven layouts, not viewport breakpoints.
 */
export function Preview({ children }: { children: ReactNode }) {
  const id = useId();
  const [theme, setTheme] = useState<(typeof themes)[number]>("light");
  const [width, setWidth] = useState<string>("100%");

  return (
    <figure
      className="not-prose my-6 overflow-hidden rounded-lg border border-fd-border"
      aria-labelledby={id}
    >
      <figcaption id={id} className="sr-only">
        Live preview
      </figcaption>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-fd-border bg-fd-muted/50 p-2">
        <fieldset className="m-0 flex min-w-0 gap-1 border-0 p-0">
          <legend className="sr-only">Theme</legend>
          {themes.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={theme === t}
              onClick={() => setTheme(t)}
              className={toggle}
            >
              {t === "light" ? "Light" : "Dark"}
            </button>
          ))}
        </fieldset>
        <fieldset className="m-0 flex min-w-0 gap-1 border-0 p-0">
          <legend className="sr-only">Preview width</legend>
          {widths.map(([label, value]) => (
            <button
              key={label}
              type="button"
              aria-pressed={width === value}
              onClick={() => setWidth(value)}
              className={toggle}
            >
              {label}
            </button>
          ))}
        </fieldset>
      </div>
      <div className={`${theme} bg-background text-foreground`} data-preview-theme={theme}>
        <div
          className="mx-auto flex min-h-40 flex-wrap items-center justify-center gap-3 p-6"
          style={{ maxWidth: width }}
        >
          {children}
        </div>
      </div>
    </figure>
  );
}
