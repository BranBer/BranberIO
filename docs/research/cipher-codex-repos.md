# Cipher-Codex repos — reference for architecture diagrams & deep-dive writeups


---

## Cipher-Codex/cipher-codex
- description: (none)
- topics: (none)
- default branch: master
- private: true
- languages: TypeScript, CSS, JavaScript

### File tree (149 files)
```
.eslintrc.json
.gitignore
README.md
buildspec.yml
imageLoaders/loader.js
next.config.mjs
package-lock.json
package.json
postcss.config.mjs
public/images/artificial-intelligence.webp
public/images/cicd.webp
public/images/clouds.jpeg
public/images/data-visualization.webp
public/images/developer-coding.png
public/images/developer-coding.webp
public/images/filled-waves.svg
public/images/fractal-square.svg
public/images/logo-white.svg
public/images/logo.svg
public/images/manhattan.jpg
public/images/og-image.jpg
public/images/react-vs-vue.webp
public/images/reactDev.jpeg
public/images/real-time-dashboards.webp
public/images/serverless-architecture.webp
public/images/serverless-data-lake.webp
public/images/waves.webp
public/next.svg
public/vercel.svg
public/videos/tech_innovation_unfolding_story.mp4
src/animation/variants/fadeFromBelow.ts
src/animation/variants/fadeFromLeft.ts
src/animation/variants/fadeFromRight.ts
src/animation/variants/fadeFromTop.ts
src/animation/variants/fadeInFadeOut.ts
src/animation/variants/fromLeft.ts
src/animation/variants/fromRight.ts
src/app/apple-icon.png
src/app/articles/[slug]/BlogPostClient.tsx
src/app/articles/[slug]/page.tsx
src/app/articles/layout.tsx
src/app/articles/page.tsx
src/app/articles/posts.tsx
src/app/contact/layout.tsx
src/app/contact/page.tsx
src/app/favicon.ico
src/app/globals.css
src/app/layout.tsx
src/app/page.tsx
src/app/robots.ts
src/app/sitemap.ts
src/components/About/About.tsx
src/components/About/index.ts
src/components/Contact/Contact.tsx
src/components/Contact/ContactForm.tsx
src/components/Contact/index.ts
src/components/HomeContent/HomeContent.tsx
src/components/HomeContent/index.ts
src/components/HomePage/HomePage.tsx
src/components/HomePage/index.ts
src/components/Services/Analytics.tsx
src/components/Services/Services.tsx
src/components/Services/index.ts
src/constants/SinglePageScrollComponents.ts
src/icons/Check.tsx
src/icons/Close.tsx
src/icons/Email.tsx
src/icons/Facebook.tsx
src/icons/Hamburger.tsx
src/icons/LinkedIn.tsx
src/icons/Location.tsx
src/icons/Notification.tsx
src/icons/RightChevron.tsx
src/icons/index.ts
src/providers/ScrollProvider/InViewDiv.tsx
src/providers/ScrollProvider/ScrollProvider.tsx
src/providers/ScrollProvider/index.ts
src/providers/ScrollProvider/types.d.ts
src/providers/ScrollProvider/useScroll.tsx
src/providers/ScrollProvider/useSetSelectedScrollItemWhenInView.ts
src/ui/ContactCard/ContactCard.tsx
src/ui/ContactCard/index.ts
src/ui/ContactCard/types.d.ts
src/ui/FadedBackdrop/FadedBackdrop.tsx
src/ui/FadedBackdrop/index.ts
src/ui/Footer/Footer.tsx
src/ui/Footer/index.ts
src/ui/Heading/Heading.tsx
src/ui/Heading/index.ts
src/ui/IconButton/IconButton.tsx
src/ui/IconButton/index.ts
src/ui/Input/Input.tsx
src/ui/Input/index.ts
src/ui/InteractiveFigure/InteractiveFigure.tsx
src/ui/InteractiveFigure/index.ts
src/ui/InteractiveFigure/types.d.ts
src/ui/MobileMenuSelect/MobileMenuSelect.tsx
src/ui/MobileMenuSelect/index.ts
src/ui/MobileMenuSelect/types.d.ts
src/ui/Modal/Modal.tsx
src/ui/Modal/index.ts
src/ui/Modal/types.d.ts
src/ui/MultiColorDiv/MultiColorDiv.tsx
src/ui/MultiColorDiv/index.ts
src/ui/Nav/Nav.tsx
src/ui/Nav/NavButton/NavButton.tsx
src/ui/Nav/NavButton/index.ts
src/ui/Nav/NavClient.tsx
src/ui/Nav/index.ts
src/ui/Nav/types.d.ts
src/ui/PulseButton/PulseButton.tsx
src/ui/PulseButton/index.ts
src/ui/TextArea/TextArea.tsx
src/ui/TextArea/index.ts
src/ui/Tooltip/Tooltip.tsx
src/ui/Tooltip/index.ts
src/ui/Typography/MotionTypography.tsx
src/ui/Typography/Typography.tsx
src/ui/Typography/index.ts
src/ui/Typography/types.d.ts
src/ui/UnfoldingDiv/UnfoldingDiv.tsx
src/ui/UnfoldingDiv/index.ts
src/ui/Visualizations/AreaChart/AreaChart.tsx
src/ui/Visualizations/AreaChart/index.ts
src/ui/Visualizations/BarChart/BarChart.tsx
src/ui/Visualizations/BarChart/index.ts
src/ui/Visualizations/Delaunay/Delaunay.tsx
src/ui/Visualizations/Delaunay/index.ts
src/ui/Visualizations/Heatmap/Heatmap.tsx
src/ui/Visualizations/Heatmap/index.ts
src/ui/Visualizations/PieChart/PieChart.tsx
src/ui/Visualizations/PieChart/index.ts
src/ui/Visualizations/RadarChart/RadarChart.tsx
src/ui/Visualizations/RadarChart/index.ts
src/ui/Visualizations/RadialChart/RadialChart.tsx
src/ui/Visualizations/RadialChart/index.ts
src/ui/Visualizations/Tree/Tree.tsx
src/ui/Visualizations/Tree/index.ts
src/ui/Visualizations/Treemap/Treemap.tsx
src/ui/Visualizations/Treemap/index.ts
src/variants/fadeFromBelow.ts
src/variants/fadeFromLeft.ts
src/variants/fadeFromRight.ts
src/variants/fadeFromTop.ts
src/variants/fadeInFadeOut.ts
src/variants/fromLeft.ts
src/variants/fromRight.ts
tailwind.config.ts
tsconfig.json
```

