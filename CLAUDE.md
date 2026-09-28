# CLAUDE.md

Panduan kerja agent untuk repo ini ada di **[AGENTS.md](./AGENTS.md)** — baca file itu lebih dulu.
File ini sengaja hanya berupa penunjuk singkat supaya tidak ada dua sumber aturan yang bisa berbeda.

Ringkasan cepat:

- Stack: Astro v5 + TypeScript + Tailwind v3 + pnpm. Output **statis** ke `dist/`, deploy ke Cloudflare Pages.
- Gate kebenaran: `pnpm build` (menjalankan `seo-check` sebagai prebuild dan `pagefind` sebagai postbuild).
- Konten: `src/content/posts/*.md`, skema di `src/content/config.ts`. `category` wajib salah satu dari
  `AI | Software | Developer | Automation | Experiments | Insights`.
- Cover image: `pnpm covers:audit` → `covers:plan` → `covers:fetch` → `covers:apply` → `covers:verify`
  (detail dan aturannya di `AGENTS.md` dan `README.md`).
- Perubahan konten lewat branch + PR; merge menunggu review pemilik repo.
- Jangan me-rename file post bertanggal (butuh redirect 301) dan jangan menghapus file cover lama.
