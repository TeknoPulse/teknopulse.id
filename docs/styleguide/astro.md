# Astro Style Guide: TeknoPulse

## File Organization

```
src/
├── components/       # Reusable UI components (PascalCase.astro)
├── content/          # Content collections (posts/*.md)
├── layouts/          # Page layouts (Layout.astro wraps all pages)
├── pages/            # Route pages (file-based routing)
├── styles/           # Global styles
└── utils/            # TypeScript utility functions
```

## Component Conventions

### Naming

- Component files: **PascalCase** (`PostCard.astro`, `CategoryBadge.astro`)
- Layout files: **PascalCase** (`Layout.astro`)
- Page files: **lowercase/kebab** matching the URL slug

### Structure

```astro
---
// 1. Imports
import type { CollectionEntry } from 'astro:content';
import { Image } from 'astro:assets';

// 2. Props interface
interface Props {
  post: CollectionEntry<'posts'>;
  showSummary?: boolean;
}

// 3. Props destructuring
const { post, showSummary = true } = Astro.props;

// 4. Data processing
const { title, summary, category } = post.data;
---

<!-- 5. Template -->
<article class="post-card">
  <h2>{title}</h2>
  {showSummary && <p>{summary}</p>}
</article>
```

### Props

- Always define a `Props` interface in the frontmatter
- Use default values via destructuring, not conditional logic in the template
- Keep props minimal — pass only what the component needs

## Layout Pattern

- `Layout.astro` wraps every page: `Header` + `Breadcrumbs` + `<slot/>` + `Footer`
- Sets `<html lang="id">` and injects `Seo` component
- All pages must use this layout

## Page Patterns

### Dynamic Routes

- Use `[...page].astro` for paginated routes
- Use `getStaticPaths()` for all dynamic content
- Remember: static output only — no SSR

### Content Queries

```astro
---
import { getCollection } from 'astro:content';

const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
  (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
);
---
```

- Always filter out `draft: true` posts
- Sort newest-first unless specifically otherwise

## React Islands

- Use React **only** for components requiring client-side interactivity
- Always specify a `client:*` directive (`client:load`, `client:visible`, `client:idle`)
- Prefer `client:visible` or `client:idle` for below-fold content
- Keep React components minimal — data fetching stays in Astro

## Generated Routes (Do Not Hand-Edit)

These routes auto-regenerate on every build from the `posts` collection:

- `rss.xml.ts`, `feed.json.ts`
- `news-sitemap.xml.ts`
- `llms-full.txt.ts`
- `og/[slug].png.ts`

Edit the source post instead, never the generated output.

## Images

- Cover images live in `src/assets/images/`
- Reference via Astro's `image()` helper in frontmatter schema
- Use `<Image>` component for optimized output
- Many filenames begin with `=` (legacy artifact) — leave them unless asked to clean up
