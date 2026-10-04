## 2026-10-03 - Optimize readingTime calculation

**Learning:** In Astro, generating static sites means rendering components multiple times during the build process. When parsing frontmatter, calculating `readingTime` via `text.trim().split(/\s+/).length` for the Markdown content results in allocating a large array of strings for _every_ post, which causes excessive memory allocations during `astro build`.
**Action:** Replace `split()` string conversions with a simple character iteration (`charCodeAt`) loop to keep word counting O(N) without the overhead of creating large arrays in memory.
