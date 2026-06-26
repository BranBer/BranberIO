/**
 * About - migrated to the glass design system.
 * Spec: design/02-2-visual-redesign-spec.md S4.2
 *
 * Section rhythm (no two identical back-to-back):
 * 1. Bio block  - asymmetric portrait + .glass-strong text (tier-2 body copy, S3.2)
 * 2. Quick-facts row - flat .glass-chip stat chips
 * 3. Achievement cards - .glass panels grouped by domain (anonymized, no employer/dates)
 * 4. Industry tags - flat .glass-chip tags
 * 5. Education - Education component on .glass, single column
 * 6. Contact/resume close band - .glass-strong, mailto CTA (no PDF embed, no modal)
 *
 * PRIVACY: no employer names, no employment dates, no phone numbers, no resume PDF.
 */
import React from "react";
import type { NextPage } from "next";
import Image from "next/image";
import Seo from "../components/Seo";
import NavBar from "../components/navBar";
import Education from "../components/education";
import educationalExperiences from "../data/education";
import { motion, useReducedMotion } from "framer-motion";

/* -- Inline SVG icons ------------------------------------------------------ */
const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 7 10-7" />
  </svg>
);

/* -- Framer-motion variants ------------------------------------------------- */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

/* -- Layout helper ---------------------------------------------------------- */
const sectionStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "var(--container)",
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: "var(--gutter)",
  paddingRight: "var(--gutter)",
};

/* -- Achievement data (anonymized - no employer names/dates) ---------------- */
interface AchievementCard {
  title: string;
  bullets: string[];
}
const ACHIEVEMENT_DOMAINS: { domain: string; cards: AchievementCard[] }[] = [
  {
    domain: "Cloud & Data Engineering",
    cards: [
      {
        title: "95% infrastructure cost reduction",
        bullets: [
          "Cut data-infrastructure spend ~95% ($12K to <$700/mo) by replacing a legacy EMR cluster with a serverless Medallion (bronze/silver/gold) architecture on AWS.",
        ],
      },
      {
        title: "High-throughput ETL pipeline",
        bullets: [
          "Built Kafka-to-S3 ETL pipelines (Confluent connectors, EventBridge, SQS, Python/Pandas Lambdas) orchestrated with Step Functions.",
          "ACID upserts and schema evolution via Apache Hudi on Glue; data exposed through Athena, Redshift, and Collibra.",
        ],
      },
      {
        title: "Kubernetes modernization",
        bullets: [
          "Migrated on-prem Kubernetes to AWS EKS (Nirmata + Terraform).",
          "Modernized CI/CD from Jenkins to containerized GitHub Actions.",
        ],
      },
    ],
  },
  {
    domain: "Frontend & Data Visualization",
    cards: [
      {
        title: "Analytical dashboards",
        bullets: [
          "Built analytical dashboards in React, TypeScript, Redux Toolkit, and Apollo/GraphQL rendering financial metrics with interactive D3/Nivo and visx.",
        ],
      },
      {
        title: "Pixel-accurate SPAs",
        bullets: [
          "Translated Figma designs to pixel-accurate, animated single-page apps with Tailwind CSS and Framer Motion.",
        ],
      },
    ],
  },
  {
    domain: "Platform Reliability",
    cards: [
      {
        title: "Production API outage recovery",
        bullets: [
          "Restored a month-long production API outage by architecting a serverless Lambda + API Gateway layer querying Snowflake, replacing the downed backend and restoring client demos.",
        ],
      },
      {
        title: "Zero-downtime infrastructure fix",
        bullets: [
          "Averted a critical executive demo failure by importing and modifying live EKS state with Terraform and an ALB Ingress + Venafi SSL on a hard deadline.",
        ],
      },
      {
        title: "85% hosting cost reduction",
        bullets: [
          "Cut web hosting cost ~85% ($100+/mo to ~$14/mo) by migrating to serverless CloudFront + S3 + Lambda@Edge.",
        ],
      },
    ],
  },
  {
    domain: "AI & Agents",
    cards: [
      {
        title: "Custom AI agents",
        bullets: [
          "Build custom AI agents for automated code review and orchestrate multi-agent Claude Code systems that author Model Context Protocol (MCP) tools on the fly to QA thousands of URLs.",
        ],
      },
    ],
  },
];

const INDUSTRY_TAGS = [
  "Energy & Utilities",
  "FinTech & Banking",
  "SaaS / Web Platforms",
];

const QUICK_FACTS = [
  { label: "Experience", value: "5+ years" },
  { label: "Primary stack", value: "React · AWS · TypeScript" },
  { label: "Location", value: "New York" },
  { label: "Open to", value: "Full-time roles" },
];

/* -- Link hover helpers ----------------------------------------------------- */
const hoverFg = (e: React.MouseEvent<HTMLAnchorElement>) =>
  ((e.currentTarget as HTMLAnchorElement).style.color = "var(--fg)");
