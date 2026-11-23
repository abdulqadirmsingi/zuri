"use client";

import { Button } from "@registry/actions/button/button";
import { ThemeSwitch, type ThemeTransition } from "@registry/actions/theme-switch/theme-switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Wires the switch to the site's real theme (next-themes), so pressing it changes this whole
 * docs page. Until the page has loaded the saved theme is unknown, so it starts as light.
 */
function useSiteTheme() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return {
    theme: mounted && resolvedTheme === "dark" ? ("dark" as const) : ("light" as const),
    setTheme,
  };
}

export function ThemeSwitchStyles() {
  const { theme, setTheme } = useSiteTheme();
  const styles: { transition: ThemeTransition; name: string }[] = [
    { transition: "circle", name: "Circle" },
    { transition: "wipe", name: "Wipe" },
    { transition: "curtain", name: "Curtain" },
    { transition: "diagonal", name: "Diagonal" },
    { transition: "fade", name: "Fade" },
    { transition: "none", name: "None" },
  ];
  return (
    <div className="flex flex-wrap items-end justify-center gap-6">
      {styles.map((s) => (
        <div key={s.transition} className="flex flex-col items-center gap-2">
          <ThemeSwitch
            theme={theme}
            onThemeChange={setTheme}
            transition={s.transition}
            label={`Dark mode, ${s.name.toLowerCase()} transition`}
          />
          <span className="text-xs text-muted-foreground">{s.name}</span>
        </div>
      ))}
    </div>
  );
}

export function ThemeSwitchLabelled() {
  const { theme, setTheme } = useSiteTheme();
  return <ThemeSwitch showLabel theme={theme} onThemeChange={setTheme} label="Dark mode" />;
}

export function ThemeSwitchLooks() {
  const { theme, setTheme } = useSiteTheme();
  const common = { theme, onThemeChange: setTheme } as const;
  return (
    <>
      <ThemeSwitch {...common} variant="ghost" label="Dark mode, ghost" />
      <ThemeSwitch {...common} variant="accent" shape="pill" label="Dark mode, accent" />
      <ThemeSwitch {...common} variant="brutal" label="Dark mode, brutal" />
      <ThemeSwitch {...common} variant="soft" shape="pill" size="lg" label="Dark mode, soft" />
    </>
  );
}

const choices = [
  { value: "light", label: "Light" },
  { value: "system", label: "System" },
  { value: "dark", label: "Dark" },
] as const;

/** A three-way choice, which a two-state switch cannot give. It applies the theme with next-themes. */
export function ThemeSegmented() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = mounted ? theme : undefined;
  return (
    <fieldset className="m-0 inline-flex gap-1 rounded-full border border-border bg-muted p-1">
      <legend className="sr-only">Theme</legend>
      {choices.map((c) => (
        <Button
          key={c.value}
          shape="pill"
          size="sm"
          variant={current === c.value ? "default" : "ghost"}
          aria-pressed={current === c.value}
          onClick={() => setTheme(c.value)}
        >
          {c.label}
        </Button>
      ))}
    </fieldset>
  );
}
