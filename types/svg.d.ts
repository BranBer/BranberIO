/**
 * Type declarations for SVG files imported as React components via @svgr/webpack.
 *
 * SCOPE: applies to SVG imports from design/assets/repo-diagrams/ only.
 * next.config.js scopes the SVGR loader to that path; other SVG imports remain
 * static-file URLs (handled by Next.js default loader).
 *
 * Usage:
 *   import ScrapersDiagram from "../../design/assets/repo-diagrams/mma-almanac-scrapers.svg";
 *   // ScrapersDiagram is a React.FC<React.SVGProps<SVGSVGElement>>
 */
declare module "*.svg" {
  import type { FC, SVGProps } from "react";
  const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
