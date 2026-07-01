import React from "react";
import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import Seo from "../components/Seo";
import NavBar from "../components/navBar";
import projectsData from "../data/projects";
import RepoCard from "../components/repoCard";
import Project from "../types/project";
import type { RepoCard as RepoCardType } from "../types/github";
import { motion, useReducedMotion } from "framer-motion";

/* ── MMA Almanac system repos (for the callout in the showcase section) ── */
const MMA_SYSTEM_SLUGS = [
  "mma-almanac-scrapers",
  "mma-almanac-ai",
  "mma-almanac-ui",
  "mma-almanac-aws",
] as const;

/**
 * Projects index — branber.io
 * Spec: design/02-2-visual-redesign-spec.md §4.4
 *
 * Rhythm: intro line → asymmetric grid (featured card wider, secondary narrower).
 * Status badges: --fg-muted NOT accent (see §4.6 "Private" badge convention).
 * Stack chips: flat background + border, no nested backdrop-filter (§2.6 / §3.3).
 *
 * Story 3.5: adds a "From my GitHub" section below the case-study grid, populated
 * by getCipherCodexRepoCards() via getStaticProps (ISR revalidate: 3600).
 * Per ADR 0001: on fetch failure getStaticProps throws so ISR serves last good page.
 */

/* ── Framer-motion variants ───────────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

/* ── Status badge ─────────────────────────────────────────────────────────── */
const statusLabel: Record<string, string> = {
  shipped: "Shipped",
  archived: "Archived",
  wip: "WIP",
};

const statusColor: Record<string, string> = {
  shipped: "var(--success)",
  archived: "var(--fg-muted)",
  wip: "var(--warning)",
};

const StatusBadge: React.FC<{ status: Project["status"] }> = ({ status }) => {
  if (!status) return null;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        padding: "0.2rem 0.65rem",
        borderRadius: "var(--radius-pill)",
        background: "var(--glass-bg-chip)",
        border: "1px solid var(--glass-border)",
        fontSize: "var(--text-xs)",
        fontWeight: 600,
        letterSpacing: "0.04em",
        /* Non-accent color per §4.6 hook — matches "Private" badge convention */
        color: statusColor[status] ?? "var(--fg-muted)",
      }}
    >
      {status === "shipped" && (
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "0.45rem",
            height: "0.45rem",
            borderRadius: "50%",
            background: "var(--success)",
            flexShrink: 0,
          }}
        />
      )}
      {statusLabel[status] ?? status}
    </span>
  );
};

