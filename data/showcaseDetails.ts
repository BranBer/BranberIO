/**
 * Static detail records for the 9 showcased Cipher-Codex repos.
 *
 * These are keyed by slug (= repo name after "Cipher-Codex/") and are merged
 * with live RepoCard data (languages, stars, pushedAt) in getStaticProps for
 * pages/projects/repo/[slug].tsx.
 *
 * Content sourced from docs/research/cipher-codex-repos.md (real file trees
 * and READMEs) — no invented metrics, no employer names.
 *
 * The MMA Almanac group shares a system diagram (mma-almanac-system.svg) that
 * surfaces the four repos as one coherent platform.
 */

export interface ShowcaseDetail {
  /** Matches the URL slug (repo name after "Cipher-Codex/"). */
  slug: string;
  /** Display title for the page heading. */
  title: string;
  /** One-line blurb — used for meta description and card subtitles. */
  blurb: string;
  /** Two–four sentence description of what this project is and does. */
  what: string;
  /** Notable engineering points — rendered as a highlights list. */
  highlights: string[];
  /** Technology stack for the deep-dive page (may differ from live repo languages). */
  stack: string[];
  /**
   * Slug of the per-repo architecture SVG file (no extension).
   * Maps to design/assets/repo-diagrams/<diagram>.svg.
   */
  diagram: string;
  /**
   * When set, this repo belongs to a multi-repo system. The value is the
   * human-readable system name, used for the "Part of …" callout.
   */
  system?: string;
  /**
   * Slug of the system-level overview diagram (no extension), shown when
   * system is set.
   */
  systemDiagram?: string;
}

