// Filter sitemap (TEKAA-3 P1-8, disatukan di TEKAA-377): sitemap hanya boleh
// memuat URL yang benar-benar `index`.
//
// @astrojs/sitemap hanya memberi URL hasil build ke `filter`, jadi status
// "index vs noindex" dihitung dari sumber yang sama dengan route — bukan
// dari regex terpisah seperti sebelumnya. Sumber kebenaran:
//
//   src/utils/tags.ts   → parse tag, dedup per slug, aturan "tipis"
//   src/utils/urls.ts   → slugifyTag (dipakai route /tags/<slug>/)
//
// Yang dikeluarkan dari sitemap (semuanya `noindex, follow` di HTML):
//   1. Paginasi ≥2 untuk semua arsip — /posts/n/, /tags/<slug>/n/,
//      /category/<slug>/n/. Halaman ini hanya mengulang kartu halaman 1.
//   2. Tag dengan artikel ≤ THIN_TAG_MAX_POSTS (halaman tipis).
//   3. Kategori tanpa artikel.
//
// Setiap aturan di sini WAJIB punya pasangan `noindex` di route-nya;
// keduanya memakai helper yang sama supaya tidak bisa berbeda lagi.

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { slugifyTag } from '../src/utils/urls.mjs';
import { isThinTag, mergeTagEntries, parseTagsFromFrontmatter } from '../src/utils/tags.mjs';

export { slugifyTag };

/** Frontmatter artikel non-draft. */
function readPublishedPosts(postsDir) {
  const posts = [];
  for (const entry of readdirSync(postsDir)) {
    if (!entry.endsWith('.md')) continue;
    const raw = readFileSync(path.join(postsDir, entry), 'utf8');
    if (/^draft:\s*true\b/m.test(raw)) continue;
    const frontmatter = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---/.exec(raw)?.[1];
    if (!frontmatter) continue;
    const category = /^category:\s*([^\r\n]+)$/m.exec(frontmatter)?.[1];
    posts.push({
      tags: parseTagsFromFrontmatter(raw),
      category: category
        ? category
            .trim()
            .replace(/^["']|["']$/g, '')
            .toLowerCase()
        : undefined,
    });
  }
  return posts;
}

/** Slug tag yang halamannya `noindex` karena artikelnya ≤ threshold. */
export function thinTagSlugs(postsDir) {
  const posts = readPublishedPosts(postsDir);
  return new Set(
    mergeTagEntries(posts.map((post) => post.tags))
      .filter((entry) => isThinTag(entry.postCount))
      .map((entry) => entry.slug)
  );
}

/** Kategori tanpa artikel terbit → halaman `noindex`. */
export function emptyCategorySlugs(postsDir) {
  const used = new Set(
    readPublishedPosts(postsDir)
      .map((post) => post.category)
      .filter(Boolean)
  );
  return new Set(
    ['ai', 'developer', 'software', 'automation', 'experiments', 'insights'].filter(
      (slug) => !used.has(slug)
    )
  );
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
    // 1. Paginasi ≥2 — /posts/n/, /tags/<slug>/n/, /category/<slug>/n/.
    if (/^\/(?:posts|tags\/[^/]+|category\/[^/]+)\/\d+\/$/.test(pathname)) return false;
    // 2. Halaman tag tipis (halaman 1).
    const tagMatch = pathname.match(/^\/tags\/([^/]+)\/$/);
    if (tagMatch && thin.has(decodeURIComponent(tagMatch[1]))) return false;
    // 3. Kategori kosong.
    const categoryMatch = pathname.match(/^\/category\/([^/]+)\/$/);
    if (categoryMatch && emptyCategories.has(decodeURIComponent(categoryMatch[1]))) return false;
    return true;
  };
}
