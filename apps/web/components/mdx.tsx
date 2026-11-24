import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Demo } from "./demos";
import { InstallTabs } from "./install-tabs";
import { Preview } from "./preview";
import { PropsTable } from "./props-table";
import { Source } from "./source";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Demo,
    InstallTabs,
    Preview,
    PropsTable,
    Source,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
