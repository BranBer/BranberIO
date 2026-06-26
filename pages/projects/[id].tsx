import React from "react";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { GetStaticPaths, GetStaticProps } from "next";
import projectsData from "../../data/projects";
import Project from "../../types/project";
import NavBar from "../../components/navBar";
import Carousel from "../../components/carousel";
import { motion, useReducedMotion } from "framer-motion";
import type { LanguageSlice } from "../../types/github";

/**
 * Project detail page — branber.io
 * Spec: design/02-2-visual-redesign-spec.md §4.5
 *
 * Rhythm:
 *  1. Header — back-link, title, tag chips, action buttons
 *  2. Carousel — glass frame (tier-1)
 *  3. Case-study body — glass-strong (tier-2, body copy §3.2)
 *  4. Languages chart — own glass panel (tier-1)
 *  5. Footer nav
 *
 * Story 3.6: languages data fetched server-side in getStaticProps via a plain
 * unauthenticated fetch to the public GitHub languages endpoint. The projects
 * here (BranBer/AirPnP, pronto-portal/pronto-infrastructure) are public repos
 * under other owners — NOT in the Cipher-Codex App installation. We use a plain
 * server-side fetch (avoids client rate-limit; public repos need no auth).
 * If the fetch fails, we degrade gracefully (omit chart).
 */

/* ── Dynamic import: LanguagesPieChart is client-only (no SSR) ──────────── */
const LanguagesPieChart = dynamic(
  () => import("../../components/languagesPieChart"),
  { ssr: false }
);

/* ── Framer-motion variants ──────────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

/* ── Inline icons ────────────────────────────────────────────────────────── */
const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

/* ── Tag chip (flat, no nested blur) ────────────────────────────────────── */
const TagChip: React.FC<{ label: string }> = ({ label }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "0.2rem 0.6rem",
      borderRadius: "var(--radius-pill)",
      background: "var(--glass-bg-chip)",
      border: "1px solid var(--glass-border)",
      fontSize: "var(--text-xs)",
      fontWeight: 500,
      color: "var(--fg-muted)",
    }}
  >
    {label}
  </span>
);

/* ── Section heading within the case-study body ─────────────────────────── */
const CaseHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2
    style={{
      margin: "0 0 0.75rem",
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-h3)",
      fontWeight: 600,
      color: "var(--fg)",
    }}
  >
    {children}
  </h2>
);

