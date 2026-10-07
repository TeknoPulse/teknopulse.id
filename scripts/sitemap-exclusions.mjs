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
//   3. Kategori kosong — route tetap ada untuk navigasi, tetapi noindex.
//
// Parser mendukung tiga bentuk `tags` yang dipakai repo: flow satu baris,
// flow multi-baris, dan block list. Kalau format YAML baru tidak dikenali,
// URL dianggap tidak tipis dan tetap masuk sitemap (fail-open).

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

export const slugifyTag = (tag) => tag.toLowerCase().replace(/\s+/g, '-');

const unquote = (value) => value.trim().replace(/^["']|["']$/g, '');

/** Ambil tag dari tiga format YAML yang saat ini dipakai koleksi artikel. */
function parseTags(raw) {
  const frontmatter = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---/.exec(raw)?.[1];
  if (!frontmatter) return [];

  const tagsFlow = /^tags:\s*\[([\s\S]*?)\]/m.exec(frontmatter);
  const tagsBlock = tagsFlow
    ? undefined
    : /^tags:\s*\r?\n((?:\s*-\s*.+\r?\n?)+)/m.exec(frontmatter);
  const tagsRaw = tagsFlow?.[1] ?? tagsBlock?.[1];
  if (!tagsRaw) return [];

  return tagsRaw
    .split(/,|\r?\n/)
    .map((tag) => tag.replace(/^\s*-\s*/, ''))
    .map(unquote)
    .filter(Boolean);
}

/** Hitung pemakaian tag dari frontmatter semua artikel non-draft. */
export function collectTagCounts(postsDir) {
  const counts = new Map();
  for (const entry of readdirSync(postsDir)) {
    if (!entry.endsWith('.md')) continue;
    const raw = readFileSync(path.join(postsDir, entry), 'utf8');
    if (/^draft:\s*true\b/m.test(raw)) continue;
    for (const tag of parseTags(raw)) {
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

/** Kategori tanpa artikel terbit → dikeluarkan dari sitemap. */
export function emptyCategorySlugs(postsDir) {
  const counts = new Map();
  for (const entry of readdirSync(postsDir)) {
    if (!entry.endsWith('.md')) continue;
    const raw = readFileSync(path.join(postsDir, entry), 'utf8');
    if (/^draft:\s*true\b/m.test(raw)) continue;
    const frontmatter = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---/.exec(raw)?.[1];
    const category = /^category:\s*([^\r\n]+)$/m.exec(frontmatter ?? '')?.[1];
    if (!category) continue;
    const slug = unquote(category).toLowerCase();
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }
  return new Set(['ai', 'developer', 'software', 'automation', 'experiments', 'insights'].filter((slug) => !counts.has(slug)));
}

/** Buat predicate `filter` untuk integrasi @astrojs/sitemap. */
export function createSitemapFilter({ site, postsDir }) {
  const thin = thinTagSlugs(postsDir);
  const emptyCategories = emptyCategorySlugs(postsDir);
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
    // Kategori kosong memiliki noindex,follow dan tidak memberi nilai sitemap.
    const categoryMatch = pathname.match(/^\/category\/([^/]+)\/$/);
    if (categoryMatch && emptyCategories.has(decodeURIComponent(categoryMatch[1]))) return false;
    return true;
  };
}
