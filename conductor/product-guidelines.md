# Product Guidelines: TeknoPulse

## 1. Visual Identity & Branding

### Color Palette

TeknoPulse uses a **Warm & Bold** editorial palette that evokes trust, energy, and editorial authority.

| Token             | Value                                 | Usage                                |
| ----------------- | ------------------------------------- | ------------------------------------ |
| `primary`         | Warm orange (`hsl(24, 90%, 55%)`)     | CTAs, active states, brand accent    |
| `primary-hover`   | Deep orange (`hsl(24, 90%, 45%)`)     | Hover/pressed states                 |
| `secondary`       | Warm amber (`hsl(38, 85%, 50%)`)      | Supporting highlights, badges        |
| `accent`          | Terracotta (`hsl(12, 75%, 55%)`)      | Editorial callouts, featured content |
| `background`      | Warm off-white (`hsl(30, 20%, 97%)`)  | Page background (light mode)         |
| `background-dark` | Deep warm gray (`hsl(25, 15%, 10%)`)  | Page background (dark mode)          |
| `surface`         | White                                 | Card surfaces (light mode)           |
| `surface-dark`    | Warm charcoal (`hsl(25, 12%, 14%)`)   | Card surfaces (dark mode)            |
| `text-primary`    | Near-black warm (`hsl(25, 10%, 15%)`) | Body text                            |
| `text-secondary`  | Warm gray (`hsl(25, 8%, 40%)`)        | Secondary text                       |
| `text-muted`      | Light warm gray (`hsl(25, 6%, 55%)`)  | Captions, metadata                   |

Category colors remain per `src/utils/categories.ts` (HSL values) until the tag-based migration.

> **Migration Note:** Updating the Tailwind config to reflect this warm palette is a future track. Document the target values here; implementation follows.

### Typography

- **Font family:** Inter (via `@fontsource/inter`) — clean, modern, excellent readability
- **Body text:** 16px base, 1.6 line-height for comfortable reading
- **Headings:** Bold (700), tight letter-spacing for editorial punch
- **Code blocks:** System monospace stack

### Dark Mode

- Dark mode supported via Tailwind's `class` strategy
- All colors must have explicit dark-mode counterparts
- Respect user's system preference with manual override toggle

## 2. UX Philosophy

### Performance-First with Smart Interactivity

The site is **static by default** — zero JavaScript ships unless explicitly needed. Interactive features use Astro's **island architecture**: hydrate only the components that require client-side behavior.

**Static (no JS):**

- Article pages, listing pages, navigation
- RSS/JSON feed, sitemap, OG images
- Dark mode toggle (CSS-only where possible)

**Interactive Islands (hydrate on demand):**

- Pagefind search widget
- Giscus comments (lazy-loaded)
- Comparison tables for tool reviews (sortable, filterable)
- Micro-animations for engagement (CSS transitions preferred; JS only when CSS can't achieve the effect)

### Animation & Motion

- **CSS transitions** for hover states, card lifts, and menu reveals
- **Scroll-triggered reveals** via CSS `@keyframes` + `IntersectionObserver` (minimal JS)
- **No layout shift** — all animations must be transform/opacity only
- Keep total animation budget under 300ms for UI responses

## 3. Responsive Design

### Mobile-First Approach

All layouts are designed for **mobile screens first**, then progressively enhanced for larger viewports.

| Breakpoint    | Target           | Layout                                   |
| ------------- | ---------------- | ---------------------------------------- |
| Default       | Mobile (< 640px) | Single column, stacked cards             |
| `sm` (640px)  | Large phones     | Minor spacing adjustments                |
| `md` (768px)  | Tablets          | Two-column grids where appropriate       |
| `lg` (1024px) | Laptops          | Sidebar layouts, wider content area      |
| `xl` (1280px) | Desktops         | Max-width container, generous whitespace |

### Touch Targets

- Minimum 44×44px for all interactive elements on mobile
- Adequate spacing between tappable items (min 8px gap)

## 4. Accessibility (WCAG 2.1 AA)

- **Color contrast:** Minimum 4.5:1 for normal text, 3:1 for large text
- **Keyboard navigation:** All interactive elements are focusable and operable via keyboard
- **Screen readers:** Semantic HTML, proper heading hierarchy, ARIA labels where needed
- **Skip links:** "Skip to content" link on every page
- **Alt text:** All images must have descriptive alt text
- **Focus indicators:** Visible focus rings on all interactive elements
- **Reduced motion:** Respect `prefers-reduced-motion` media query

## 5. SEO & Structured Data

### Schema.org Markup

- **Article schema** on every post page (headline, author, datePublished, dateModified)
- **Review schema** on tool review posts (itemReviewed, reviewRating, author)
- **FAQ schema** on guide/tutorial posts where applicable
- **Breadcrumb schema** for navigation hierarchy

### SEO Fundamentals

- Unique `<title>` and `<meta description>` per page
- Single `<h1>` per page with logical heading hierarchy
- Canonical URLs on all pages
- Open Graph and Twitter Card meta tags
- `hreflang` tag for `id-ID` locale
- XML sitemap + news sitemap for Google News eligibility

## 6. Content Presentation Rules

- **Max content width:** 720px for article body text (optimal reading line length)
- **Images:** Responsive via Astro's `<Image>` component; WebP/AVIF preferred
- **Code snippets:** Syntax-highlighted, with copy button
- **Tables:** Horizontally scrollable on mobile
- **Blockquotes:** Styled distinctly for editorial callouts and source citations
