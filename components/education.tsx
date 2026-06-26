/**
 * Education - glass-styled card for a single educational credential.
 * Spec S4.2.3: restyled to .glass, single column, distinct from chips above.
 * Tier-1 .glass is appropriate here: all content is short labels/meta at >=14px
 * with fontWeight >=500, clearing the large-text 3:1 rule (S3.1).
 * Per spec S3.3 no nested backdrop-filter: no glass inside glass.
 */
import React from "react";
import { CgWebsite } from "react-icons/cg";

interface EducationProps {
  imageSrc: string;
  school: string;
  gpa: number;
  degree: string;
  major: string;
  yearGraduated: number;
  location: string;
  url: string;
}

const Education: React.FC<EducationProps> = ({
  school,
  gpa,
  degree,
  major,
  yearGraduated,
  location,
  url,
}) => {
  const rows: { label: string; value: string | number }[] = [
    { label: "Degree", value: degree },
    { label: "Major", value: major },
    { label: "GPA", value: gpa },
    { label: "Graduated", value: yearGraduated },
    { label: "Location", value: location },
  ];

  return (
    <div
      className="glass"
      style={{
        padding: "clamp(1.25rem, 3vw, 2rem)",
        borderRadius: "var(--radius-lg)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <h3
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h3)",
              fontWeight: 600,
              color: "var(--fg)",
              lineHeight: 1.2,
            }}
          >
            {school}
          </h3>
          <span
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--fg-muted)",
            }}
          >
            {location}
          </span>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${school} website`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.4rem",
            color: "var(--fg-muted)",
            borderRadius: "var(--radius-sm)",
            transition: "color 150ms ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color = "var(--fg-muted)")
          }
        >
          <CgWebsite size={22} aria-hidden="true" />
        </a>
      </div>

      {/* Detail rows - flat labels, no nested glass */}
      <dl
        style={{
          margin: 0,
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          rowGap: "0.5rem",
          columnGap: "1.5rem",
        }}
      >
        {rows.map(({ label, value }) => (
          <React.Fragment key={label}>
            <dt
              style={{
                margin: 0,
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                color: "var(--fg-subtle)",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </dt>
            <dd
              style={{
                margin: 0,
                fontSize: "var(--text-sm)",
                color: "var(--fg-muted)",
              }}
            >
              {value}
            </dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
  );
};

export default Education;