const unhoverFg = (e: React.MouseEvent<HTMLAnchorElement>) =>
  ((e.currentTarget as HTMLAnchorElement).style.color = "var(--fg-muted)");

/* -- Page ------------------------------------------------------------------- */
const About: NextPage = () => {
  const shouldReduceMotion = useReducedMotion();

  const motionProps = shouldReduceMotion
    ? {}
    : { variants: containerVariants, initial: "hidden", animate: "visible" };

  const itemMotion = shouldReduceMotion ? {} : { variants: itemVariants };

  const inViewMotion = (amount = 0.2) =>
    shouldReduceMotion
      ? {}
      : {
          variants: containerVariants,
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true, amount },
        };

  return (
    <>
      <Seo
        title="About — Brandon Berke"
        description="Full-stack and cloud engineer with 5+ years building high-performance web apps, real-time data dashboards, and the AWS infrastructure behind them."
        path="/about"
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
        {/* Scoped responsive styles — bio grid collapses at ≤640px */}
        <style>{`
          .about-bio-grid {
            display: grid;
            grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
            gap: clamp(2rem, 4vw, 4rem);
            align-items: start;
          }
          @media (max-width: 640px) {
            .about-bio-grid {
              grid-template-columns: 1fr;
            }
            .about-portrait {
              max-height: 320px !important;
              aspect-ratio: auto !important;
            }
          }
        `}</style>
        {/* 1. BIO BLOCK */}
        <section
          aria-label="About Brandon"
          style={{
            ...sectionStyle,
            paddingTop: "clamp(3rem, 6vw, 5rem)",
            paddingBottom: "var(--space-section)",
          }}
        >
          <motion.div
            {...motionProps}
            className="about-bio-grid"
          >
            <motion.div
              {...itemMotion}
              className="glass-strong about-portrait"
              style={{
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                aspectRatio: "4 / 5",
                position: "relative",
                maxHeight: "420px",
              }}
            >
              <Image
                src="/headshot.jpg"
                alt="Brandon Berke"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
            </motion.div>

            {/* Body copy must sit on .glass-strong per spec S3.2 */}
            <motion.div
              {...itemMotion}
              className="glass-strong"
              style={{
                padding: "clamp(1.5rem, 3vw, 2.5rem)",
                borderRadius: "var(--radius-xl)",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <p style={{ margin: 0, fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-muted)" }}>
                About me
              </p>
              <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.01em", color: "var(--fg)" }}>
                Brandon Berke
              </h1>
              <p style={{ margin: 0, fontSize: "var(--text-body)", lineHeight: 1.65, color: "var(--fg-muted)", maxWidth: "var(--measure)" }}>
                Full-stack &amp; cloud engineer with 5+ years building high-performance web apps, real-time data dashboards, and the AWS infrastructure behind them.
              </p>
              <p style={{ margin: 0, fontSize: "var(--text-body)", lineHeight: 1.65, color: "var(--fg-muted)", maxWidth: "var(--measure)" }}>
                I move comfortably from React frontends to serverless cloud infrastructure &mdash; equally at home architecting a Medallion data pipeline or shipping an accessible, animated SPA.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* 2. QUICK-FACTS ROW */}
        <section aria-label="Quick facts" style={{ ...sectionStyle, paddingBottom: "var(--space-section)" }}>
          <motion.div
            {...inViewMotion(0.3)}
            style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}
          >
            {QUICK_FACTS.map(({ label, value }) => (
              <motion.div
                key={label}
                {...itemMotion}
                style={{
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.25rem",
                  padding: "0.75rem 1.25rem",
                  background: "var(--glass-bg-chip)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "var(--radius-pill)",
                }}
              >
                <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--fg-subtle)" }}>
                  {label}
                </span>
                <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--fg)" }}>
                  {value}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* 3. ACHIEVEMENT CARDS */}
        <section aria-label="Selected impact" style={{ ...sectionStyle, paddingBottom: "var(--space-section)" }}>
          <motion.div {...inViewMotion(0.1)}>
            <motion.p
              {...itemMotion}
              style={{ margin: "0 0 var(--space-block)", fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-muted)" }}
            >
              Selected impact
            </motion.p>

            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              {ACHIEVEMENT_DOMAINS.map(({ domain, cards }) => (
                <div key={domain}>
                  <motion.h2
                    {...itemMotion}
                    style={{ margin: "0 0 1rem", fontFamily: "var(--font-display)", fontSize: "var(--text-h2)", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--fg)" }}
                  >
                    {domain}
                  </motion.h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", gap: "1rem" }}>
                    {cards.map((card) => (
                      <motion.div
                        key={card.title}
                        {...itemMotion}
                        className="glass"
                        style={{ padding: "clamp(1rem, 2.5vw, 1.5rem)", borderRadius: "var(--radius-lg)", display: "flex", flexDirection: "column", gap: "0.75rem" }}
                      >
                        <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-h3)", fontWeight: 600, color: "var(--fg)", lineHeight: 1.2 }}>
                          {card.title}
                        </h3>
                        <ul className="content-list" style={{ margin: 0, paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                          {card.bullets.map((bullet) => (
                            <li key={bullet} style={{ fontSize: "var(--text-sm)", lineHeight: 1.65, color: "var(--fg-muted)" }}>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 4. INDUSTRY TAGS */}
        <section aria-label="Industry experience" style={{ ...sectionStyle, paddingBottom: "var(--space-section)" }}>
          <motion.div {...inViewMotion(0.4)}>
            <motion.p {...itemMotion} style={{ margin: "0 0 0.75rem", fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-muted)" }}>
              Industries
            </motion.p>
            <motion.div {...itemMotion} style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {INDUSTRY_TAGS.map((tag) => (
                <span key={tag} style={{ display: "inline-block", padding: "0.375rem 0.875rem", background: "var(--glass-bg-chip)", border: "1px solid var(--glass-border)", borderRadius: "var(--radius-pill)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--fg-muted)" }}>
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* 5. EDUCATION */}
        <section aria-label="Education" style={{ ...sectionStyle, paddingBottom: "var(--space-section)" }}>
          <motion.div {...inViewMotion(0.3)}>
            <motion.h2
              {...itemMotion}
              style={{ margin: "0 0 var(--space-block)", fontFamily: "var(--font-display)", fontSize: "var(--text-h2)", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--fg)" }}
            >
              Education
            </motion.h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "600px" }}>
              {educationalExperiences.map((exp, index) => (
                <motion.div key={index} {...itemMotion}>
                  <Education
                    school={exp.school}
                    imageSrc={exp.imageSrc}
                    degree={exp.degree}
                    major={exp.major}
                    gpa={exp.gpa}
                    yearGraduated={exp.yearGraduated}
                    location={exp.location}
                    url={exp.url}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 6. CONTACT / RESUME CLOSE BAND */}
        <section aria-label="Contact and resume" style={sectionStyle}>
          <motion.div
            {...inViewMotion(0.4)}
            className="glass-strong"
            style={{
              padding: "clamp(2rem, 4vw, 3rem)",
              borderRadius: "var(--radius-xl)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "1.5rem",
            }}
          >
            <motion.h2 {...itemMotion} style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", fontWeight: 700, letterSpacing: "-0.01em", color: "var(--fg)" }}>
              {"Let\u2019s work together"}
            </motion.h2>

            <motion.p {...itemMotion} style={{ margin: 0, fontSize: "var(--text-body)", lineHeight: 1.65, color: "var(--fg-muted)", maxWidth: "var(--measure)" }}>
              Open to full-stack and cloud-infra roles. Full CV shared on request.
            </motion.p>

            <motion.div {...itemMotion} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
              <a
                href="mailto:brandonberke@gmail.com?subject=R%C3%A9sum%C3%A9%20request"
                aria-label="Request resume via email"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.75rem", borderRadius: "var(--radius-pill)", background: "var(--accent)", color: "var(--accent-fg)", fontWeight: 600, fontSize: "var(--text-sm)", textDecoration: "none", transition: "background 120ms ease, transform 120ms ease", boxShadow: "0 2px 12px rgb(59 91 219 / 0.25)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--accent-hover)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--accent)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
              >
                {"Request r\u00e9sum\u00e9"}
              </a>

              <a
                href="mailto:brandonberke@gmail.com"
                aria-label="Email Brandon Berke"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.75rem", borderRadius: "var(--radius-pill)", background: "transparent", color: "var(--fg)", fontWeight: 500, fontSize: "var(--text-sm)", textDecoration: "none", border: "1px solid var(--glass-border)", transition: "border-color 120ms ease, color 120ms ease" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--glass-border)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--fg)"; }}
              >
                <EmailIcon />
                Email me
              </a>
            </motion.div>

            <motion.div {...itemMotion} style={{ display: "flex", gap: "1rem", alignItems: "center", paddingTop: "0.5rem", borderTop: "1px solid var(--glass-border)", width: "100%", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://github.com/BranBer" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "var(--text-sm)", color: "var(--fg-muted)", textDecoration: "none", transition: "color 150ms ease" }} onMouseEnter={hoverFg} onMouseLeave={unhoverFg}>
                <GitHubIcon /><span>GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/brandon-berke-84111b199/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "var(--text-sm)", color: "var(--fg-muted)", textDecoration: "none", transition: "color 150ms ease" }} onMouseEnter={hoverFg} onMouseLeave={unhoverFg}>
                <LinkedInIcon /><span>LinkedIn</span>
              </a>
              <a href="mailto:brandonberke@gmail.com" aria-label="Email Brandon Berke" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "var(--text-sm)", color: "var(--fg-muted)", textDecoration: "none", transition: "color 150ms ease" }} onMouseEnter={hoverFg} onMouseLeave={unhoverFg}>
                <EmailIcon /><span>Email</span>
              </a>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </>
  );
};

export default About;
