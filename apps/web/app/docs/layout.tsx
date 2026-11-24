import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { CircleHelp } from "lucide-react";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    // The sidebar tree already lists every page, so the header links are not copied into it again.
    // FAQ lives as a "?" icon beside the theme switch instead of in the page list.
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      links={[{ type: "icon", icon: <CircleHelp />, text: "FAQ", label: "FAQ", url: "/docs/faq" }]}
    >
      {children}
    </DocsLayout>
  );
}
