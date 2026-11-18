import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const config: NextConfig = {
  transpilePackages: ["@zuri/utils"],
  poweredByHeader: false,
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: "/docs/:path*.md", destination: "/llms.mdx/docs/:path*.md" },
      { source: "/docs/:path*.txt", destination: "/llms.mdx/docs/:path*.txt" },
    ];
  },
};

export default withMDX(config);
