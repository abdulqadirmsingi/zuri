import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";
import { type NextRequest, NextResponse } from "next/server";
import { docsRoute } from "@/lib/shared";

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `/llms.mdx${docsRoute}{/*path}.md`,
);

// Agents that send `Accept: text/markdown` get the page as markdown.
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const result =
    isMarkdownPreferred(request) && !/\.(md|txt)$/.test(pathname) && rewriteDocs(pathname);
  if (result) {
    return NextResponse.rewrite(new URL(result, request.nextUrl), { headers: { Vary: "Accept" } });
  }
  return NextResponse.next();
}

// Docs only: never run on /r (counted installs) or /api.
export const config = { matcher: ["/docs/:path*"] };
