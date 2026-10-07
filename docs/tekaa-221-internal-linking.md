# TEKAA-221 — Internal Linking GSC (branch `seo/internal-linking-tekaa221`)

Branch: `seo/internal-linking-tekaa221` (merged with `origin/main` at `3581188`)
Build: ✅ exit 0 (`pnpm build`, 241 static pages; `dist` verified)

## Implementation

1. **`src/components/PostCard.astro`** — category badges now link to their category URLs.
2. **`src/pages/posts/[slug].astro`** — every published article renders a crawlable “Jelajahi Kategori” block for the six registered categories.
3. Contextual links were added from relevant indexed articles:
   - Snapdragon 2nm ← Apple M6 2nm.
   - React 19.3 ← 64 AI concepts for software engineers.
   - ChatGPT without login ← ChatGPT free quota article (two contextual references).
   - Robot humanoid prices ← XPeng funding, Figure Helix 2.5, and Nubia NaviX articles.
   - Spec-driven development article/tags ← AI coding guide and 64 AI concepts article.
   - Automation context ← Nubia NaviX links to the MCP adoption article.
   - Insights category ← prompting and photo editing guides.

## Focused verification

All 11 target routes are generated and appear in `dist/sitemap-0.xml`. The five target article pages and `/category/insights/` plus `/category/software/` render `index, follow`.

Four targets intentionally render `noindex, follow` under the existing thin-page policy:
- `/category/experiments/` has no published article.
- `/category/automation/` has no published article (`membangun-agen-vertikal-peluang-konektor-ai` remains a draft).
- `/tags/developer-productivity/` and `/tags/spec-driven-development/` each contain one article.

These URLs are crawlable and linked, but they must not be submitted for indexing until they have enough published content. Their sitemap inclusion is a pre-existing inconsistency with `scripts/sitemap-exclusions.mjs`; this change does not weaken the thin-page policy or alter article publication state.

## Yang memang TIDAK bisa dilakukan via repo (butuh akses GSC manual)

Semua "Request indexing" untuk 6 URL *unknown to Google* harus dijalankan
manual oleh pemegang akses GSC via URL Inspection (tidak ada API resmi).
Tag @Board di PR / assign ke pemilik GSC untuk menjalankan request indexing
untuk:
- /category/experiments/
- /category/insights/
- /posts/2026-09-24-snapdragon-8-elite-gen6-2nm/
- /posts/2026-09-27-react-19-subscription/
- /posts/chatgpt-gratis-tanpa-login/
- /posts/robot-humanoid-harga/

## Catatan teknis lain

- `npx astro check` tidak bisa jalan di env ini (crash startup
  `@astrojs/language-server` vs `typescript@7` — pre-existing, tidak terkait
  perubahan ini). Build `pnpm build` sukses exit 0 dan jadi verifikasi utama.
- Di working tree checkout ditemukan perubahan tak terkait (retitling
  `ai-terbaik-2026.md` + `cara-bayar-chatgpt-gopay-dana.md` + dep dev
  `@astrojs/check`/`typescript` di package.json/lockfile, tampaknya milik
  TEKAA-223). TIDAK disertakan di commit ini; di-drop setelah diverifikasi
  tidak konflik dengan perubahan TEKAA-221.
