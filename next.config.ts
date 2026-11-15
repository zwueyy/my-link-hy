import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const BASE_PATH = "/my-link-hy";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages (build output: ./out, copied to ./docs)
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(isProd ? { basePath: BASE_PATH, assetPrefix: BASE_PATH } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: isProd ? BASE_PATH : "" },
};

export default nextConfig;
