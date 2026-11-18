import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { appName, gitConfig } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: { title: <span className="font-display font-semibold tracking-tight">{appName}</span> },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      { text: "Docs", url: "/docs" },
      { text: "Components", url: "/docs/components" },
      { text: "Fonts", url: "/fonts" },
    ],
  };
}