/* ── Page component ──────────────────────────────────────────────────────── */
interface ProjectDetailProps {
  project: Project;
  /** Pre-computed language slices from server-side fetch. Null if fetch failed. */
  languageSlices: LanguageSlice[] | null;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, languageSlices }) => {
  const shouldReduceMotion = useReducedMotion();

  const containerMotion = shouldReduceMotion
    ? {}
    : { variants: containerVariants, initial: "hidden", animate: "visible" };

  const itemMotion = shouldReduceMotion ? {} : { variants: itemVariants };

  /* Repo is primary unless a live site exists (§4.5 spec) */
  const hasLiveSite = Boolean(project.projectLink);
  const hasRepo = Boolean(project.repo?.link);

  const primaryAction = hasLiveSite
    ? { href: project.projectLink, label: "Visit Site", icon: <GlobeIcon /> }
    : hasRepo
    ? { href: project.repo.link, label: "Visit Repo", icon: <GitHubIcon /> }
    : null;

  const secondaryAction =
    hasLiveSite && hasRepo
      ? { href: project.repo.link, label: "Visit Repo", icon: <GitHubIcon /> }
      : null;

  return (
    <>
      <Head>
        <title>{project.name} — Brandon Berke</title>
        <meta name="description" content={project.tagline ?? project.description} />
      </Head>

      <NavBar />

      <main
        style={{
          paddingTop: "6rem",
          paddingBottom: "var(--space-section)",
          minHeight: "100vh",
          fontFamily: "var(--font-sans)",
          color: "var(--fg)",
          width: "100%",
          maxWidth: "var(--container)",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "var(--gutter)",
          paddingRight: "var(--gutter)",
        }}
      >
        <motion.div
          {...containerMotion}
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-block)" }}
        >

          {/* ── 1. HEADER (§4.5 step 1) ─────────────────────────────── */}
          <motion.header {...itemMotion}>
            {/* Back link */}
            <Link
              href="/projects"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                fontSize: "var(--text-sm)",
                color: "var(--fg-muted)",
                textDecoration: "none",
                marginBottom: "1.25rem",
                transition: "color 150ms ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "var(--fg)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "var(--fg-muted)")
              }
            >
              <ArrowLeftIcon />
              Back to projects
            </Link>

            {/* Title */}
            <h1
              style={{
                margin: "0 0 0.75rem",
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-h1)",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: "var(--fg)",
                lineHeight: 1.15,
              }}
            >
              {project.name}
            </h1>

            {/* Tag chips */}
            {project.tags && project.tags.length > 0 && (
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "1.25rem" }}
                aria-label="Tags"
              >
                {project.tags.map((tag) => (
                  <TagChip key={tag} label={tag} />
                ))}
              </div>
            )}

            {/* Action buttons */}
            {(primaryAction || secondaryAction) && (
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {primaryAction && (
                  <a
                    href={primaryAction.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.625rem 1.25rem",
                      borderRadius: "var(--radius-pill)",
                      background: "var(--accent)",
                      color: "var(--accent-fg)",
                      fontWeight: 600,
                      fontSize: "var(--text-sm)",
                      textDecoration: "none",
                      transition: "background 120ms ease",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.background = "var(--accent-hover)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.background = "var(--accent)")
                    }
                  >
                    {primaryAction.icon}
                    {primaryAction.label}
                  </a>
                )}
                {secondaryAction && (
                  <a
                    href={secondaryAction.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.625rem 1.25rem",
                      borderRadius: "var(--radius-pill)",
                      background: "transparent",
                      color: "var(--fg)",
                      fontWeight: 500,
                      fontSize: "var(--text-sm)",
                      textDecoration: "none",
                      border: "1px solid var(--glass-border)",
                      transition: "border-color 120ms ease, color 120ms ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)";
                      (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--glass-border)";
                      (e.currentTarget as HTMLAnchorElement).style.color = "var(--fg)";
                    }}
                  >
                    {secondaryAction.icon}
                    {secondaryAction.label}
                  </a>
                )}
              </div>
            )}
          </motion.header>

          {/* ── 2. CAROUSEL in glass frame (§4.5 step 2) ─────────────── */}
          {project.images && project.images.length > 0 && (
            <motion.div {...itemMotion}>
              <Carousel
                images={project.images}
                captions={project.imageCaptions}
              />
            </motion.div>
          )}

          {/* ── 3. CASE-STUDY BODY — glass-strong (§4.5 step 3) ─────── */}
          <motion.section
            {...itemMotion}
            aria-labelledby="case-study-heading"
            className="glass-strong"
            style={{
              padding: "clamp(1.5rem, 3vw, 2.5rem)",
              borderRadius: "var(--radius-xl)",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
            <h2
              id="case-study-heading"
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-h2)",
                fontWeight: 700,
                color: "var(--fg)",
                letterSpacing: "-0.01em",
              }}
            >
              Case study
            </h2>

            {/* Context / framing */}
            {project.context && (
              <div>
                <CaseHeading>Context</CaseHeading>
                <p
                  style={{
                    margin: 0,
                    fontSize: "var(--text-body)",
                    lineHeight: 1.65,
                    color: "var(--fg-muted)",
                    maxWidth: "var(--measure)",
                  }}
                >
                  {project.context}
                </p>
              </div>
            )}

            {/* Role */}
            {project.role && (
              <div>
                <CaseHeading>My role</CaseHeading>
                <p
                  style={{
                    margin: 0,
                    fontSize: "var(--text-body)",
                    lineHeight: 1.65,
                    color: "var(--fg-muted)",
                    maxWidth: "var(--measure)",
                  }}
                >
                  {project.role}
                </p>
              </div>
            )}

            {/* Problem */}
            {project.problem && (
              <div>
                <CaseHeading>The problem</CaseHeading>
                <p
                  style={{
                    margin: 0,
                    fontSize: "var(--text-body)",
                    lineHeight: 1.65,
                    color: "var(--fg-muted)",
                    maxWidth: "var(--measure)",
                  }}
                >
                  {project.problem}
                </p>
              </div>
            )}

            {/* Solution / what was built */}
            {project.solution && (
              <div>
                <CaseHeading>What I built</CaseHeading>
                <p
                  style={{
                    margin: 0,
                    fontSize: "var(--text-body)",
                    lineHeight: 1.65,
                    color: "var(--fg-muted)",
                    maxWidth: "var(--measure)",
                  }}
                >
                  {project.solution}
                </p>
              </div>
            )}

            {/* Fallback description if no structured fields */}
            {!project.problem && !project.solution && project.description && (
              <div>
                <CaseHeading>About</CaseHeading>
                <p
                  style={{
                    margin: 0,
                    fontSize: "var(--text-body)",
                    lineHeight: 1.65,
                    color: "var(--fg-muted)",
                    maxWidth: "var(--measure)",
                  }}
                >
                  {project.description}
                </p>
              </div>
            )}

            {/* Stack */}
            {project.stack && project.stack.length > 0 && (
              <div>
                <CaseHeading>Stack</CaseHeading>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}
                  aria-label="Stack technologies"
                >
                  {project.stack.map((tech) => (
                    <TagChip key={tech} label={tech} />
                  ))}
                </div>
              </div>
            )}

            {/* Impact — only render when non-empty (Air PnP has empty impact[]) */}
            {project.impact && project.impact.length > 0 && (
              <div>
                <CaseHeading>Impact</CaseHeading>
                <ul
                  className="content-list"
                  style={{
                    margin: 0,
                    paddingLeft: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {project.impact.map((item, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: "var(--text-body)",
                        lineHeight: 1.65,
                        color: "var(--fg-muted)",
                        maxWidth: "var(--measure)",
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.section>

          {/* ── 4. LANGUAGES CHART in glass panel (§4.5 step 4) ─────── */}
          {/* Only rendered when language data is available (graceful degradation). */}
          {languageSlices !== null && (
            <motion.section
              {...itemMotion}
              aria-labelledby="languages-heading"
              className="glass"
              style={{
                padding: "clamp(1.5rem, 3vw, 2rem)",
                borderRadius: "var(--radius-xl)",
              }}
            >
              <h2
                id="languages-heading"
                style={{
                  margin: "0 0 1rem",
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-h3)",
                  fontWeight: 600,
                  color: "var(--fg)",
                }}
              >
                Repository languages
              </h2>
              {/* Story 3.6: slices arrive from getStaticProps — no client fetch */}
              <LanguagesPieChart slices={languageSlices} />
            </motion.section>
          )}

          {/* ── 5. FOOTER NAV (§4.5 step 5) ─────────────────────────── */}
          <motion.div {...itemMotion} style={{ paddingTop: "0.5rem" }}>
            <Link
              href="/projects"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.625rem 1.25rem",
                borderRadius: "var(--radius-pill)",
                background: "transparent",
                color: "var(--fg-muted)",
                fontWeight: 500,
                fontSize: "var(--text-sm)",
                textDecoration: "none",
                border: "1px solid var(--glass-border)",
                transition: "border-color 120ms ease, color 120ms ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--glass-border)";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--fg-muted)";
              }}
            >
              <ArrowLeftIcon />
              Back to projects
            </Link>
          </motion.div>

        </motion.div>
      </main>
    </>
  );
};

/* ── Static generation ───────────────────────────────────────────────────── */
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = projectsData.map((p) => ({ params: { id: p.id } }));
  return { paths, fallback: false };
};

