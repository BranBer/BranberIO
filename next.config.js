/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // NOTE: intentionally NO `env` block. Anything placed in Next's `env` is
  // inlined into the client bundle and shipped to every browser — so secrets
  // must never go there. The old `api_url` / `projects_per_page` keys were dead
  // config (nothing read them) and were removed. Server-only secrets (the
  // GitHub App credentials) are read via process.env directly in lib/github.ts.
  images: {
    domains: ["branberio.s3.us-east-2.amazonaws.com"],
  },
  eslint: { dirs: ["src"] },
  /**
   * SVGR webpack rule — scoped to design/assets/repo-diagrams/*.svg only.
   *
   * These architecture diagrams use `currentColor` for all structure lines so
   * they theme with the light/dark token system. They MUST be inlined as React
   * components (not <img src>), because `currentColor` is not inherited via
   * an img src — it only works when the SVG is part of the DOM.
   *
   * The rule is path-scoped (`/design\/assets\/repo-diagrams\/`) so it does NOT
   * affect any other SVG imports elsewhere in the project (public/ icons, etc.).
   * Other SVGs continue to be handled by Next.js's default static-file loader.
   */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      include: /design[\\/]assets[\\/]repo-diagrams/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: false,   // keep the hand-authored SVG structure intact
            titleProp: true,
            ref: true,
          },
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig;