### README
```md
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

```


---

## Cipher-Codex/cipher-codex-aws-infra
- description: (none)
- topics: (none)
- default branch: master
- private: true
- languages: HCL

### File tree (4 files)
```
iam.tf
main.tf
providers.tf
variables.tf
```

### README
(none / unreadable: 404)


---

## Cipher-Codex/aws-modules
- description: (none)
- topics: (none)
- default branch: master
- private: true
- languages: HCL

### File tree (12 files)
```
cloudfront-s3/cloudfront.tf
cloudfront-s3/locals.tf
cloudfront-s3/outputs.tf
cloudfront-s3/route53.tf
cloudfront-s3/s3.tf
cloudfront-s3/ssl.tf
cloudfront-s3/variables.tf
codebuild-pipeline/codebuild.tf
codebuild-pipeline/data.tf
codebuild-pipeline/iam.tf
codebuild-pipeline/variables.tf
readme.md
```

### README
```md
required variables are: "bucket_name", "comment", "domain_name"

```


---

## Cipher-Codex/journilog
- description: (none)
- topics: (none)
- default branch: master
- private: true
- languages: TypeScript, CSS, JavaScript

### File tree (157 files)
```
.eslintrc.json
.gitignore
README.md
amplify.yml
amplify/auth/resource.ts
amplify/backend.ts
amplify/data/resource.ts
amplify/functions/entryHelper/handler.ts
amplify/functions/entryHelper/resource.ts
amplify/functions/gpt/graphql/API.ts
amplify/functions/gpt/graphql/mutations.ts
amplify/functions/gpt/graphql/queries.ts
amplify/functions/gpt/graphql/subscriptions.ts
amplify/functions/gpt/handler.ts
amplify/functions/gpt/resource.ts
amplify/package.json
amplify/tsconfig.json
models/client.ts
next.config.mjs
package-lock.json
package.json
postcss.config.mjs
public/cipherCodexLogo.png
public/faviconLight.ico
public/faviconReg.ico
public/field.mp4
public/journaling.mp4
public/meditate.jpg
public/privacy.jpg
public/thought.jpg
public/waves - Copy.png
public/waves.png
redux/reducers/api.ts
redux/reducers/journalEntries.ts
redux/store.ts
src/animation/variants/fadeFromBelow.ts
src/animation/variants/fadeFromLeft.ts
src/animation/variants/fadeFromRight.ts
src/animation/variants/fadeFromTop.ts
src/animation/variants/fadeInFadeOut.ts
src/animation/variants/fromLeft.ts
src/animation/variants/fromRight.ts
src/app/apple-touch-icon.png
src/app/favicon.ico
src/app/fonts/GeistMonoVF.woff
src/app/fonts/GeistVF.woff
src/app/globals.css
src/app/journal/components/InsightLoader/InsightLoader.tsx
src/app/journal/components/InsightLoader/index.ts
src/app/journal/components/Journal/EditorContext.tsx
src/app/journal/components/Journal/Journal.tsx
src/app/journal/components/Journal/JournalContainer.tsx
src/app/journal/components/Journal/JournalControls.tsx
src/app/journal/components/Journal/MenuBar.tsx
src/app/journal/components/Journal/TableCreator.tsx
src/app/journal/components/Journal/editor-styles.css
src/app/journal/components/Journal/index.ts
src/app/journal/components/Journal/types.d.ts
src/app/journal/components/JournalEntry/JournalEntry.tsx
src/app/journal/components/JournalEntry/index.ts
src/app/journal/components/PIN/Pin.tsx
src/app/journal/components/PIN/index.ts
src/app/journal/entries/page.tsx
src/app/journal/insights/page.tsx
src/app/journal/layout.tsx
src/app/journal/page.tsx
src/app/layout.tsx
src/app/login/components/ConfirmForm.tsx
src/app/login/components/ForgotPassword/Confirm.tsx
src/app/login/components/ForgotPassword/ForgotPassword.tsx
src/app/login/components/ForgotPassword/InitiateReset.tsx
src/app/login/components/LoginForm.tsx
src/app/login/components/PasswordRequirementCheckList.tsx
src/app/login/components/RegisterForm.tsx
src/app/login/page.tsx
src/app/page.tsx
src/app/privacy-policy/page.tsx
src/app/robots.ts
src/app/sitemap.ts
src/components/Footer/Footer.tsx
src/components/Footer/index.ts
src/components/LogoText/LogoText.tsx
src/components/LogoText/index.ts
src/icons/Book.tsx
src/icons/Check.tsx
src/icons/Close.tsx
src/icons/Email.tsx
src/icons/EyeHidden.tsx
src/icons/EyeVisible.tsx
src/icons/Facebook.tsx
src/icons/Hamburger.tsx
src/icons/LeftChevron.tsx
src/icons/LinkedIn.tsx
src/icons/Location.tsx
src/icons/Notification.tsx
src/icons/RightChevron.tsx
src/icons/TechBrain.tsx
src/icons/index.ts
src/providers/Auth/AuthContext.ts
src/providers/Auth/AuthGuard.tsx
src/providers/Auth/AuthProvider.tsx
src/providers/Auth/index.ts
src/providers/Auth/useAuth.ts
src/providers/Notistack.ts
src/ui/Autocomplete/Autocomplete.tsx
src/ui/Autocomplete/index.ts
src/ui/Button/Button.tsx
src/ui/Button/index.tsx
src/ui/Chip/Chip.tsx
src/ui/Chip/index.ts
src/ui/ConfigureAmplify/ConfigureAmpify.tsx
src/ui/ConfigureAmplify/index.ts
src/ui/DiscardButton/DiscardButton.tsx
src/ui/DiscardButton/index.ts
src/ui/FadedBackdrop/FadedBackdrop.tsx
src/ui/FadedBackdrop/index.ts
src/ui/GoogleLoginButton/GoogleLoginButton.tsx
src/ui/GoogleLoginButton/google.module.css
src/ui/GoogleLoginButton/index.ts
src/ui/GoogleLoginButton/types.d.ts
src/ui/IconButton/IconButton.tsx
src/ui/IconButton/index.ts
src/ui/Input/Input.tsx
src/ui/Input/index.ts
src/ui/InteractiveFigure/InteractiveFigure.tsx
src/ui/InteractiveFigure/index.ts
src/ui/InteractiveFigure/types.d.ts
src/ui/MarkdownText/MarkdownText.tsx
src/ui/MarkdownText/index.ts
src/ui/MobileMenuSelect/MobileMenuSelect.tsx
src/ui/MobileMenuSelect/index.ts
src/ui/MobileMenuSelect/types.d.ts
src/ui/Modal/Modal.tsx
src/ui/Modal/index.ts
src/ui/Modal/types.d.ts
src/ui/Nav/Nav.tsx
src/ui/Nav/index.ts
src/ui/Select/Select.tsx
src/ui/Select/index.ts
src/ui/SideNav/SideNav.tsx
src/ui/SideNav/SideNavContainer.tsx
src/ui/SideNav/index.ts
src/ui/SideNav/types.d.ts
src/ui/Skeleton/Skeleton.tsx
src/ui/Skeleton/index.ts
src/ui/TextArea/TextArea.tsx
src/ui/TextArea/index.ts
src/ui/Tooltip/Tooltip.tsx
src/ui/Tooltip/index.ts
src/ui/Typography/MotionTypography.tsx
src/ui/Typography/Typography.tsx
src/ui/Typography/index.ts
src/ui/Typography/types.d.ts
src/ui/ViewButton/ViewButton.tsx
src/ui/ViewButton/index.ts
tailwind.config.ts
tsconfig.json
```