/* ── Stack chip — flat, no nested backdrop-filter ─────────────────────────── */
const StackChip: React.FC<{ label: string }> = ({ label }) => (
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

/* ── Page props ───────────────────────────────────────────────────────────── */
interface ProjectsPageProps {
  githubRepos: RepoCardType[];
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
const Projects: NextPage<ProjectsPageProps> = ({ githubRepos }) => {
  const shouldReduceMotion = useReducedMotion();

  const containerMotion = shouldReduceMotion
    ? {}
    : { variants: containerVariants, initial: "hidden", animate: "visible" };

  const itemMotion = shouldReduceMotion ? {} : { variants: itemVariants };

  /* Featured = first project (wider asymmetric treatment) */
  const [featured, ...secondary] = projectsData;

  /* GitHub section: featured = first repo (wider), rest = secondary */
  const [featuredRepo, ...secondaryRepos] = githubRepos;

  return (
    <>
      <Seo
        title="Projects — Brandon Berke"
        description="Case studies of projects built by Brandon Berke — from capstone full-stack apps to self-driven cloud infrastructure experiments."
        path="/projects"
        type="website"
      />

      <NavBar />

      <main
        style={{
          paddingTop: "6rem",
          paddingBottom: "var(--space-section)",
          minHeight: "100vh",
          fontFamily: "var(--font-sans)",
          color: "var(--fg)",
        }}
      >
        {/* Scoped responsive styles for the asymmetric grids */}
        <style>{`
          .projects-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          @media (min-width: 860px) {
            .projects-grid {
              grid-template-columns: 3fr 2fr;
            }
            .projects-grid .card-featured {
              grid-column: 1;
              grid-row: 1 / span 2;
            }
            .projects-grid .card-secondary {
              grid-column: 2;
            }
          }
          .repos-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
          @media (min-width: 700px) {
            .repos-grid {
              grid-template-columns: repeat(2, 1fr);
            }
            .repos-grid .repo-featured {
              grid-column: 1 / -1;
            }
          }
          @media (min-width: 1000px) {
            .repos-grid {
              grid-template-columns: repeat(3, 1fr);
            }
            .repos-grid .repo-featured {
              grid-column: 1 / span 2;
            }
          }
        `}</style>

        {/* ── INTRO ────────────────────────────────────────────────────── */}
        <section
          aria-labelledby="projects-heading"
          style={{
            width: "100%",
            maxWidth: "var(--container)",
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: "var(--gutter)",
            paddingRight: "var(--gutter)",
            paddingTop: "clamp(2.5rem, 5vw, 4rem)",
            paddingBottom: "var(--space-block)",
          }}
        >
          <motion.div {...containerMotion}>
            <motion.p
              {...itemMotion}
              style={{
                margin: "0 0 0.5rem",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--fg-muted)",
              }}
            >
              Work
            </motion.p>
            <motion.h1
              id="projects-heading"
              {...itemMotion}
              style={{
                margin: "0 0 0.75rem",
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-h1)",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: "var(--fg)",
              }}
            >
              Projects
            </motion.h1>
            <motion.p
              {...itemMotion}
              style={{
                margin: 0,
                fontSize: "var(--text-body)",
                lineHeight: 1.65,
                color: "var(--fg-muted)",
                maxWidth: "var(--measure)",
              }}
            >
              An honest look at what I&rsquo;ve built — a backend-heavy capstone
              and an ambitious solo infrastructure experiment, with the things I
              learned from each.
            </motion.p>
          </motion.div>
        </section>

        {/* ── ASYMMETRIC PROJECT GRID (§4.4) ──────────────────────────── */}
        <section
          aria-label="Project cards"
          style={{
            width: "100%",
            maxWidth: "var(--container)",
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: "var(--gutter)",
            paddingRight: "var(--gutter)",
            paddingBottom: "var(--space-section)",
          }}
        >
          <motion.div
            className="projects-grid"
            {...(shouldReduceMotion
              ? {}
              : {
                  variants: containerVariants,
                  initial: "hidden",
                  whileInView: "visible",
                  viewport: { once: true, amount: 0.1 },
                })}
          >
            {/* ── FEATURED card (first project, wider column) ─────────── */}
            {featured && (
              <motion.article
                className="card-featured glass"
                {...itemMotion}
                aria-label={featured.name}
                style={{
                  padding: "2rem",
                  borderRadius: "var(--radius-xl)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                {/* Meta row */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <h2
                      style={{
                        margin: 0,
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--text-h2)",
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                        color: "var(--fg)",
                        lineHeight: 1.2,
                      }}
                    >
                      {featured.name}
                    </h2>
                    {featured.context && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: "var(--text-xs)",
                          color: "var(--fg-subtle)",
                          fontWeight: 500,
                          letterSpacing: "0.03em",
                        }}
                      >
                        {featured.context}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={featured.status} />
                </div>

                {/* Tagline */}
                {featured.tagline && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: "var(--text-h3)",
                      fontWeight: 400,
                      lineHeight: 1.45,
                      color: "var(--fg-muted)",
                    }}
                  >
                    {featured.tagline}
                  </p>
                )}

                {/* Stack chips — flat, no nested backdrop-filter (§2.6) */}
                {featured.stack && featured.stack.length > 0 && (
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}
                    aria-label="Stack"
                  >
                    {featured.stack.map((tech) => (
                      <StackChip key={tech} label={tech} />
                    ))}
                  </div>
                )}

                {/* CTA — ghost link */}
                <div style={{ marginTop: "auto", paddingTop: "0.25rem" }}>
                  <Link
                    href={`/projects/${featured.id}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      fontSize: "var(--text-sm)",
                      fontWeight: 500,
                      color: "var(--accent)",
                      textDecoration: "none",
                      borderBottom: "1px solid transparent",
                      transition: "border-color 150ms ease",
                      paddingBottom: "1px",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.borderColor = "transparent")
                    }
                  >
                    Read case study →
                  </Link>
                </div>
              </motion.article>
            )}

            {/* ── SECONDARY cards (narrower column) ───────────────────── */}
            {secondary.map((project) => (
              <motion.article
                key={project.id}
                className="card-secondary glass"
                {...itemMotion}
                aria-label={project.name}
                style={{
                  padding: "1.5rem",
                  borderRadius: "var(--radius-xl)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.875rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                    <h2
                      style={{
                        margin: 0,
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--text-h3)",
                        fontWeight: 600,
                        color: "var(--fg)",
                        lineHeight: 1.2,
                      }}
                    >
                      {project.name}
                    </h2>
                    {project.context && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: "var(--text-xs)",
                          color: "var(--fg-subtle)",
                        }}
                      >
                        {project.context}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={project.status} />
                </div>

                {project.tagline && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: "var(--text-sm)",
                      lineHeight: 1.6,
                      color: "var(--fg-muted)",
                    }}
                  >
                    {project.tagline}
                  </p>
                )}

                {project.stack && project.stack.length > 0 && (
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}
                    aria-label="Stack"
                  >
                    {project.stack.slice(0, 6).map((tech) => (
                      <StackChip key={tech} label={tech} />
                    ))}
                    {project.stack.length > 6 && (
                      <StackChip label={`+${project.stack.length - 6} more`} />
                    )}
                  </div>
                )}

                <div style={{ marginTop: "auto" }}>
                  <Link
                    href={`/projects/${project.id}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      fontSize: "var(--text-sm)",
                      fontWeight: 500,
                      color: "var(--accent)",
                      textDecoration: "none",
                      borderBottom: "1px solid transparent",
                      transition: "border-color 150ms ease",
                      paddingBottom: "1px",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.borderColor = "transparent")
                    }
                  >
                    Read case study →
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </section>

        {/* ── GITHUB REPO SHOWCASE (Story 3.5) ────────────────────────── */}
        {githubRepos.length > 0 && (
          <section
            aria-labelledby="github-heading"
            style={{
              width: "100%",
              maxWidth: "var(--container)",
              marginLeft: "auto",
              marginRight: "auto",
              paddingLeft: "var(--gutter)",
              paddingRight: "var(--gutter)",
              paddingBottom: "var(--space-section)",
            }}
          >
            {/* Section header */}
            <motion.div
              {...(shouldReduceMotion
                ? {}
                : {
                    variants: containerVariants,
                    initial: "hidden",
                    whileInView: "visible",
                    viewport: { once: true, amount: 0.1 },
                  })}
              style={{ marginBottom: "1.5rem" }}
            >
              <motion.p
                {...itemMotion}
                style={{
                  margin: "0 0 0.375rem",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--fg-muted)",
                }}
              >
                Open source &amp; labs
              </motion.p>
              <motion.h2
                id="github-heading"
                {...itemMotion}
                style={{
                  margin: "0 0 0.5rem",
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-h2)",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  color: "var(--fg)",
                }}
              >
                From my GitHub
              </motion.h2>
              <motion.p
                {...itemMotion}
                style={{
                  margin: "0 0 1rem",
                  fontSize: "var(--text-sm)",
                  lineHeight: 1.6,
                  color: "var(--fg-muted)",
                  maxWidth: "var(--measure)",
                }}
              >
                A live snapshot of my Cipher Codex org — production apps, infrastructure
                modules, and experiments. Click any card for a deep dive with architecture
                diagrams and writeups.
              </motion.p>

              {/* MMA Almanac system callout */}
              <motion.div
                {...itemMotion}
                style={{
                  display: "inline-flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.6rem 1rem",
                  borderRadius: "var(--radius-xl)",
                  background: "var(--glass-bg-chip)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    color: "var(--fg-muted)",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  MMA Almanac system:
                </span>
                {MMA_SYSTEM_SLUGS.map((slug) => (
                  <Link
                    key={slug}
                    href={`/projects/repo/${slug}`}
                    style={{
                      fontSize: "var(--text-xs)",
                      fontWeight: 500,
                      color: "var(--accent)",
                      textDecoration: "none",
                      borderBottom: "1px solid transparent",
                      transition: "border-color 150ms ease",
                      paddingBottom: "1px",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.borderColor = "transparent")
                    }
                  >
                    {slug}
                  </Link>
                ))}
              </motion.div>
            </motion.div>

            {/* Asymmetric repo grid — featured card spans wider (§4.6 / §4.4 rhythm) */}
            <motion.div
              className="repos-grid"
              {...(shouldReduceMotion
                ? {}
                : {
                    variants: containerVariants,
                    initial: "hidden",
                    whileInView: "visible",
                    viewport: { once: true, amount: 0.05 },
                  })}
            >
              {featuredRepo && (
                <motion.div key={featuredRepo.id} className="repo-featured" {...itemMotion}>
                  <RepoCard repo={featuredRepo} featured />
                </motion.div>
              )}
              {secondaryRepos.map((repo) => (
                <motion.div key={repo.id} {...itemMotion}>
                  <RepoCard repo={repo} />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}
      </main>
    </>
  );
};

/* ── Static generation with ISR (ADR 0001 Decision 1 / Decision 4) ───────── */
export const getStaticProps: GetStaticProps<ProjectsPageProps> = async () => {
  // Import server-only module here so it never reaches the client bundle.
  // Dynamic import keeps the server-only guard effective.
  const { getCipherCodexRepoCards } = await import("../lib/github");

  // ADR 0001 Decision 4: on failure THROW so ISR serves the last good page.
  // Do NOT return { props: { githubRepos: [] } } on error — that would cache
  // an empty showcase and poison the ISR cache.
  const githubRepos = await getCipherCodexRepoCards();

  return {
    props: { githubRepos },
    revalidate: 3600, // 1 hour — matches ADR 0001 Decision 4
  };
};

export default Projects;
