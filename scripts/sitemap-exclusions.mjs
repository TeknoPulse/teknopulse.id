// Filter sitemap (TEKAA-3 P1-8): jaga sitemap bebas halaman tipis.
//
// @astrojs/sitemap hanya memberi URL hasil build ke `filter`, jadi daftar
// tag tipis dihitung dari frontmatter Markdown di sini — saat config
// dimuat — dengan pola parse yang sama dengan route:
//   - slug tag = `tag.toLowerCase().replace(/\s+/g, '-')`  (tags/[tag])
//   - halaman paginasi = `/tags/<slug>/2/`, `/category/<slug>/3/`  ([...page])
//
// Yang dikeluarkan dari sitemap:
//   1. Semua halaman paginasi ≥2 (tags & kategori) — judul identik dengan
//      halaman 1, tipis, dan sudah `noindex,follow`.
//   2. Tag dengan ≤1 artikel — halaman tipis tanpa nilai unik, sudah
//      `noindex,follow` (halamannya tetap ada supaya chip tag tidak 404).
//
// Catatan: parser frontmatter ini sengaja minimal (baris `tags: [...]` dan
// `draft: true`); kalau artikel baru memakai format YAML lain, tag-nya
// gagal terhitung → dianggap tidak tipis → tetap masuk sitemap (fail-open).

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

export const slugifyTag = (tag) => tag.toLowerCase().replace(/\s+/g, '-');

/** Hitung pemakaian tag dari frontmatter semua artikel non-draft. */
export function collectTagCounts(postsDir) {
  const counts = new Map();
  for (const entry of readdirSync(postsDir)) {
    if (!entry.endsWith('.md')) continue;
    const raw = readFileSync(path.join(postsDir, entry), 'utf8');
    if (/^draft:\s*true\b/m.test(raw)) continue;
    const match = raw.match(/^tags:\s*\[(.*?)\]\s*$/m);
    if (!match) continue;
    for (const rawTag of match[1].split(',')) {
      const tag = rawTag.trim().replace(/^["']|["']$/g, '');
      if (!tag) continue;
      const slug = slugifyTag(tag);
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }
  return counts;
}

/** Slug tag yang dipakai ≤ `max` artikel → dikeluarkan dari sitemap. */
export function thinTagSlugs(postsDir, max = 1) {
  const counts = collectTagCounts(postsDir);
  return new Set([...counts].filter(([, count]) => count <= max).map(([slug]) => slug));
}

/** Buat predicate `filter` untuk integrasi @astrojs/sitemap. */
export function createSitemapFilter({ site, postsDir }) {
  const thin = thinTagSlugs(postsDir);
  return (page) => {
    let pathname;
    try {
      pathname = new URL(page, site).pathname;
    } catch {
      return true;
    }
    // Paginasi ≥2 halaman tag/kategori.
    if (/^\/(?:tags|category)\/[^/]+\/\d+\/$/.test(pathname)) return false;
    // Halaman tag tipis (halaman 1).
    const tagMatch = pathname.match(/^\/tags\/([^/]+)\/$/);
    if (tagMatch && thin.has(decodeURIComponent(tagMatch[1]))) return false;
    return true;
  };
}