### README
```md
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```


---

## Cipher-Codex/full-service-estate-sales
- description: (none)
- topics: (none)
- default branch: main
- private: true
- languages: TypeScript, CSS, JavaScript

### File tree (141 files)
```
.gitignore
README.md
amplify/auth/resource.ts
amplify/backend.ts
amplify/data/resource.ts
amplify/functions/sendEstateSaleNotifications/handler.ts
amplify/functions/sendEstateSaleNotifications/resource.ts
amplify/functions/subscribe/handler.ts
amplify/functions/subscribe/resource.ts
amplify/functions/unsubscribe/handler.ts
amplify/functions/unsubscribe/resource.ts
amplify/package.json
amplify/tsconfig.json
eslint.config.mjs
next.config.ts
package-lock.json
package.json
postcss.config.mjs
public/file.svg
public/globe.svg
public/images/estate_sale.webp
public/images/estate_sale_cleanout.webp
public/images/hundred-dollar-bills-usd.png
public/images/hundred-dollar-bills-usd.webp
public/mapMarker.svg
public/next.svg
public/vercel.svg
public/window.svg
src/Nav/Nav.tsx
src/Nav/index.ts
src/animation/variants/fadeFromBelow.ts
src/animation/variants/fadeFromLeft.ts
src/animation/variants/fadeFromRight.ts
src/animation/variants/fadeFromTop.ts
src/animation/variants/fadeInFadeOut.ts
src/animation/variants/fromLeft.ts
src/animation/variants/fromRight.ts
src/app/admin/components/AuthStatus/AuthStatus.tsx
src/app/admin/components/AuthStatus/index.ts
src/app/admin/layout.tsx
src/app/admin/login/components/ConfirmForm.tsx
src/app/admin/login/components/ForgotPassword/Confirm.tsx
src/app/admin/login/components/ForgotPassword/ForgotPassword.tsx
src/app/admin/login/components/ForgotPassword/InitiateReset.tsx
src/app/admin/login/components/LoginForm.tsx
src/app/admin/login/components/PasswordRequirementCheckList.tsx
src/app/admin/login/components/RegisterForm.tsx
src/app/admin/login/page.tsx
src/app/admin/page.tsx
src/app/contact/ContactForm.tsx
src/app/contact/ContactPageClient.tsx
src/app/contact/page.tsx
src/app/contact/page_old.tsx
src/app/contact/page_seo.tsx
src/app/favicon.ico
src/app/globals.css
src/app/layout.tsx
src/app/page.tsx
src/app/unsubscribe/UnsubscribeContent.tsx
src/app/unsubscribe/page.tsx
src/components/ConfigureAmplify/ConfigureAmplify.tsx
src/components/ConfigureAmplify/index.ts
src/components/EstateSaleEventList/EstateSaleEventList.tsx
src/components/EstateSaleEventList/index.ts
src/components/EstateSaleSection/EstateSaleSection.tsx
src/components/EstateSaleSection/index.ts
src/components/HeroSection/HeroSection.tsx
src/components/HeroSection/index.ts
src/components/HomeServices/BuyEstatesBlock.tsx
src/components/HomeServices/HomeServices.tsx
src/components/HomeServices/SpecializationBlock.tsx
src/components/HomeServices/index.ts
src/components/SubscribeForm/SubscribeForm.tsx
src/components/SubscribeForm/index.ts
src/dataClient.ts
src/icons/Book.tsx
src/icons/Check.tsx
src/icons/Close.tsx
src/icons/Email.tsx
src/icons/EyeHidden.tsx
src/icons/EyeVisible.tsx
src/icons/Facebook.tsx
src/icons/Hamburger.tsx
src/icons/LeftChevron.tsx
src/icons/LinkedIn.tsx
src/icons/Location.tsx
src/icons/MapMarker.tsx
src/icons/Notification.tsx
src/icons/RightChevron.tsx
src/icons/TechBrain.tsx
src/icons/index.ts
src/logo.svg
src/ui/Autocomplete/Autocomplete.tsx
src/ui/Autocomplete/index.ts
src/ui/Button/Button.tsx
src/ui/Button/ElegantButton.tsx
src/ui/Button/index.tsx
src/ui/Chip/Chip.tsx
src/ui/Chip/index.ts
src/ui/ConfigureAmplify/ConfigureAmpify.tsx
src/ui/ConfigureAmplify/index.ts
src/ui/DiscardButton/DiscardButton.tsx
src/ui/DiscardButton/index.ts
src/ui/FadedBackdrop/FadedBackdrop.tsx
src/ui/FadedBackdrop/index.ts
src/ui/GoogleLoginButton/GoogleLoginButton.tsx
src/ui/GoogleLoginButton/google.module.css
src/ui/GoogleLoginButton/index.ts
src/ui/GoogleLoginButton/types.d.ts
src/ui/IconButton/IconButton.tsx
src/ui/IconButton/index.ts
src/ui/Input/Input.tsx
src/ui/Input/index.ts
src/ui/InteractiveFigure/InteractiveFigure.tsx
src/ui/InteractiveFigure/index.ts
src/ui/InteractiveFigure/types.d.ts
src/ui/MobileMenuSelect/MobileMenuSelect.tsx
src/ui/MobileMenuSelect/index.ts
src/ui/MobileMenuSelect/types.d.ts
src/ui/Modal/Modal.tsx
src/ui/Modal/index.ts
src/ui/Modal/types.d.ts
src/ui/Nav/Nav.tsx
src/ui/Nav/index.ts
src/ui/Select/Select.tsx
src/ui/Select/index.ts
src/ui/Skeleton/Skeleton.tsx
src/ui/Skeleton/index.ts
src/ui/TextArea/TextArea.tsx
src/ui/TextArea/index.ts
src/ui/Tooltip/Tooltip.tsx
src/ui/Tooltip/index.ts
src/ui/Typography/Typography.tsx
src/ui/Typography/index.ts
src/ui/Typography/types.d.ts
src/ui/ViewButton/ViewButton.tsx
src/ui/ViewButton/index.ts
src/utils/amplifyServerUtils.ts
src/utils/convertToAmPm.ts
src/utils/userFriendlyTime.ts
tsconfig.json
```

