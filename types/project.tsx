export default interface project {
  id: string;
  name: string;
  /** One-line positioning statement shown in list/card views. */
  tagline?: string;
  /**
   * Long-form summary / fallback description. Used wherever a full prose
   * explanation is appropriate and as the fallback when case-study fields
   * are absent.
   */
  description: string;
  /** What this project was / why it existed (e.g. "Senior capstone project"). */
  context?: string;
  /** Brandon's role on the project (e.g. "Sole backend engineer"). */
  role?: string;
  /** The problem the project addressed, in plain language. */
  problem?: string;
  /** What was built / the approach taken to solve the problem. */
  solution?: string;
  /** Primary technologies / tools used. */
  stack?: string[];
  /**
   * True, honest outcome statements. No invented metrics.
   * Omit or leave empty rather than fabricate numbers.
   */
  impact?: string[];
  /**
   * Lifecycle status of the project.
   * - "shipped"  — completed and deployed
   * - "wip"      — actively in progress
   * - "archived" — work stopped; preserved for portfolio signal
   */
  status?: "shipped" | "wip" | "archived";
  repo: {
    link: string;
    repo: string;
    owner: string;
  };
  projectLink: string;
  /**
   * Image URLs. Kept as a flat string[] for backward-compatibility with
   * existing carousel / background consumers. Per-image captions (nice-to-have)
   * live in the parallel `imageCaptions` map keyed by URL.
   */
  images: string[];
  /**
   * Optional captions keyed by image URL. Not required; omit for images that
   * need no annotation.
   */
  imageCaptions?: Record<string, string>;
  tags: string[];
}
