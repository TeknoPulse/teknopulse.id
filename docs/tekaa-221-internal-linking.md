# TEKAA-221 — Internal Linking GSC (branch `seo/internal-linking-tekaa221`)

Branch: `seo/internal-linking-tekaa221` (merged with `origin/main` at `3581188`)
PR: https://github.com/TeknoPulse/teknopulse.id/pull/75
Latest commit: `dc8b331`

## Implementation

1. **`src/components/PostCard.astro`** — category badges now link to their category URLs.
2. **`src/pages/posts/[slug].astro`** — every published article renders a crawlable “Jelajahi Kategori” block for the six registered categories.
3. Contextual links were added from relevant indexed articles:
   - Snapdragon 2nm ← Apple M6 2nm and iPhone lipat.
   - React 19.3 ← Microsoft Copilot super-app.
   - ChatGPT without login ← ChatGPT free quota, perbandingan ChatGPT vs Gemini vs Claude, and AI coding guide.
   - Robot humanoid prices ← XPeng funding, Figure Helix 2.5, and Nubia NaviX articles.
   - Spec-driven development ← AI coding guide.
   - Automation context ← Nubia NaviX links to the MCP adoption article.
   - Insights category ← prompting and photo editing guides.

## Focused verification

- `pnpm build` ✅ exit 0; Astro menghasilkan 238 halaman terindeks Pagefind.
- Sitemap akhir: 133 URL.
- Target artikel serta `/category/insights/` dan `/category/software/` masuk sitemap dan render `index, follow`.
- `/category/experiments/`, `/category/automation/`, `/tags/developer-productivity/`, dan `/tags/spec-driven-development/` tetap `noindex, follow` dan kini dikeluarkan dari sitemap.
- Kategori kosong tetap tersedia agar navigasi tidak 404. Tag tipis tetap tersedia agar chip tag tidak 404.

Tautan kontekstual terverifikasi dari output `dist`:

- Snapdragon: 2/2 (Apple M6 2nm, iPhone lipat).
- React 19.3: 1/1 (Microsoft Copilot super-app).
- ChatGPT tanpa login: 3/3 (kuota gratis, perbandingan ChatGPT vs Gemini vs Claude, panduan AI coding).
- Robot humanoid: 3/3 (XPeng, Figure Helix 2.5, Nubia NaviX).
- Spec-driven development: 1/1 (panduan AI coding).
- Insights: 2/2 (panduan prompting, panduan edit foto).

## GSC follow-up

Enam URL `Unknown to Google` tetap membutuhkan `Request indexing` manual oleh pemegang akses GSC setelah PR ini dideploy:

- `/category/experiments/`
- `/category/insights/`
- `/posts/2026-09-24-snapdragon-8-elite-gen6-2nm/`
- `/posts/2026-09-27-react-19-subscription/`
- `/posts/chatgpt-gratis-tanpa-login/`
- `/posts/robot-humanoid-harga/`

## Catatan teknis

- `npx astro check` tidak bisa jalan di env ini (crash startup `@astrojs/language-server` vs `typescript@7` — pre-existing). Build `pnpm build` sukses exit 0 dan menjadi verifikasi utama.
- Perubahan tak terkait milik TEKAA-223 tidak disertakan di commit TEKAA-221.