### README
```md
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```


---

## Cipher-Codex/mma-almanac-scrapers
- description: (none)
- topics: (none)
- default branch: master
- private: false
- languages: Python, Shell, Dockerfile

### File tree (93 files)
```
.dockerignore
.env.production
.github/workflows/deploy-scrapers.yml
.github/workflows/run-scrapers-manual.yml
.gitignore
Dockerfile
SCHEMA_FIELD_MAPPING.json
all_events_fights.csv
all_fight_ids.csv
all_fight_stats.csv
analyze_enrichment_effectiveness.py
analyze_failed_fighter_page.py
bot_utils/__init__.py
bot_utils/human_random_delay.py
bot_utils/init_sync_playwright.py
bot_utils/load_session_state.py
bot_utils/rotate_tor_ip.py
bot_utils/save_session_state.py
check_failed_fighters.py
check_fighter_quality.py
database_seeder.py
database_seeder_enhanced.py
database_seeder_prisma.py
debug_ufc_html.py
docker-compose.scraper-test.yml
docker-compose.test.yml
enrichment_optimization.py
event_urls.csv
external_data_enricher.py
external_data_enricher_playwright.py
external_data_enricher_simplified.py
external_fight_enricher_playwright.py
external_fight_models.py
external_fight_scraper.py
fast_fight_stats_scraper.py
fast_profile_image_scraper.py
fighters_stats_interpolated.csv
get_events_to_predict.py
get_fight_ids.py
get_fight_ids_simple.py
get_fighter_stats.py
get_fighters.py
get_stats_from_fight_ids.py
init_db.sql
interpolate_fighter_stats_from_event_stats.py
models/__init__.py
models/external_fighter_data.py
requirements.txt
schema.prisma
scraper_workflow.py
scrapers/__init__.py
scrapers/base_fighter_scraper.py
scrapers/database_integration.py
scrapers/sherdog_fighter_scraper.py
scrapers/sherdog_fighter_scraper_playwright.py
startup.py
test_csv_fighters.py
test_docker_environment.py
test_image_logic.py
test_image_scraper.py
test_modern_fighters.py
test_output.csv
test_password_encoding_issue.py
test_prisma_docker.py
test_prisma_upsert.py
test_seeder_image_integration.py
test_seeder_with_images.py
test_tom_aspinall.py
test_upsert.py
test_url_parsing_edge_cases.py
tests/analyze_fighter_data_sparsity.py
tests/performance_benchmark_enrichment.py
todo
ufc_fighters.csv
ufc_fighters_stats.csv
ufc_fights_1271.csv
upcoming_events.csv
utils/__init__.py
utils/cached_http_client.py
utils/camelCaseToSnakeCase.py
utils/camel_case_to_snake_case.py
utils/cloudflare_http_client.py
utils/event_utils.py
utils/get_event_stats/get_match_results.py
utils/get_fighter_stats/parse_stats.py
utils/get_fighter_stats/parse_strike_by_target_svg.py
utils/get_fighter_stats/standardize.py
utils/name_matching.py
utils/parse_event_from_live_event_detail.py
utils/parse_name_string.py
utils/playwright_api_discovery.py
utils/playwright_http_client.py
utils/ufc_api_discovery.py
```

### README
(none / unreadable: 404)


---

## Cipher-Codex/mma-almanac-ai
- description: (none)
- topics: (none)
- default branch: main
- private: false
- languages: Python, Shell, Makefile, Dockerfile

