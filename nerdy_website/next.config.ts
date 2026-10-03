import type { NextConfig } from "next";

/**
 * ⚙️  STATIC SITE GENERATION — GitHub Pages Ready
 * --------------------------------------------------
 * - `output: "export"`       → produces a fully static `out/` directory
 * - `images.unoptimized`     → no Node.js image optimizer on GitHub Pages
 * - `trailingSlash: true`    → GitHub Pages serves `/path/` → `/path/index.html`
 * - `basePath`               → auto-detected from DEPLOY_URL repo name
 *
 * When deploying to a project page (https://user.github.io/<repo>),
 * set NEXT_PUBLIC_BASE_PATH=/repo-name via the workflow env, or hardcode below.
 */
const repo = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // basePath + assetPrefix must BOTH be set when deploying to a subpath.
  basePath: repo,
  assetPrefix: repo ? `${repo}/` : "",
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  // Allow preview domain to access dev server during dev.
  allowedDevOrigins: ["*.space-z.ai"],
};

export default nextConfig;
