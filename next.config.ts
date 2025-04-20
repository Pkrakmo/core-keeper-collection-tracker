import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/core-keeper-collection-tracker",
  output: "export",  // <=== enables static exports
  reactStrictMode: true,
};

export default nextConfig;
