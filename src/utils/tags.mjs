// SSOT tag & "tipis" (TEKAA-377).
//
// Sebelum ini route `/tags/[tag]/[...page].astro` dan
// `scripts/sitemap-exclusions.mjs` punya dua definisi berbeda tentang tag
// tipis, dan keduanya memakai `tags` MENTAH (`getCollection().data.tags`)
// sebagai kunci. Variasi kapitalisasi di frontmatter membuat satu slug
// menghasilkan beberapa halaman yang saling menimpa:
//
//   tags: ['Kecerdasan Buatan']   → /tags/kecerdasan-buatan/
//   tags: ['kecerdasan buatan']   → /tags/kecerdasan-buatan/
//
// `getStaticPaths` dulu memancarkan route yang sama dua kali; halaman
// terakhir menang dengan `tagCount = 1` → `noindex`, sementara filter
// sitemap masih melihat gabungan 2 artikel → tetap masuk sitemap. Itu
// tepat pola "kadang PASS, kadang NEUTRAL" di audit.
//
// Modul ini memusatkan: normalisasi tag (dedup per slug), hitung artikel,
// dan aturan indexabilitas. Route, halaman daftar tag, dan filter sitemap
// WAJIB memakai fungsi di sini supaya tidak bisa berbeda lagi.
//
// Sengaja `.mjs` tanpa sintaks TypeScript — diimpor juga oleh
// `scripts/sitemap-exclusions.mjs` saat config Astro dimuat.

import { slugifyTag } from './urls.mjs';

/**
 * Ambil tag dari tiga format YAML yang dipakai koleksi artikel:
 * flow satu baris (`tags: ['a', 'b']`), flow multi-baris
 * (`tags:\n  ['a', 'b']`), dan block list (`tags:\n  - a\n  - b`).
 * @param {string} raw isi berkas Markdown
 * @returns {string[]}
 */
export function parseTagsFromFrontmatter(raw) {
  const frontmatter = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---/.exec(raw)?.[1];
  if (!frontmatter) return [];

  // Flow: `tags: [...]`, boleh dimulai di baris berikutnya.
  const flow = /^tags:[ \t]*\r?\n?[ \t]*\[([\s\S]*?)\]/m.exec(frontmatter);
  // Block: `tags:` lalu deretan `- item` (item terakhir boleh tanpa newline).
  const block = flow
    ? undefined
    : /^tags:[ \t]*\r?\n((?:[ \t]*-[ \t].*(?:\r?\n|(?=\r?\n---)|$))+)/m.exec(frontmatter);
  const body = flow?.[1] ?? block?.[1];
  if (!body) return [];

  return body
    .split(/,|\r?\n/)
    .map((tag) => tag.replace(/^\s*-\s*/, ''))
    .map((tag) => tag.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean);
}

/**
 * Threshold "tipis" untuk halaman tag. Tag dengan artikel kurang dari ini
 * diberi `noindex, follow` dan TIDAK masuk sitemap.
 *
 * Dinaikkan 1 → 2 (TEKAA-377): tag berisi 2 artikel tetap halaman arsip
 * tanpa konten unik — hanya dua kartu, judul dan deskripsi generik. Audit
 * indexasi menemukan halaman ini sebagai kelompok "Crawled – currently not
 * indexed". Mulai sekarang hanya tag ≥3 artikel yang index.
 *
 * @type {number}
 */
export const THIN_TAG_MAX_POSTS = 2;

/**
 * Tag terhitung index hanya bila artikelnya > THIN_TAG_MAX_POSTS.
 * @param {number} postCount
 * @returns {boolean}
 */
export const isThinTag = (postCount) => postCount <= THIN_TAG_MAX_POSTS;

/**
 * @typedef {object} TagEntry
 * @property {string} label    Label tampilan — varian dengan pemakaian terbanyak.
 * @property {string} slug     Slug kanonik (`slugifyTag`).
 * @property {number} postCount Jumlah artikel unik (satu artikel dihitung sekali per slug).
 */

/**
 * Gabungkan daftar tag MENTAH menjadi satu entri per slug.
 *
 * Pemakaian terbanyak menang sebagai label; seri dipecahkan agar tampilan
 * stabil antar build.
 * @param {string[][]} rawTagLists satu array tag per artikel
 * @returns {TagEntry[]}
 */
export function mergeTagEntries(rawTagLists) {
  /** @type {Map<string, Map<string, number>>} */
  const bySlug = new Map();

  for (const tags of rawTagLists) {
    // Satu artikel tidak boleh menghitung slug yang sama dua kali
    // (mis. artikel memuat 'NVIDIA' dan 'Nvidia').
    const seen = new Set();
    for (const tag of tags ?? []) {
      const slug = slugifyTag(tag);
      if (seen.has(slug)) continue;
      seen.add(slug);
      const labels = bySlug.get(slug) ?? new Map();
      labels.set(tag, (labels.get(tag) ?? 0) + 1);
      bySlug.set(slug, labels);
    }
  }

  const preferLabel = (a, b) => {
    if (a.length !== b.length) return a.length > b.length ? a : b;
    return a < b ? a : b;
  };

  return [...bySlug].map(([slug, labels]) => {
    let label = '';
    let best = -1;
    for (const [candidate, count] of labels) {
      if (count > best) {
        label = candidate;
        best = count;
      } else if (count === best) {
        label = preferLabel(label, candidate);
      }
    }
    return { label, slug, postCount: labels.get(label) ?? 0 };
  });
}
