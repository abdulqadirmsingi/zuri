import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

// The fonts pages share the docs layout, so the sidebar is always there to go back with.
export default function Layout({ children }: { children: ReactNode }) {
  return (
    // The sidebar tree already lists every page, so the header links are not copied into it again.
    <DocsLayout tree={source.getPageTree()} {...baseOptions()} links={[]}>
      {children}
    </DocsLayout>
  );
}
