/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // WARNING: Every key listed in the `env` block below is inlined verbatim
  // into the client-side JavaScript bundle at build time and shipped to every
  // browser — regardless of the variable name (no NEXT_PUBLIC_ prefix needed).
  // This means NO secrets (e.g. GITHUB_TOKEN, API keys, OAuth secrets) may
  // ever be added here. Client-safe values only (public URLs, display prefs).
  env: {
    projects_per_page: process.env.projects_per_page,
    api_url: process.env.api_url,
  },
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
