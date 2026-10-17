## 2026-10-03 - Optimize readingTime calculation

**Learning:** In Astro, generating static sites means rendering components multiple times during the build process. When parsing frontmatter, calculating `readingTime` via `text.trim().split(/\s+/).length` for the Markdown content results in allocating a large array of strings for _every_ post, which causes excessive memory allocations during `astro build`.
**Action:** Replace `split()` string conversions with a simple character iteration (`charCodeAt`) loop to keep word counting O(N) without the overhead of creating large arrays in memory.

## 2026-09-27 - [Accessibility Improvements in Header]

**Learning:** Added ARIA attributes to navigation menus and a Skip to content link to improve accessibility for keyboard and screen reader users. The site is in Indonesian, so 'Lewati ke konten utama' is the correct localization.
**Action:** Always ensure accessibility labels match the primary locale of the site (Indonesian `id-ID` in this repo).

## 2026-10-17 - Optimize static paths related posts

**Learning:** In Astro, performing heavy operations like `getCollection()` filtering and sorting inside the component body for dynamically prerendered routes (e.g., `[slug].astro`) repeats the work for every generated page.
**Action:** Always perform expensive data fetching and array processing inside `getStaticPaths()`, passing down the computed results as props to optimize build times and prevent redundant resource allocations.
