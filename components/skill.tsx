/**
 * Skill - flat pill tile used inside a glass category panel.
 * Per spec S3.3 and S4.3: the container category panel holds the one backdrop-
 * filter blur; individual skill pills are flat (no backdrop-filter) to avoid
 * nested-blur breakage and GPU overload.
 *
 * Styled with design tokens only - no SCSS module.
 */
import React from "react";
import { IconType } from "react-icons";

interface SkillProps {
  Icon: IconType;
  iconText: string;
}

const Skill: React.FC<SkillProps> = ({ Icon, iconText }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 0.875rem",
        background: "var(--glass-bg-chip)",
        border: "1px solid var(--glass-border)",
        borderRadius: "var(--radius-pill)",
        color: "var(--fg-muted)",
        fontSize: "var(--text-sm)",
        fontWeight: 500,
        transition: "color 150ms ease, border-color 150ms ease",
        cursor: "default",
        whiteSpace: "normal",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.color = "var(--fg)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.color = "var(--fg-muted)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--glass-border)";
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          fontSize: "1.125rem",
          lineHeight: 1,
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        <Icon />
      </span>
      <span>{iconText}</span>
    </div>
  );
};

export default Skill;
