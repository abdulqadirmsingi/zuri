// The default GitHub Shiki themes fail WCAG AA (red keywords 4.08:1 in light, grey comments
// 3.75:1 in dark; found by scripts/a11y.mjs). The high-contrast variants pass.
export const codeThemes = {
  light: "github-light-high-contrast",
  dark: "github-dark-high-contrast",
} as const;
