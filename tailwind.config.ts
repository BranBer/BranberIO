import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        "fg-muted": "var(--fg-muted)",
        "fg-subtle": "var(--fg-subtle)",
        surface: "var(--surface)",
        "surface-raised": "var(--surface-raised)",
        accent: "var(--accent)",
        "accent-fg": "var(--accent-fg)",
        "accent-hover": "var(--accent-hover)",
        success: "var(--success)",
        warning: "var(--warning)",
        ring: "var(--ring)",
        "glass-border": "var(--glass-border)",
      },
      fontFamily: {
        display: "var(--font-display)",
        sans: "var(--font-sans)",
      },
      fontSize: {
        display: "var(--text-display)",
        h1: "var(--text-h1)",
        h2: "var(--text-h2)",
        h3: "var(--text-h3)",
        lead: "var(--text-lead)",
        body: "var(--text-body)",
        sm: "var(--text-sm)",
        xs: "var(--text-xs)",
      },
      spacing: {
        section: "var(--space-section)",
        block: "var(--space-block)",
        gutter: "var(--gutter)",
      },
      maxWidth: {
        container: "var(--container)",
        measure: "var(--measure)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        pill: "var(--radius-pill)",
      },
    },
  },
  plugins: [],
};

export default config;
