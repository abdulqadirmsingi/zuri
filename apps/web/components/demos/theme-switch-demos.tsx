"use client";

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
