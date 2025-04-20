import type { NextConfig } from "next";
const isExport = process.env.NEXT_PUBLIC_IS_EXPORT === "true";
const basePath = "/core-keeper-collection-tracker";

const nextConfig: NextConfig = {
  basePath: isExport ? "/core-keeper-collection-tracker" : "",
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
