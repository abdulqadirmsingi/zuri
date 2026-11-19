import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { LogoMark } from "@/components/logo-mark";
import { appName, gitConfig } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2 font-display font-semibold tracking-tight">
          <LogoMark className="size-6" />
          {appName}
        </span>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      { text: "Docs", url: "/docs" },
      { text: "Components", url: "/docs/components" },
      { text: "Fonts", url: "/fonts" },
    ],
  };
}
