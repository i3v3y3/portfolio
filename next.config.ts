import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    // Required by output:"export" — there is no server to resize on request.
    // scripts/optimize-images.mjs handles resizing at build time instead.
    unoptimized: true,
  },
};

export default nextConfig;