### File tree (199 files)
```
.dockerignore
.env.example
.github/workflows/deploy.yml
.gitignore
ALL_PHASES_COMPLETE.md
API_DOCUMENTATION.md
ARCHITECTURE.md
CALL_GRAPH.json
COMPLETE_RETRAIN_FIXES.md
DATA_LEAKAGE_ANALYSIS_REPORT.md
DEBUGGING_MODEL_LOADING_ISSUE.md
DOCKER_DEPLOYMENT.md
DOCKER_README.md
DOCKER_SETUP_COMPLETE.md
Dockerfile
ENV_VARS.md
FEATURE_MISMATCH_FIX_COMPLETE.md
INVESTIGATION_SUMMARY.md
Makefile
PRODUCTION_DEPLOYMENT_GUIDE.md
TEST_4_BIAS_ANALYSIS_COMPLETE.md
WEEK_1_COMPLETE.md
WINPREDICTOR_API_FEATURE_MISMATCH_FIX.md
WINPREDICTOR_FEATURE_MISMATCH_FIX.md
XGBOOST_SAVE_LOAD_FIX.md
analyze_feature_importance.py
analyze_full_dataset.py
analyze_model_calibration.py
analyze_model_calibration_cv.py
analyze_prediction_distribution.py
analyze_round_distribution.py
apply_migration.py
async_train_diagnostics.md
benchmark_rematch_scenario.py
benchmark_web_search.py
calibrate_method_predictor.py
calibrate_round_predictor.py
calibrate_win_predictor.py
check_articles.py
check_corner_bias.py
check_corner_bias_v2.py
check_corner_mapping.py
check_event_status.py
check_fight_ordering.py
check_historical_corner_wins.py
check_metadata.py
check_method_columns.py
check_predictions.py
check_round5.py
check_rounds.py
check_schema.py
check_status.py
check_win_predictions.py
check_winner_features.py
cleanup_predictions.py
clear_prediction_features.py
clear_training_features.py
cli/__init__.py
cli/train_method_model.py
cli/train_round_model.py
cli/train_win_model.py
cli/tune_models.py
cols_debug.txt
compare_model_performance.py
config/seo_article_heuristics.json
config/seo_article_prompt.json
debug_fight_pairs.csv
debug_fighter_ordering.py
demo_improvements.py
diagnostic_output.txt
diagnostic_preprocessing_structure.py
diagnostic_preprocessing_structure.txt
diagnostic_tests.py
diagnostic_tests_method.py
docker-compose.yml
evaluation/method_predictor_evaluation_v2.py
evaluation/win_predictor_ensemble_evaluation.py
experiment_winner_signals.py
feature_importance_mi_scores.csv
feature_mismatch_diagnostics.md
fight_predictions_20251010_000133.csv
fight_predictions_20251010_000708.csv
fight_predictions_20251010_001015.csv
fight_predictions_20251010_001841.csv
fight_predictions_20251010_004526.csv
fight_predictions_20251010_004850.csv
fight_predictions_20251010_005106.csv
fight_predictions_20251010_131401.csv
fight_predictions_20251010_133153.csv
fight_predictions_20251010_133659.csv
final_bias_analysis.py
investigate_remaining_leakage.py
isolated_async_train_test.py
isolated_retrain_test.py
main.py
method_predictor_diagnostics.md
migrations/20251021193416_init/migration.sql
migrations/20251023162148_add_prediction_accuracy_history/migration.sql
migrations/20251030030055_add_external_organization_fields/migration.sql
migrations/migration_lock.toml
models/Articles/ArticleGenerator.py
models/Articles/ArticlePromptBuilder.py
models/Articles/__init__.py
models/BasePredictor.py
models/MethodPredictor/MethodPredictor.py
models/MethodPredictor/__init__.py
models/MethodPredictor/data_enrichment.py
models/MethodPredictor/engineer_features.py
models/MethodPredictor/feature_config.py
models/MethodPredictor/fighter_style_features.py
models/MethodPredictor/preprocess_features.py
models/RoundPredictor/RoundPredictor.py
models/RoundPredictor/__init__.py
models/RoundPredictor/data_enrichment.py
models/RoundPredictor/engineer_features.py
models/RoundPredictor/feature_config.py
models/RoundPredictor/preprocess_features.py
models/WinPredictor/WinPredictor.py
models/WinPredictor/__init__.py
models/WinPredictor/cumulative_stats_calculator.py
models/WinPredictor/data_enrichment.py
models/WinPredictor/engineer_features.py
models/WinPredictor/feature_config.py
models/WinPredictor/fight_pair_builder.py
models/WinPredictor/preprocess_features.py
models/WinPredictor/win_predictor_model.joblib
models/WinPredictor/win_predictor_model.metadata.joblib
models/WinPredictor/win_predictor_model.xgb
models/__init__.py
models/constants.py
models/select_important_features.py
models/shared/__init__.py
models/shared/web_search_features.py
prisma/migrations/20251022223015_create_prediction_accuracy_history_table/migration.sql
prisma/migrations/20251109012426_add_external_organization_fields/migration.sql
prisma/migrations/20251109104827_make_prediction_fields_nullable/migration.sql
pyproject.toml
quick_check.py
quick_tune.py
regenerate_predictions.py
requirements.txt
retrain_and_tune.py
retrain_method_manual.py
retrain_model.py
retrain_win_predictor.py
schema.prisma
scripts/analyze_retrain_logs.py
scripts/check_now_simple.py
scripts/check_retrain_now.py
scripts/clear_prediction_features.py
scripts/debug_archive.py
scripts/monitor_retrain.py
scripts/monitor_retrain_logs.py
scripts/monitor_to_file.py
scripts/regenerate_missing_articles.py
scripts/retrain_all.sh
scripts/tune_all.sh
scripts/verify_efs_models.py
scripts/verify_efs_models.sh
scripts/verify_schema.py
show_training_distribution.py
simple_tune.py
start-api.sh
task-definition.json
tasks/__init__.py
tasks/retrain.py
tasks/tune.py
tasks/utils.py
test_1_feature_leakage.py
test_1_feature_leakage_report.txt
test_2_temporal_leakage.py
test_2_temporal_leakage_report.txt
test_3_position_bias.py
test_3_position_bias_report.txt
test_4_prediction_bias.py
test_4_prediction_bias_report.txt
test_fight_id_fix.py
test_method_predictor.py
test_retraining.py
test_round_predict_only.py
test_round_predictor.py
test_win_predictor.py
tests/__init__.py
tests/integration/__init__.py
tests/unit/__init__.py
utils/__init__.py
utils/markdown_processor.py
utils/openai_client.py
utils/parsers/__init__.py
utils/parsers/betting_odds_parser.py
utils/parsers/fighter_stats_parser.py
utils/parsers/injury_parser.py
utils/seo_metadata.py
utils/web_search_client.py
validate_win_predictor.py
validation_cumulative_stats.py
validation_cumulative_stats.txt
validation_fight_pair_builder.py
validation_fight_pair_builder.txt
```

### README
(none / unreadable: 404)


---

