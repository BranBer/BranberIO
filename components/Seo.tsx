import Head from "next/head";
import React from "react";

const BASE_URL = "https://www.branber.io";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;
const SITE_NAME = "Brandon Berke";

interface SeoProps {
  /** Page title — written as-is into <title>. Include " — Brandon Berke" suffix yourself. */
  title: string;
  /** One-line meta description (recommended 120–160 chars). */
  description: string;
  /**
   * Path from the root, e.g. "/" or "/about".
   * Used to build the canonical URL: https://www.branber.io{path}
   */
  path: string;
  /** Optional override for og:image. Defaults to /og-image.png (1200x630). */
  ogImage?: string;
  /** og:type — defaults to "website". Use "article" for deep-dive content pages. */
  type?: "website" | "article";
}

/**
 * Reusable SEO head component.
 *
 * Renders: <title>, meta description, canonical, OpenGraph (og:title /
 * description / url / type / image / site_name) and Twitter card
 * (summary_large_image) tags.
 *
 * Usage:
 *   <Seo
 *     title="About — Brandon Berke"
 *     description="Full-stack developer…"
 *     path="/about"
 *   />
 *
 * Privacy note: this component does NOT render any employer/worksFor data.
 */
const Seo: React.FC<SeoProps> = ({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  type = "website",
}) => {
  const canonicalUrl = `${BASE_URL}${path}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* OpenGraph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
};

export default Seo;
