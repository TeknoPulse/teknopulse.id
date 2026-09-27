# Domain Model: TeknoPulse

## Core Concepts

### Analytics Consent State

The user's decision about Google Analytics 4 (GA4) tracking. One of three values:

- **`granted`** — User explicitly accepted GA4 via "Setuju" button or privacy policy toggle. GA4 script loads immediately; `_ga` cookie is placed.
- **`denied`** — User explicitly declined GA4 via privacy policy toggle. GA4 script never loads; no cookies placed.
- **`deferred`** — User dismissed the consent banner without deciding (clicked [×] close). GA4 script does not load. User will be re-prompted daily for 3 days, then after 30-day silence, the cycle repeats.

**Storage:** Persisted in `localStorage` under key `teknopulse-consent-ga4`.

**Default state:** `deferred` (if no localStorage entry exists, user has not made a decision).

**State transitions:**

```
[first visit] → deferred
deferred + "Setuju" click → granted
deferred + privacy policy toggle ON → granted
granted + privacy policy toggle OFF → denied
denied + privacy policy toggle ON → granted
```

**Why it matters:**
- The AI agent (already running) pulls GA4 data via Google Analytics Data API to improve SEO and content strategy.
- Low opt-in rates reduce the AI agent's effectiveness.
- UU PDP No. 27/2022 requires explicit consent for cookies that process personal data.

**Related decisions:**
- See ADR 0001: Soft Consent Banner with Daily Re-Prompt
- Implementation: `src/components/CookieConsent.astro`
- Privacy policy: `/privacy-policy` (includes toggle to change consent state)

---

## Glossary

### Post
A content article stored as Markdown in `src/content/posts/*.md`. Each post has frontmatter (title, summary, category, tags, author, cover image, etc.) and body content. Posts are the primary content type on TeknoPulse.

### Category
A fixed classification for posts. One of: `AI | Software | Developer | Automation | Experiments | Insights`. Defined in `src/content/config.ts` (Zod schema) and `src/utils/categories.ts` (slug, colors, descriptions). Category determines URL structure (`/category/<slug>`), badge colors, and content grouping.

### Draft
A post with `draft: true` in frontmatter. Drafts are excluded from builds, RSS feeds, sitemaps, OG image generation, and `llms-full.txt`. Setting `draft: false` publishes the post.

### Cover Image
A 1280×720 PNG image in `src/assets/images/` referenced by `coverImage` frontmatter. Must be unique per article (checked by filename and md5 hash). Used as the hero image on article pages and fallback for `og:image` (unless `ogImage` frontmatter overrides it or the file is shared by multiple posts, in which case the generated OG card is used).

### OG Image
Open Graph image for social media previews. Either:
1. `ogImage` frontmatter (custom image, must be unique per article)
2. `coverImage` (if unique to this article)
3. `/og/<slug>.png` (generated card via Satori, 1200×675, used when cover is shared by ≥2 posts)

### Slug
The URL identifier for a post, derived from the filename. For new posts: undated slugs (`/posts/<slug>/`). Legacy posts use dated filenames (`2026-08-25-title.md`) and keep their dated slugs for backward compatibility. Never rename dated post files without adding a 301 redirect in `public/_redirects`.

### Author
A byline entity defined in `src/utils/authors.ts`. Links to `/authors/<slug>/` (profile page with Person JSON-LD). The `author` frontmatter field must match a key in `authors.ts`.

---

## Rules

### Content Publishing
- Every non-draft post must have a `coverImage` (PNG 1280×720, unique per article).
- `metaDescription` frontmatter is required (120–155 chars, manually written for SEO, not auto-extracted).
- `category` must be one of the fixed enum values (synced between Zod schema and `categories.ts`).
- Post bodies must NOT start with `# Title` (would create duplicate H1; the rehype plugin drops or demotes it).

### SEO
- Exactly one H1 per article page (enforced by `src/utils/rehype-unique-h1.js`).
- `faq` frontmatter (2–4 Q&A) generates `FAQPage` JSON-LD.
- `updatedAt` frontmatter updates `dateModified` in Article JSON-LD.

### Static Output
- Site is **static only** (`output: 'static'` in Astro config). No SSR.
- OG images are prerendered at build time via `getStaticPaths` (native Rust renderer `@resvg/resvg-js` cannot run on Cloudflare Workers).
- Never re-enable SSR without solving the native-addon-on-Workers problem.

### Analytics
- Cloudflare Web Analytics: always active, cookieless, no consent required.
- Google Analytics 4: requires consent (see "Analytics Consent State" above).

---

## Architecture

### Content Collections
- Schema: `src/content/config.ts` (Zod validation)
- Posts: `src/content/posts/*.md`
- Categories: `src/utils/categories.ts` (must stay in sync with Zod enum)

### Routes
- Self-maintaining: `rss.xml.ts`, `feed.json.ts`, `news-sitemap.xml.ts`, `llms-full.txt.ts`, `og/[slug].png.ts` regenerate on every build. Never hand-edit their output.
- Dynamic pagination: `[...page].astro` for category and tag listing pages.

### Build Pipeline
1. `pnpm build` → runs `astro build`
2. **prebuild**: `scripts/seo-check.mjs` (advisory warnings, non-blocking)
3. **postbuild**: `pagefind --site dist --output-path dist/pagefind` (client-side search index)

### Deployment
- Target: Cloudflare Pages (static `dist/` directory)
- CDN: Cloudflare (headers/rewrites via `public/_headers` and `public/_redirects`)