## Cipher-Codex/mma-almanac-ui
- description: (none)
- topics: (none)
- default branch: master
- private: false
- languages: TypeScript, CSS, Shell, Dockerfile, JavaScript

### File tree (252 files)
```
.dockerignore
.github/workflows/deploy.yml
.gitignore
AUTH_ARCHITECTURE_COMPLETE.md
DEPLOYMENT.md
Dockerfile
PREDICTIONS_README.md
README.md
UX_Design_Analysis.md
UX_Design_Principles.md
__tests__/sanitizeHTML.test.ts
configure-database-secret.sh
docker-compose.yml
hooks/useIntersectionObserver.ts
hooks/useIsMobile.ts
hooks/useResizeObserver.ts
hooks/useResponsiveImageOffset.ts
hooks/useSectionScroll.ts
jest.config.js
jest.setup.js
next.config.ts
package-lock.json
package.json
postcss.config.mjs
prisma/all_fight_stats.csv
prisma/fighters_stats_interpolated.csv
prisma/migrations/20250915030429_init/migration.sql
prisma/migrations/migration_lock.toml
prisma/schema.prisma
prisma/seed.ts
public/Icons/avgFightTime.svg
public/Icons/sigStrikesAbsorbedPerMin.svg
public/Icons/sigStrikesPerMin.svg
public/Icons/submissionAvg.svg
public/Icons/takedownAvgPer15min.svg
public/Icons/takedownDefense.svg
public/abstract-cubes-2-secondary.png
public/abstract-cubes-2.png
public/abstract-cubes.png
public/android-chrome-192x192.png
public/android-chrome-512x512.png
public/apple-touch-icon.png
public/cipher-codex-logo.png
public/default_fighter.png
public/favicon-16x16.png
public/favicon-32x32.png
public/favicon.svg
public/file.svg
public/globe.svg
public/logo.png
public/logo.svg
public/next.svg
public/vercel.svg
public/window.svg
src/app/accuracy/components/AccuracyChart.tsx
src/app/accuracy/components/AccuracyMetricsGrid.tsx
src/app/accuracy/components/AccuracyTable.tsx
src/app/accuracy/components/MetricCard.tsx
src/app/accuracy/components/RecentFightComparisons.tsx
src/app/accuracy/lib/getAccuracyMetrics.ts
src/app/accuracy/lib/mockAccuracyData.ts
src/app/accuracy/lib/types.ts
src/app/accuracy/page.tsx
src/app/api/auth/[...nextauth]/route.ts
src/app/api/user/deletion/callback/route.ts
src/app/api/user/deletion/status/route.ts
src/app/api/user/link-account/route.ts
src/app/api/user/preferences/route.ts
src/app/api/user/profile/route.ts
src/app/api/user/request-deletion/route.ts
src/app/api/user/track-read/route.ts
src/app/articles/[fightId]/loading.tsx
src/app/articles/[fightId]/page.tsx
src/app/articles/components/ArticleCTA.tsx
src/app/articles/components/ArticleCard.tsx
src/app/articles/components/ArticleContent.tsx
src/app/articles/components/ArticleHeader.tsx
src/app/articles/components/ArticleReadTracker.tsx
src/app/articles/components/FighterImage.tsx
src/app/articles/components/Pagination.tsx
src/app/articles/components/SearchBar.tsx
src/app/articles/lib/getArticle.ts
src/app/articles/lib/getFighterImages.ts
src/app/articles/lib/getRelatedArticles.ts
src/app/articles/lib/sanitizeHTML.ts
src/app/articles/loading.tsx
src/app/articles/page.tsx
src/app/data-deletion-instructions/page.tsx
src/app/favicon.ico
src/app/globals.css
src/app/health/route.ts
src/app/layout.tsx
src/app/loading.tsx
src/app/login/SignInButtons.tsx
src/app/login/page.tsx
src/app/not-found-back-button.tsx
src/app/not-found.tsx
src/app/page.tsx
src/app/predictions/[fightId]/components/FightAnalyticsHeader.tsx
src/app/predictions/[fightId]/components/FightPredictionSection.tsx
src/app/predictions/[fightId]/components/HeadToHeadComparison.tsx
src/app/predictions/[fightId]/components/PerformanceComparisonCharts.tsx
src/app/predictions/[fightId]/components/PerformanceTimeline.tsx
src/app/predictions/[fightId]/components/StatsGrid.tsx
src/app/predictions/[fightId]/components/WinMethodHeatmap.tsx
src/app/predictions/[fightId]/error.tsx
src/app/predictions/[fightId]/loading.tsx
src/app/predictions/[fightId]/page.tsx
src/app/predictions/components/BlurredPredictionsPlaceholder.tsx
src/app/predictions/components/ClickableWrapper.tsx
src/app/predictions/components/ClientPredictionsWrapper.tsx
src/app/predictions/components/FightCard.tsx
src/app/predictions/components/LockedPredictionCard.tsx
src/app/predictions/components/PredictionsSearchBar.tsx
src/app/predictions/error.tsx
src/app/predictions/loading.tsx
src/app/predictions/page.tsx
src/app/privacy/page.tsx
src/app/profile/layout.tsx
src/app/profile/page.tsx
src/app/sitemap.ts
src/app/terms/page.tsx
src/components/Examples/RealisticStatsComparison.tsx
src/components/FightPrediction/FightPrediction.tsx
src/components/FightPrediction/FightPredictionStatic.tsx
src/components/FightPrediction/Fighter.tsx
src/components/FightPrediction/index.tsx
src/components/Footer/Footer.tsx
src/components/Footer/index.ts
src/components/Icons/avgFightTime.tsx
src/components/Icons/sigStrikesAbsorbedPerMin.tsx
src/components/Icons/sigStrikesPerMin.tsx
src/components/Icons/submissionAvg.tsx
src/components/Icons/takedownAvgPer15min.tsx
src/components/Icons/takedownDefense.tsx
src/components/LinearLoader.tsx
src/components/LoadingLink.tsx
src/components/MetricCardContainer/MetricCardContainer.tsx
src/components/MetricCardContainer/index.ts
src/components/Nav/AuthButtons.tsx
src/components/Nav/LogoText.tsx
src/components/Nav/MobileMenu.tsx
src/components/Nav/MobileMenuWrapper.tsx
src/components/Nav/Nav.tsx
src/components/Nav/index.ts
src/components/NavigationLoader.tsx
src/components/PredictionChip/PredictionChip.tsx
src/components/Sections/Home/FighterKeyStats.tsx
src/components/Sections/Home/Home.tsx
src/components/Sections/Home/components/CTA.tsx
src/components/Sections/Home/components/GrapplingStatsChart.tsx
src/components/Sections/Home/components/GroundGameStatsChart.tsx
src/components/Sections/Home/components/Hero.tsx
src/components/Sections/Home/components/StrikingStatsChart.tsx
src/components/Sections/Home/components/TopStatsCard.tsx
src/components/Sections/Home/index.ts
src/components/Skeletons/NavSkeleton.tsx
src/components/Skeletons/SkeletonCard.tsx
src/components/Skeletons/index.ts
src/components/StatChip/StatChip.tsx
src/components/StatChip/index.ts
src/components/Tooltip/Tooltip.tsx
src/components/Tooltip/index.ts
src/components/Visualizations/DualBarChart/DualBarChart.tsx
src/components/Visualizations/DualBarChart/Legend.tsx
src/components/Visualizations/DualBarChart/index.ts
src/components/Visualizations/IndividualScaleChart/IndividualScaleChart.tsx
src/components/Visualizations/SimpleHorizontalChart/SimpleHorizontalChart.tsx
src/components/Visualizations/StatChipDisplay/StatChipDisplay.tsx
src/components/Visualizations/StatChipDisplay/index.ts
src/components/charts/DualFighterComparisonChart.tsx
src/components/charts/FighterPerformanceTimeline.tsx
src/components/insights/FighterInsightsSummary.tsx
src/components/user/DataDeletionTimeline.tsx
src/components/user/DeletionInstructionsCard.tsx
src/components/user/DeletionRequestModal.tsx
src/components/user/LinkedAccountsList.tsx
src/components/user/ProfileCard.tsx
src/components/user/ReadingStats.tsx
src/components/user/SettingsPanel.tsx
src/constants/ui.ts
src/contexts/LoadingContext.tsx
src/contexts/MenuContext.tsx
src/hooks/useApiRequest.ts
src/hooks/useDebounce.ts
src/lib/articles.ts
src/lib/auth/authOptions.ts
src/lib/auth/index.ts
src/lib/auth/session.ts
src/lib/date-utils.ts
src/lib/fight-utils.ts
src/lib/fighterPerformance.ts
src/lib/formatters/predictions.ts
src/lib/matchFightersToPrediction.ts
src/lib/number-utils.ts
src/lib/predictions.ts
src/lib/prisma-predictions.ts
src/mockData/fighPredictionHeroMock.ts
src/prisma.ts
src/server/auth-policy.ts
src/server/predictions.ts
src/types/article.ts
src/types/next-auth.d.ts
src/types/pagination.ts
src/types/prediction.ts
src/types/types.d.ts
src/ui/Br/Break.tsx
src/ui/Br/index.ts
src/ui/Button/Button.tsx
src/ui/Button/CloseButton.tsx
src/ui/Button/index.tsx
src/ui/Button/types.d.ts
src/ui/Card/Card.tsx
src/ui/Card/index.ts
src/ui/Card/types.d.ts
src/ui/Chip/Chip.tsx
src/ui/Chip/index.ts
src/ui/Divider/Divider.tsx
src/ui/Divider/index.ts
src/ui/FlipCard/FlipCard.tsx
src/ui/FlipCard/index.ts
src/ui/FlipCard/types.d.ts
src/ui/HStack/HStack.tsx
src/ui/HStack/MotionHStack.tsx.disabled
src/ui/HStack/index.ts
src/ui/PreviousNextControls/PreviousNextControls.tsx
src/ui/PreviousNextControls/icons/LeftArrow.tsx
src/ui/PreviousNextControls/icons/RightArrow.tsx
src/ui/PreviousNextControls/index.ts
src/ui/PreviousNextControls/types.d.ts
src/ui/Scaler/Scaler.tsx
src/ui/Scaler/index.ts
src/ui/SearchInput/SearchInput.tsx
src/ui/SearchInput/index.ts
src/ui/SearchResultsPortal/SearchResultsPortal.tsx
src/ui/SearchResultsPortal/index.ts
src/ui/Section/Section.tsx
src/ui/Section/index.ts
src/ui/Typography/MotionTypography.tsx.disabled
src/ui/Typography/Typography.tsx
src/ui/Typography/index.ts
src/ui/Typography/types.d.ts
src/ui/VStack/MotionVStack.tsx.disabled
src/ui/VStack/VStack.tsx
src/ui/VStack/index.ts
src/utils/chartHelpers.ts
src/utils/computePhysicalDominanceScore.ts
src/utils/dateUtils.ts
src/utils/textTruncation.ts
start.sh
task-definition.json
tsconfig.json
```

