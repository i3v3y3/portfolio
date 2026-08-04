import type { NextConfig } from "next";

// GitHub Pages project sites live at /<repo>. A custom domain lives at the
// root. NEXT_PUBLIC_BASE_PATH is the single switch between the two — set it in
// CI for Pages, leave it unset for local dev and for a custom domain.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    // Required by output:"export" — there is no server to resize on request.
    // scripts/optimize-images.mjs handles resizing at build time instead.
    unoptimized: true,
  },
};

export default nextConfig;
