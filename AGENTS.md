# AGENTS.md

Workspace instructions for ZCode agents working in this repo.

## What this is

TeknoPulse — a production Tech & AI news site (Indonesian locale, `id-ID`) built with **Astro v5 + TypeScript + Tailwind v3 + pnpm**. Content lives in Astro Content Collections as Markdown. Output is **static only** (`dist/`) deployed to **Cloudflare Pages**.

## Commands

| Task | Command |
| --- | --- |
| Dev server | `pnpm dev` |
| Production build | `pnpm build` |
| Preview built site | `pnpm preview` |
| Lint (eslint + prettier --check) | `pnpm lint` |
| Fix lint | `pnpm lint:fix` |
| New post scaffold | `pnpm post:new "Title"` |

There is **no test framework** and **no separate typecheck script** — type errors surface via `astro check`/`astro build`. `pnpm build` is the canonical correctness gate.

Build pipeline: `astro build` → `postbuild` runs `pagefind --site dist --output-path dist/pagefind` to generate the client-side search index. Do not remove `pagefind` from `vite.optimizeDeps.exclude` in `astro.config.mjs` — it must stay unbundled.

## Architecture & critical constraints

### Static output is mandatory (Cloudflare migration, 2026-07-04)
This site is **static-output only**. SSR was intentionally dropped:
- `@resvg/resvg-js` (native Rust renderer behind `/og/<slug>.png`) cannot run on Cloudflare's V8 Workers, and Vite can't bundle the `.node` addon into a server entry.
- OG images are therefore **prerendered at build time** via `getStaticPaths` in `src/pages/og/[slug].png.ts`. `resvg` runs only under Node during `astro build`; the emitted PNGs are served as static files.
- **Do not re-enable SSR / `@astrojs/vercel` adapter / on-demand OG generation** without solving the native-addon-on-Workers problem. Static is a hard constraint.
- `vercel.json` still exists for header/rewrite config but the deploy target is Cloudflare Pages (output dir `dist`).

### Content layer
- Posts: `src/content/posts/*.md`, schema in `src/content/config.ts`.
- `category` is a **fixed enum**: `AI | Cloud | Security | DevTools | Policy`. To add a category you must update **both** the Zod schema and `src/utils/categories.ts` (slug, colors, description) — they must stay in sync.
- `draft: true` posts are excluded from builds, RSS, feeds, sitemaps, OG generation, and `llms-full.txt`. Set `draft: false` to publish.
- Slug is derived from the filename; `slug` frontmatter is optional.
- Cover images live in `src/assets/images/` and are referenced via Astro's `image()` helper. Many filenames begin with `=` (an artifact of a past slugifying bug) — leave them unless explicitly asked to clean up.

### Self-maintaining generated routes
`src/pages/rss.xml.ts`, `feed.json.ts`, `news-sitemap.xml.ts`, `llms-full.txt.ts`, and `og/[slug].png.ts` all read the `posts` collection, drop drafts, sort newest-first, and regenerate on every build. **Never hand-edit their output**; edit the source post instead. The curated `public/llms.txt` is hand-maintained and separate from the generated `llms-full.txt`.

### Page structure
- `src/layouts/Layout.astro` wraps every page (`Header` + `Breadcrumbs` + `<slot/>` + `Footer`), sets `<html lang="id">`, and injects `Seo`.
- Dynamic routes use `[...page].astro` for pagination (e.g. `category/[category]/[...page].astro`, `tags/[tag]/[...page].astro`).

## Conventions

- **Prettier**: single quotes, semicolons, 2-space indent, `printWidth: 100`, ES5 trailing commas, Tailwind class sorting + Astro plugin. Run `pnpm lint:fix` before committing.
- **ESLint**: unused vars/args must be prefixed with `_`. `@typescript-eslint/no-explicit-any` is `warn` (allowed but discouraged).
- **TypeScript**: extends `astro/tsconfigs/strict`. Treat strict errors as real.
- **Styling**: Tailwind v3 with `@tailwindcss/typography`. Brand palette and dark-mode tokens are defined in `tailwind.config.cjs`; category colors come from `src/utils/categories.ts` (HSL values). Prefer existing tokens over one-off colors.
- **Commit messages**: conventional commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`).
- Default branch is `main`. Branch before committing when asked to commit.

## Config touchpoints
- Site name/URL/locale/socials: `src/config.ts` (canonical `site.url` is `https://teknopulse.id`).
- Categories: `src/utils/categories.ts`.
- Reading-time calc: `src/utils/readingTime.ts` (200 wpm).

## Docs to read before sensitive changes
- `README.md` — feature list, content workflow, post frontmatter reference.
- `DEPLOYMENT.md` — deploy steps (note: written for Vercel; current target is Cloudflare Pages).
- `CONTRIBUTING.md` — branch/commit workflow.
- Comment block at top of `astro.config.mjs` and `src/pages/og/[slug].png.ts` — explains the static/OG constraint in detail.