### README
```md
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
#   N e x t J S   D e p l o y m e n t   T e s t  
 #   P o s t g r e S Q L   h e a l t h   c h e c k   f i x e d   -   0 9 / 1 7 / 2 0 2 5   1 0 : 5 9 : 0 5  
 
```


---

## Cipher-Codex/mma-almanac-aws
- description: (none)
- topics: (none)
- default branch: master
- private: false
- languages: HCL, Python, Shell

### File tree (60 files)
```
.gitignore
ARCHITECTURE_GRAPH.json
README.md
app/.gitignore
app/README.md
app/SCHEDULED_TASKS_README.md
app/SCHEDULE_REFERENCE.md
app/SCHEDULING_IMPLEMENTATION.md
app/cloudwatch-alarms.tf
app/cloudwatch-logs.tf
app/ecr.tf
app/ecs-cluster.tf
app/ecs-scheduled-tasks.tf
app/ecs-services.tf
app/ecs-task-definitions.tf
app/ecs.tf
app/efs.tf
app/eventbridge-ml-workflows.tf
app/iam.tf
app/lambda-ecs-task-trigger.tf
app/lambda-functions/ecs-task-trigger.zip
app/lambda-functions/ecs_task_trigger.py
app/lambda-tune-trigger.tf
app/load-balancer.tf
app/main.tf
app/outputs.tf
app/route53.tf
app/scripts/deploy.sh
app/secrets-manager.tf
app/security-groups.tf
app/task-definitions/api-task-definition.json
app/task-definitions/nextjs-task-definition.json
app/task-definitions/postgres-task-definition.json
app/task-definitions/scraper-task-definition.json
app/variables.tf
app/vpc-endpoints.tf
ecr/ecr.tf
ecr/iam.tf
ecr/outputs.tf
github-actions-oidc/iam.tf
github-actions-oidc/locals.tf
github-actions-oidc/main.tf
github-actions-oidc/outputs.tf
github-actions-oidc/variables.tf
main.tf
networking/data.tf
networking/elastic_ips.tf
networking/endpoints.tf
networking/internet_gateway.tf
networking/locals.tf
networking/nat_gateway.tf
networking/outputs.tf
networking/route_table_associations.tf
networking/route_tables.tf
networking/subnets.tf
networking/variables.tf
networking/vpc.tf
outputs.tf
terraform.tfvars.example
variables.tf
```