const showcaseDetails: Record<string, ShowcaseDetail> = {
  "mma-almanac-scrapers": {
    slug: "mma-almanac-scrapers",
    title: "MMA Almanac Scrapers",
    blurb:
      "A Dockerized UFC/MMA data-collection pipeline using Playwright with Tor IP rotation and Cloudflare bypass.",
    what:
      "A Python data-collection pipeline that drives Playwright browser automation with Tor IP rotation and a custom Cloudflare-bypass HTTP client to reliably scrape Sherdog fighter profiles and UFC event/fight-statistics pages. Scraped data passes through a set of parsers and enrichers — including a fighter-stats interpolator and name-matcher — before being seeded into PostgreSQL via Prisma. The pipeline runs on a schedule triggered by GitHub Actions and AWS EventBridge, and the whole scraper runs inside Docker for reproducible execution.",
    highlights: [
      "Playwright browser automation with human-delay simulation to avoid bot detection",
      "Tor IP rotation (rotate_tor_ip) to cycle exit nodes between scraping sessions",
      "Cloudflare-bypass HTTP client for sites that block headless browsers",
      "Session-state save/load to resume scraping without re-authenticating",
      "Prisma ORM upsert seeders keep the PostgreSQL schema in sync with scraper output",
      "Dockerized execution with GitHub Actions + EventBridge scheduling",
      "Explicit data-leakage test suite confirming no future statistics bleed into training features",
    ],
    stack: [
      "Python",
      "Playwright",
      "Tor",
      "Prisma",
      "PostgreSQL",
      "Docker",
      "GitHub Actions",
      "AWS EventBridge",
    ],
    diagram: "mma-almanac-scrapers",
    system: "MMA Almanac",
    systemDiagram: "mma-almanac-system",
  },

  "mma-almanac-ai": {
    slug: "mma-almanac-ai",
    title: "MMA Almanac AI",
    blurb:
      "An ML fight-prediction engine with three XGBoost models, probability calibration, and an OpenAI-powered fight-article generator.",
    what:
      "The prediction engine for the MMA Almanac platform. It reads fighter and fight-statistics data from PostgreSQL, engineers a rich feature set, then trains three separate XGBoost gradient-boosted models: one that predicts the fight winner, one that predicts the method of victory (KO/TKO, submission, decision), and one that predicts the finishing round. Each model goes through probability calibration and is validated against an explicit four-phase data-leakage test suite. A separate module uses OpenAI's API to generate readable fight-preview articles keyed to upcoming cards. The whole engine is served as a FastAPI prediction API, deployed on AWS ECS, with scheduled retrain and hyperparameter-tune tasks managed by EventBridge and Lambda.",
    highlights: [
      "Three specialist XGBoost models: Win / Method / Round predictors — each with its own feature-engineering and preprocessing pipeline",
      "Probability calibration on all three models to produce reliable confidence scores",
      "Four-phase data-leakage test suite: feature leakage, temporal leakage, position bias, and prediction bias",
      "OpenAI-powered ArticleGenerator that drafts fight-preview articles for upcoming cards",
      "FastAPI prediction API deployed on AWS ECS Fargate with ECR container registry",
      "Scheduled retrain and hyperparameter-tune tasks via EventBridge and Lambda triggers",
      "Prisma schema shared with the scrapers for schema consistency across services",
    ],
    stack: [
      "Python",
      "XGBoost",
      "scikit-learn",
      "FastAPI",
      "OpenAI API",
      "Prisma",
      "PostgreSQL",
      "Docker",
      "AWS ECS Fargate",
      "AWS EventBridge",
      "AWS Lambda",
    ],
    diagram: "mma-almanac-ai",
    system: "MMA Almanac",
    systemDiagram: "mma-almanac-system",
  },

  "mma-almanac-ui": {
    slug: "mma-almanac-ui",
    title: "MMA Almanac UI",
    blurb:
      "The consumer web app for MMA Almanac — fight predictions, model-accuracy tracking, AI-generated articles, and Stripe-gated premium features.",
    what:
      "The public-facing Next.js application for the MMA Almanac platform. It consumes the prediction API and PostgreSQL data to display upcoming-fight predictions, track historical model accuracy, and serve OpenAI-generated fight-preview articles. Authentication is handled by NextAuth with OAuth providers and a linked-account system. Premium fight predictions sit behind a Stripe-gated paywall, with blurred placeholder cards shown to free users. GDPR compliance is built in — users can request account deletion via a multi-step flow with a time-delayed Lambda job that executes it. Custom D3-style visualizations (dual-bar comparison charts, performance timelines, heatmaps) show fighter stat comparisons directly on the predictions detail page.",
    highlights: [
      "NextAuth authentication with OAuth providers, linked-accounts API, and session management",
      "Stripe-gated premium predictions — blurred placeholder cards with upgrade prompt for free tier",
      "GDPR data-deletion flow: user-initiated request → Lambda executes deletion after cooling-off period",
      "Custom fighter-stat visualizations: dual-bar comparison charts, performance timelines, win-method heatmaps",
      "Model-accuracy tracking page with historical prediction vs. outcome comparisons",
      "AI-generated fight-preview articles with sanitized HTML rendering and a read-tracker",
      "Deployed as a Docker container on AWS ECS Fargate behind an ALB",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "NextAuth",
      "Prisma",
      "PostgreSQL",
      "Stripe",
      "Docker",
      "AWS ECS Fargate",
    ],
    diagram: "mma-almanac-ui",
    system: "MMA Almanac",
    systemDiagram: "mma-almanac-system",
  },

  "mma-almanac-aws": {
    slug: "mma-almanac-aws",
    title: "MMA Almanac AWS",
    blurb:
      "The full AWS infrastructure-as-code for the MMA Almanac platform: VPC, ECS Fargate services, ALB, EventBridge ML workflows, Lambda triggers, and more.",
    what:
      "A modular Terraform configuration that provisions the entire MMA Almanac platform on AWS. It creates a VPC with public/private subnets, an Application Load Balancer routing public traffic to the Next.js UI on ECS Fargate, and a set of private ECS Fargate services: the Next.js app, the Python prediction API, PostgreSQL, and the scraper service. Credentials live in Secrets Manager. ML workflows — scheduled model retraining and hyperparameter tuning — are triggered by EventBridge rules calling Lambda functions that start ECS tasks. CloudWatch handles logging and alarms. GitHub Actions OIDC authentication is provisioned as a standalone module so CI/CD pipelines can push images to ECR and update task definitions without long-lived AWS credentials.",
    highlights: [
      "VPC with public/private subnet layout — ALB in public subnets, all application containers in private subnets",
      "ECS Fargate services for Next.js UI, prediction API, PostgreSQL, and scraper — all defined as Terraform task-definition templates",
      "EventBridge-scheduled ML workflows: cron-triggered retrain and tune tasks invoke Lambda → ECS",
      "GitHub Actions OIDC module for keyless CI/CD authentication — no long-lived IAM access keys",
      "Secrets Manager for all credentials; ECR for container image storage",
      "CloudWatch log groups and alarms wired to all services",
      "VPC endpoints to reduce NAT Gateway costs for ECR, Secrets Manager, and CloudWatch traffic",
    ],
    stack: [
      "Terraform",
      "AWS ECS Fargate",
      "AWS VPC",
      "AWS ALB",
      "AWS EventBridge",
      "AWS Lambda",
      "AWS ECR",
      "AWS Secrets Manager",
      "AWS CloudWatch",
      "GitHub Actions OIDC",
    ],
    diagram: "mma-almanac-aws",
    system: "MMA Almanac",
    systemDiagram: "mma-almanac-system",
  },

  "cipher-codex": {
    slug: "cipher-codex",
    title: "Cipher Codex Studio Site",
    blurb:
      "The Cipher Codex studio marketing site — Next.js App Router with an in-house UI library and a custom D3 data-visualization suite.",
    what:
      "The marketing and portfolio site for the Cipher Codex development studio, built in Next.js App Router (TypeScript). The project includes a fully hand-authored UI component library — Button, Input, Modal, Tooltip, Typography, and more — rather than adopting a third-party design system. On top of that sits a custom D3-backed data-visualization library covering area charts, bar charts, heatmaps, radar charts, tree layouts, treemaps, pie charts, radial charts, and Delaunay triangulation. The site features scroll-driven animation via a custom ScrollProvider context, a blog/articles section, and a contact form. It is deployed via AWS CodeBuild CI/CD.",
    highlights: [
      "Hand-authored UI component library (20+ components) instead of a third-party design system",
      "Custom D3 data-visualization library: AreaChart, BarChart, Heatmap, RadarChart, Tree, Treemap, PieChart, RadialChart, Delaunay",
      "Scroll-driven animation via a custom ScrollProvider / InViewDiv React context system",
      "Next.js App Router with RSC-aware layout and per-section animation variants",
      "CodeBuild CI/CD pipeline defined in buildspec.yml for automated deployments",
      "Sitemap and robots.ts for SEO; OpenGraph image included",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "D3",
      "React",
      "Tailwind CSS",
      "AWS CodeBuild",
    ],
    diagram: "cipher-codex",
  },

  "cipher-codex-aws-infra": {
    slug: "cipher-codex-aws-infra",
    title: "Cipher Codex AWS Infrastructure",
    blurb:
      "The Terraform IaC that provisions the Cipher Codex studio site's AWS hosting — IAM roles and static-hosting resources.",
    what:
      "A minimal, focused Terraform configuration that provisions the hosting infrastructure for the Cipher Codex studio site on AWS. It sets up the IAM permissions needed by the CodeBuild pipeline and the hosting resources — wiring them together so the site deploys cleanly without manual console configuration. The stack is deliberately lean: only the resources the site actually needs, with no over-engineering. Providers and variables are separated into dedicated files for easy environment configuration.",
    highlights: [
      "Minimal four-file Terraform layout: iam.tf, main.tf, providers.tf, variables.tf",
      "IAM roles scoped to the CodeBuild deployment pipeline and S3/CloudFront hosting pattern",
      "Designed to consume the aws-modules cloudfront-s3 module for hosting and codebuild-pipeline for CI/CD",
      "No state lock / backend config checked in — kept portable across environments",
    ],
    stack: ["Terraform", "AWS IAM", "AWS S3", "AWS CloudFront", "AWS CodeBuild"],
    diagram: "cipher-codex-aws-infra",
  },

  "aws-modules": {
    slug: "aws-modules",
    title: "AWS Terraform Modules",
    blurb:
      "A reusable Terraform module library — a CloudFront + S3 static-hosting module and a CodeBuild CI/CD pipeline module.",
    what:
      "A shared Terraform module library that encapsulates two common AWS infrastructure patterns as reusable, parameterized modules. The cloudfront-s3 module provisions a complete static-site hosting stack: S3 bucket, CloudFront distribution with HTTPS, Route53 DNS records, and ACM SSL certificate — all from a single module call with a domain name and bucket name as inputs. The codebuild-pipeline module provisions a CodeBuild project with the necessary IAM permissions and build data sources for a CI/CD pipeline. Both modules are consumed by cipher-codex-aws-infra and other Cipher Codex projects, making infrastructure consistent across deployments.",
    highlights: [
      "cloudfront-s3 module: S3 bucket + CloudFront distribution + Route53 A/AAAA records + ACM SSL certificate in one module call",
      "codebuild-pipeline module: CodeBuild project + IAM roles + build data sources — parameterized for reuse",
      "Required variables kept minimal (bucket_name, comment, domain_name) for fast onboarding",
      "Module outputs surface ARNs and URLs for use by consuming configurations",
      "Reused across cipher-codex-aws-infra and other projects in the Cipher Codex org",
    ],
    stack: [
      "Terraform",
      "AWS S3",
      "AWS CloudFront",
      "AWS Route53",
      "AWS ACM",
      "AWS CodeBuild",
      "AWS IAM",
    ],
    diagram: "aws-modules",
  },

  journilog: {
    slug: "journilog",
    title: "Journilog",
    blurb:
      "An AI journaling app with Cognito auth, AppSync GraphQL + DynamoDB, a GPT-powered insights generator, PIN-lock privacy, and a rich-text editor.",
    what:
      "A private journaling application built on AWS Amplify Gen 2. Authentication is handled by Cognito with a full sign-up/sign-in/forgot-password/MFA flow. Journal entries are stored in DynamoDB via an AppSync GraphQL API defined in the Amplify data resource. A Lambda function integrates with OpenAI's GPT API to analyze journal entries and surface emotional and thematic insights. The Next.js client includes a PIN-lock screen for device privacy, a rich-text editor with table creation and custom toolbar controls, Redux state management, and a Google login option. The entire backend (auth, API, data, functions) is defined in TypeScript via Amplify Gen 2 CDK constructs.",
    highlights: [
      "AWS Amplify Gen 2 backend: Cognito auth, AppSync GraphQL API, DynamoDB data, Lambda functions — all defined in TypeScript",
      "GPT/OpenAI insights Lambda: reads journal entry content, returns AI-generated emotional and thematic analysis",
      "PIN-lock screen (client-side) for device-level privacy before accessing journal content",
      "Rich-text editor with custom MenuBar, table creation, and formatting controls",
      "Redux state management for journal entries and API state",
      "Full auth flow: sign-up with email confirmation, login, forgot-password, Google OAuth",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "AWS Amplify Gen 2",
      "AWS Cognito",
      "AWS AppSync",
      "AWS DynamoDB",
      "AWS Lambda",
      "OpenAI API",
      "Redux",
    ],
    diagram: "journilog",
  },

  "full-service-estate-sales": {
    slug: "full-service-estate-sales",
    title: "Full Service Estate Sales",
    blurb:
      "An estate-sales business platform with a public listings site, a Cognito-gated admin dashboard, and a subscriber notification fan-out via Lambda.",
    what:
      "A business platform for a full-service estate-sale company, built on AWS Amplify Gen 2. The public-facing site shows upcoming sale events and services, with a subscription form that captures email addresses. When a new estate sale is created in the admin dashboard, a Lambda fan-out function fires notifications to all subscribers via email and SMS. The admin section is protected by Cognito authentication — only authenticated administrators can create, edit, and manage sale listings. An unsubscribe flow with token verification is included for CAN-SPAM compliance. The entire backend is defined in TypeScript via Amplify Gen 2 CDK constructs.",
    highlights: [
      "Public listing site + Cognito-gated admin dashboard for managing estate sale events",
      "Lambda fan-out: new-sale event triggers email and SMS notifications to all subscribers",
      "Subscribe / unsubscribe Lambda functions with token-verified unsubscribe links",
      "AWS Amplify Gen 2 backend: Cognito auth, AppSync GraphQL, DynamoDB, Lambda functions",
      "Framer Motion scroll animations for the public marketing sections",
      "Contact form with server-side handling via Amplify function",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "AWS Amplify Gen 2",
      "AWS Cognito",
      "AWS AppSync",
      "AWS DynamoDB",
      "AWS Lambda",
      "AWS SNS",
    ],
    diagram: "full-service-estate-sales",
  },
};

export default showcaseDetails;

/**
 * The 9 showcase slugs in display order.
 * Matches SHOWCASE_REPO_ALLOWLIST order (case-lowered after "Cipher-Codex/").
 */
export const SHOWCASE_SLUGS: readonly string[] = [
  "cipher-codex",
  "cipher-codex-aws-infra",
  "aws-modules",
  "journilog",
  "full-service-estate-sales",
  "mma-almanac-scrapers",
  "mma-almanac-ai",
  "mma-almanac-ui",
  "mma-almanac-aws",
] as const;
