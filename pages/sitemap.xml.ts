/**
 * Dynamic sitemap served at /sitemap.xml.
 *
 * Covers all indexable routes:
 *   - Static pages: /, /about, /skills, /projects
 *   - Case-study pages: /projects/airpnp, /projects/pronto-portal
 *   - Deep-dive pages: /projects/repo/<slug> for each of the 9 SHOWCASE_SLUGS
 *
 * The 9 deep-dive slugs are pulled from data/showcaseDetails so this file
 * stays in sync automatically when new repos are added to the showcase.
 *
 * Uses getServerSideProps so it runs on demand (no stale static file to update).
 * The XML is served with the correct Content-Type header via res.setHeader.
 */

import type { GetServerSideProps } from "next";
import { SHOWCASE_SLUGS } from "../data/showcaseDetails";

const BASE_URL = "https://www.branber.io";

function buildSitemapXml(urls: string[]): string {
  const urlEntries = urls
    .map(
      (url) => `  <url>
    <loc>${url}</loc>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

// Static page paths
const STATIC_PATHS = ["/", "/about", "/skills", "/projects"];

// Case-study paths (project [id] pages)
const CASE_STUDY_PATHS = ["/projects/airpnp", "/projects/pronto-portal"];

// This component is never rendered — getServerSideProps writes the response directly.
export default function SitemapXml() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const deepDivePaths = SHOWCASE_SLUGS.map(
    (slug) => `/projects/repo/${slug}`
  );

  const allPaths = [...STATIC_PATHS, ...CASE_STUDY_PATHS, ...deepDivePaths];
  const allUrls = allPaths.map((path) => `${BASE_URL}${path}`);

  const xml = buildSitemapXml(allUrls);

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=3600"
  );
  res.write(xml);
  res.end();

  return { props: {} };
};