### README
```md
# MMA Almanac AWS Infrastructure

This repository contains the complete Terraform configuration for deploying the MMA Almanac application on AWS using ECS Fargate.

## Architecture Overview

```
Internet → ALB (Public Subnets) → NextJS (Private Subnets) → PostgreSQL (Private Subnets)
                                                          ↘ Scheduled Scrapers (Private Subnets)
```

## Components

- **Networking**: VPC, subnets, NAT gateways, VPC endpoints
- **ECS**: Fargate cluster with NextJS, PostgreSQL, and scraper services
- **ALB**: Application Load Balancer for public traffic
- **Secrets Manager**: Secure credential storage
- **EventBridge**: Scheduled scraper tasks
- **CloudWatch**: Logging and monitoring

## Prerequisites

1. **AWS CLI** configured with appropriate permissions
2. **Terraform** >= 1.0
3. **Docker** for building container images
4. **Domain name** (optional, for SSL/DNS)

## Quick Start

### 1. Clone and Configure

```bash
git clone <repository-url>
cd mma-almanac-aws

# Copy and edit variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
```

### 2. Deploy Infrastructure

```bash
terraform init
terraform plan
terraform apply
```

### 3. Get Application URL

```bash
terraform output application_url
```

## Required Variables

Create a `terraform.tfvars` file with these values:

```hcl
# Database credentials
postgres_user     = "your-username"
postgres_password = "your-secure-password"
```

## Container Images

### PostgreSQL

- Uses public `postgres:15-alpine` image
- No ECR repository needed
- Credentials managed via Secrets Manager

### NextJS & Scraper

- **ECR repositories created automatically** by Terraform
- Build and push your images after deployment:

```bash
# Get ECR repository URLs from Terraform outputs
NEXTJS_ECR_URL=$(terraform output -raw nextjs_ecr_repository_url)
SCRAPER_ECR_URL=$(terraform output -raw scraper_ecr_repository_url)

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $NEXTJS_ECR_URL

# Build and push NextJS image
docker build -t mma-almanac-ui ./mma-almanac-ui
docker tag mma-almanac-ui:latest $NEXTJS_ECR_URL:latest
docker push $NEXTJS_ECR_URL:latest

# Build and push Scraper image
docker build -t mma-almanac-scraper ./mma-almanac-scrapers
docker tag mma-almanac-scraper:latest $SCRAPER_ECR_URL:latest
docker push $SCRAPER_ECR_URL:latest
```

## CI/CD Integration

Task definitions are stored as JSON templates for easy CI/CD updates:

```bash
# Update task definitions with new images
./app/scripts/deploy.sh
```

See `app/README.md` for detailed CI/CD documentation.

## Security Features

- All application containers in private subnets
- Secrets managed via AWS Secrets Manager
- VPC endpoints reduce internet traffic costs
- Security groups follow least-privilege principles
- PostgreSQL isolated from internet access

## Cost Optimization

- **Fargate Spot**: Consider for non-critical workloads
- **VPC Endpoints**: Reduce NAT Gateway costs
- **CloudWatch Logs**: 7-day retention by default
- **Scheduled Tasks**: Scraper runs on schedule, not continuously

## Monitoring

- CloudWatch logs for all containers
- ECS service health checks
- ALB health checks with automatic failover

## Module Structure

```
├── main.tf                    # Root module orchestration
├── variables.tf               # Root-level variables
├── outputs.tf                 # Root-level outputs
├── networking/                # VPC, subnets, routing
└── app/                      # ECS, ALB, services
    ├── task-definitions/      # JSON templates
    ├── generated-task-definitions/  # Terraform-generated
    └── scripts/              # Deployment automation
```

## Deployment Guide

### Initial Deployment

1. Configure AWS credentials
2. Create ECR repositories
3. Build and push container images
4. Set terraform.tfvars
5. Run `terraform apply`

### Updates

- **Infrastructure changes**: Use Terraform
- **Container updates**: Use CI/CD scripts
- **Database changes**: Handle via application migrations

## Troubleshooting

### Common Issues

**Task Definition Registration Fails**

- Verify ECR repositories exist
- Check IAM permissions
- Validate JSON syntax

**Service Won't Start**

- Check security groups
- Verify subnet routing
- Review CloudWatch logs

**Database Connection Issues**

- Confirm service discovery is working
- Check PostgreSQL container logs
- Verify Secrets Manager access

### Useful Commands

```bash
# Check ECS service status
aws ecs describe-services --cluster mma-almanac-cluster --services mma-almanac-nextjs

# View container logs
aws logs tail /ecs/mma-almanac-nextjs --follow

# Check ALB health
aws elbv2 describe-target-health --target-group-arn <target-group-arn>
```

## Production Considerations

- **SSL Certificate**: Add ACM certificate to ALB
- **Domain**: Configure Route53 for custom domain
- **Backup**: Set up RDS automated backups if migrating from container PostgreSQL
- **Monitoring**: Add CloudWatch alarms
- **Auto Scaling**: Configure ECS service auto scaling

## Support

For issues and questions, check the troubleshooting section or review CloudWatch logs for detailed error information.

```
