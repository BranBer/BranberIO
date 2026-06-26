/**
 * Page — legacy content wrapper kept for non-migrated pages (about, skills, projects).
 * The glassmorphic landing (index.tsx) does NOT use this component.
 * NavBar is rendered by PageHeader in those pages.
 *
 * TODO Sprint 3: migrate remaining pages to direct layout, then delete this wrapper.
 */

interface PageProps {
  children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ children }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: "5rem",
        fontFamily: "var(--font-sans)",
        color: "var(--fg)",
        maxWidth: "var(--container)",
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: "var(--gutter)",
        paddingRight: "var(--gutter)",
        paddingBottom: "var(--space-section)",
      }}
    >
      {children}
    </div>
  );
};

export default Page;
