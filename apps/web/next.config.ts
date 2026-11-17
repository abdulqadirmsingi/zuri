import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: ["@zuri/utils"],
  poweredByHeader: false,
};

export default config;
