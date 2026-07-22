# Tech Stack: TeknoPulse

## Core Framework

| Component       | Technology | Version  | Notes                                     |
| --------------- | ---------- | -------- | ----------------------------------------- |
| Framework       | Astro      | v5.13.9  | Static site generator; zero JS by default |
| Language        | TypeScript | Strict   | Extends `astro/tsconfigs/strict`          |
| Package Manager | pnpm       | v10.15   | Workspace-aware, fast, disk-efficient     |
| Node.js         | Node.js    | ≥ 18.0.0 | Runtime requirement                       |

## Frontend

| Component         | Technology              | Version           | Notes                                                   |
| ----------------- | ----------------------- | ----------------- | ------------------------------------------------------- |
| Styling           | Tailwind CSS            | v3.x              | Utility-first CSS with `class` dark mode                |
| Typography Plugin | @tailwindcss/typography | v0.5.x            | Prose styling for Markdown content                      |
| UI Islands        | React                   | v19.1             | Via `@astrojs/react`; used for interactive islands only |
| Fonts             | Inter                   | @fontsource/inter | Self-hosted, no external font requests                  |

## Content & Search

| Component      | Technology                | Notes                                                    |
| -------------- | ------------------------- | -------------------------------------------------------- |
| Content System | Astro Content Collections | Markdown files with Zod schema validation                |
| Schema         | Zod                       | Enforces frontmatter types (title, category, tags, etc.) |
| Search         | Pagefind                  | v1.3 — client-side search; index built postbuild         |
| Comments       | Giscus                    | GitHub Discussions-backed; lazy-loaded                   |

## Build & Tooling

| Component        | Technology               | Notes                                                       |
| ---------------- | ------------------------ | ----------------------------------------------------------- |
| Linting          | ESLint v9                | With `astro-eslint-parser`, `@typescript-eslint`            |
| Formatting       | Prettier v3              | With `prettier-plugin-astro`, `prettier-plugin-tailwindcss` |
| Image Processing | Sharp                    | v0.35 — build-time image optimization                       |
| OG Images        | Satori + @resvg/resvg-js | Prerendered per-post at build time via `getStaticPaths`     |
| Sitemap          | @astrojs/sitemap         | Auto-generated XML sitemap                                  |
| RSS              | @astrojs/rss             | RSS + JSON feed generation                                  |

## Deployment

| Component     | Technology       | Notes                                                                |
| ------------- | ---------------- | -------------------------------------------------------------------- |
| Host          | Cloudflare Pages | Static `dist/` directory deployment                                  |
| Output Mode   | Static only      | **No SSR** — `@resvg/resvg-js` native addon cannot run on CF Workers |
| Build Command | `pnpm build`     | Astro build + Pagefind index generation (postbuild)                  |
| Preview       | `pnpm preview`   | Local preview of production build                                    |

## Architecture Constraints

1. **Static output is mandatory** — SSR was intentionally dropped for the Cloudflare migration (2026-07-04). The native Rust renderer (`@resvg/resvg-js`) cannot run on Cloudflare's V8 Workers runtime.
2. **OG images are prerendered** — Generated at build time via `getStaticPaths` in `src/pages/og/[slug].png.ts`. No on-demand generation.
3. **Pagefind must stay unbundled** — Do not remove `pagefind` from `vite.optimizeDeps.exclude` in `astro.config.mjs`.
4. **Category enum is fixed** — Currently `AI | Cloud | Security | DevTools | Policy`. Changes require updating both the Zod schema and `src/utils/categories.ts`.
