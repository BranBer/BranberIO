/**
 * Skills - migrated to the glass design system.
 * Spec: design/02-2-visual-redesign-spec.md S4.3
 *
 * Section rhythm:
 * 1. Intro line - one framing sentence / overline + h1
 * 2. Category panels - each is ONE .glass panel (1 backdrop-filter blur) with flat skill pills.
 *    The two largest categories (AWS, Frameworks + Libraries) render as wide feature panels
 *    (col-span-2) for masonry-ish hierarchy - not N identical rows (spec S4.3).
 *
 * Blur budget: 1 blur per category panel - NEVER per-skill (spec S3.3).
 * No nested .glass inside .glass (spec S2.6).
 */
import React from "react";
import type { NextPage } from "next";
import NavBar from "../components/navBar";
import Seo from "../components/Seo";
import skills from "../data/skills";
import Skill from "../components/skill";
import { motion, useReducedMotion } from "framer-motion";

/* -- Framer-motion variants ------------------------------------------------- */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
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

/** Feature-span categories (2 largest)  rendered wider per spec S4.3 */
const FEATURE_CATEGORIES = new Set(["AWS", "Frameworks & Libraries"]);

/* -- Page ------------------------------------------------------------------- */
const Skills: NextPage = () => {
  const shouldReduceMotion = useReducedMotion();

  const itemMotion = shouldReduceMotion ? {} : { variants: itemVariants };

  const inViewMotion = (amount = 0.1) =>
    shouldReduceMotion
      ? {}
      : {
          variants: containerVariants,
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true, amount },
        };

  const skillCategories = Object.entries(skills).sort(
    ([, a], [, b]) => b.length - a.length
  );

  return (
    <>
      <Seo
        title="Skills — Brandon Berke"
        description="Full-stack and cloud skill set: React, TypeScript, AWS, Terraform, Python, and more — frontend to infrastructure."
        path="/skills"
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
        {/* 1. INTRO */}
        <section
          aria-label="Skills introduction"
          style={{
            ...sectionStyle,
            paddingTop: "clamp(3rem, 6vw, 5rem)",
            paddingBottom: "var(--space-block)",
          }}
        >
          <motion.div {...inViewMotion(0.5)}>
            <motion.p
              {...itemMotion}
              style={{ margin: "0 0 0.5rem", fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-muted)" }}
            >
              Skill set
            </motion.p>
            <motion.h1
              {...itemMotion}
              style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.01em", color: "var(--fg)" }}
            >
              Tools &amp; technologies I work with
            </motion.h1>
          </motion.div>
        </section>

        {/* 2. CATEGORY PANELS */}
        <section
          aria-label="Skill categories"
          style={{
            ...sectionStyle,
            paddingTop: "var(--space-block)",
            paddingBottom: "var(--space-section)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "1.25rem" }}>
            {skillCategories.map(([category, categorySkills]) => {
              const isFeature = FEATURE_CATEGORIES.has(category);
              return (
                <motion.div
                  key={category}
                  {...(shouldReduceMotion
                    ? {}
                    : { variants: containerVariants, initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.1 } })}
                  className="glass"
                  style={{
                    padding: "clamp(1.25rem, 2.5vw, 2rem)",
                    borderRadius: "var(--radius-lg)",
                    ...(isFeature ? { gridColumn: "1 / -1" } : {}),
                  }}
                >
                  <motion.h2
                    {...itemMotion}
                    style={{ margin: "0 0 1rem", fontFamily: "var(--font-display)", fontSize: "var(--text-h3)", fontWeight: 600, color: "var(--fg)" }}
                  >
                    {category}
                  </motion.h2>

                  {/* Flat skill pills - no nested backdrop-filter (spec S2.6) */}
                  <motion.div {...itemMotion} style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {categorySkills.map(({ skill, icon }, skillIndex) => (
                      <Skill
                        key={`${category}-${skillIndex}`}
                        Icon={icon}
                        iconText={skill}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
};

export default Skills;
