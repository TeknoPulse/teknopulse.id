# TEKAA-221 — Internal Linking GSC (branch `seo/internal-linking-tekaa221`)

Branch: `seo/internal-linking-tekaa221` (base `3478c22` = origin/main saat ini)
Commit: `6df427f` fix(seo): internal linking untuk kategori & artikel GSC TEKAA-221
Build: ✅ exit 0 (`pnpm build`, dist terverifikasi)

## Temuan penting sebelum PR

Semua 11 URL di temuan GSC **sudah ada di sitemap** (`dist/sitemap-0.xml`,
build ulang mengonfirmasi) dan **semua indexable kecuali dua halaman kategori
kosong**. Jadi masalahnya bukan sitemap/noindex, melainkan internal link:

- `/category/experiments/` & `/category/insights/` → **`noindex,follow` otomatis**
  karena kategori kosong (0 artikel; route `category/[category]/[...page].astro`
  memakai `robots = isPaginated || isEmpty ? 'noindex,follow' : 'index,follow'`,
  komentar kode merujuk TEKAA-3 P1-8 — desain yang disengaja, bukan bug).
  Prasyarat agar keduanya jadi indexable: ada minimal 1 artikel dengan
  `category: Experiments` / `category: Insights` di frontmatter.
- `/category/automation/` → noindex dengan alasan sama (0 artikel berkategori
  Automation; frontmatter artikel terkait memakai `AI`/`Developer`).
- `/tags/developer-productivity/` & `/tags/spec-driven-development/` → noindex
  karena tipis (masing-masing hanya 1 artikel, aturan `tagCount <= 1`, also
  fail-open di sitemap filter).

## Perubahan di commit ini

1. **`src/components/PostCard.astro`** — badge kategori di kartu artikel jadi
   `<a href="/category/<slug>">`. Setiap halaman post kini me-link halaman
   kategorinya → `/category/experiments` & `/category/insights` masing-masing
   dapat **77 internal link** dari halaman post setelah build (diverifikasi
   via grep dist). Homepage + arsip juga otomatis.
2. **`src/pages/posts/[slug].astro`** — blok "Jelajahi Kategori" (6 kategori
   terdaftar dari `utils/categories.ts`) di atas "Artikel Terkait" di SEMUA
   halaman artikel. Menggantikan fungsi `CategoryPills` yang sebelumnya hanya
   ada di homepage (situs sudah punya dropdown Header yang statis `hidden`
   + hover-only; blok ini memastikan link crawlable di markup).
3. **Editorial (2 tautan kontekstual ke `/category/insights/`)** dari artikel
   terindeks:
   - `panduan-prompting-claude-opus-55.md` — kalimat penutup sebelum
     "Catatan Rujukan".
   - `cara-edit-foto-chatgpt.md` — ditambahkan di paragraf akhir paragraf
     penutup yang sudah ada (bagian "Ingin melatih dasar-dasarnya dulu?").

## Verifikasi (dist setelah build)

| URL | robots | di sitemap | internal link masuk |
|---|---|---|---|
| /category/experiments/ | noindex,follow (kosong) | ✅ | 77 halaman post |
| /category/insights/ | index,follow | ✅ | 77 + 2 editorial |
| /category/automation/ | noindex,follow (kosong) | ✅ | 77 |
| /category/software/ | index,follow | ✅ | 77 |
| /posts/chatgpt-gratis-tanpa-login/ | index,follow | ✅ | homepage hero, related-block, dll. |
| /posts/robot-humanoid-harga/ | index,follow | ✅ | related-block, trending, dll. |
| /posts/2026-09-24-snapdragon-8-elite-gen6-2nm/ | index,follow | ✅ | related-block, dll. |
| /posts/2026-09-27-react-19-subscription/ | index,follow | ✅ | homepage hero, related-block, dll. |
| /posts/implementing-spec-driven-.../ | index,follow | ✅ | related-block, halaman tag, dll. |
| /tags/developer-productivity/ | noindex,follow (tipis) | ✅ | halaman artikel, /tags |
| /tags/spec-driven-development/ | noindex,follow (tipis) | ✅ | halaman artikel, /tags |

Sitemap & noindex: TIDAK ADA perubahan yang diperlukan (item tugas #4).
Tinggal deploy → URL akan ter-crawl lewat jalur internal baru ini.

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