/**
 * Fetches language data server-side for public repos under other owners.
 * Uses plain unauthenticated fetch — these repos (BranBer/AirPnP,
 * pronto-portal/pronto-infrastructure) are public and NOT in the Cipher-Codex
 * App installation, so the App token must NOT be used here.
 * Fails gracefully: if the fetch fails, languageSlices is null and the chart
 * section is omitted rather than breaking the page.
 */
async function fetchPublicRepoLanguages(
  owner: string,
  repo: string
): Promise<LanguageSlice[] | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (!res.ok) {
      console.warn(
        `[projects/[id]] Language fetch failed for ${owner}/${repo}: HTTP ${res.status}`
      );
      return null;
    }

    const data = (await res.json()) as Record<string, number>;
    const entries = Object.entries(data);
    const totalBytes = entries.reduce((sum, [, bytes]) => sum + bytes, 0);

    if (totalBytes === 0) return [];

    return entries.map(([name, bytes]) => ({
      name,
      bytes,
      percent: Math.round((bytes / totalBytes) * 1000) / 10,
    }));
  } catch (err) {
    console.warn(
      `[projects/[id]] Language fetch threw for ${owner}/${repo}:`,
      err
    );
    return null;
  }
}

export const getStaticProps: GetStaticProps<ProjectDetailProps> = async ({ params }) => {
  const id = params?.id as string;
  const project = projectsData.find((p) => p.id === id);

  if (!project) {
    return { notFound: true };
  }

  // Fetch language data server-side to avoid client-side GitHub rate limits.
  // Plain unauthenticated fetch — these are public repos under other owners.
  const languageSlices = await fetchPublicRepoLanguages(
    project.repo.owner,
    project.repo.repo
  );

  return {
    props: { project, languageSlices },
    revalidate: 3600,
  };
};

export default ProjectDetail;
