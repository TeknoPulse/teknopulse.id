// lastmod untuk sitemap utama (TEKAA-201 P2): Google menandai URL sebagai
// layak di-crawl ulang hanya jika <lastmod> akurat, jadi tanggal hanya
// diberikan untuk halaman yang punya sumber tanggal yang benar:
//   - /posts/<slug>/     -> updatedAt ?? publishedAt artikel
//   - /category/<slug>/  -> tanggal terbaru artikel di kategori itu
//   - /tags/<slug>/      -> tanggal terbaru artikel dengan tag itu
//   - /                  -> artikel terbaru (homepage berubah saat artikel baru)
// Halaman statis (about, contact, dll) sengaja TANPA lastmod — Google lebih
// suka lastmod absen daripada lastmod yang salah.
//
// Parser frontmatter di sini minimal dan sengaja sama dengan
// scripts/sitemap-exclusions.mjs (fail-open: slug tidak dikenal -> tanpa
// lastmod, URL tetap ada di sitemap).

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { slugifyTag } from './sitemap-exclusions.mjs';

// 'YYYY-MM-DD' dari string ISO frontmatter — dipertahankan apa adanya agar
// tanggal tidak bergeser akibat konversi UTC (artikel jam 00:xx WIB bisa
// mundur satu hari jika lewat new Date().toISOString()).
const dateStr = (iso) => {
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(String(iso ?? ''));
  return m ? m[1] : undefined;
};

const unquote = (value) => value.trim().replace(/^['"]|['"]$/g, '');

// Strip UTF-8 BOM (beberapa artikel lama punya BOM) sebelum parse frontmatter.
const parseFrontmatter = (raw) => {
  const match = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!match) return {};
  const fm = match[1];
  const field = (name) => {
    const m = new RegExp(`^${name}:\\s*(.+)$`, 'm').exec(fm);
    return m ? m[1].trim() : undefined;
  };
  // Tiga bentuk frontmatter yang dipakai artikel: inline `tags: ['a', 'b']`,
  // flow multi-baris `tags:\n  [\n    'a',\n  ]`, dan block `tags:\n  - 'a'`.
  const tagsFlow = /^tags:\s*\[([\s\S]*?)\]/m.exec(fm);
  const tagsBlock = tagsFlow ? undefined : /^tags:\s*\r?\n((?:\s*-\s*.+\r?\n?)+)/m.exec(fm);
  const tagsRaw = tagsFlow ? tagsFlow[1] : tagsBlock ? tagsBlock[1] : undefined;
  return {
    slug: field('slug') ? unquote(field('slug')) : undefined,
    publishedAt: field('publishedAt'),
    updatedAt: field('updatedAt'),
    draft: field('draft') === 'true',
    category: field('category') ? unquote(field('category')) : undefined,
    tags: tagsRaw
      ? tagsRaw
          .split(/,|\r?\n/)
          .map((t) => t.replace(/^\s*-\s*/, ''))
          .map((t) => unquote(t))
          .filter(Boolean)
      : [],
  };
};

// name -> slug dari src/utils/categories.ts (regex, tanpa mengeksekusi TS).
const readCategorySlugs = (categoriesFile) => {
  const map = new Map();
  let raw;
  try {
    raw = readFileSync(categoriesFile, 'utf8');
  } catch {
    return map;
  }
  const re = /name:\s*'([^']+)',\s*\n\s*slug:\s*'([^']+)'/g;
  for (const m of raw.matchAll(re)) map.set(m[1], m[2]);
  return map;
};

// Peta pathname -> { date, ms }. `ms` untuk memilih tanggal terbaru.
const buildLastmodMap = ({ postsDir, categoriesFile }) => {
  const map = new Map();
  const catSlugs = readCategorySlugs(categoriesFile);
  let newest = undefined;

  const bump = (key, entry) => {
    if (!key || !entry) return;
    const prev = map.get(key);
    if (!prev || entry.ms > prev.ms) map.set(key, entry);
  };

  let files;
  try {
    files = readdirSync(postsDir);
  } catch {
    return map;
  }

  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const fm = parseFrontmatter(readFileSync(path.join(postsDir, file), 'utf8'));
    if (fm.draft) continue;
    const slug = fm.slug ?? file.replace(/\.md$/, '');
    const iso = fm.updatedAt ?? fm.publishedAt;
    const ds = dateStr(iso);
    const ms = Date.parse(iso);
    if (!ds || Number.isNaN(ms)) continue;
    const entry = { date: ds, ms };
    bump(`/posts/${slug}/`, entry);
    if (fm.category) {
      bump(`/category/${catSlugs.get(fm.category) ?? fm.category.toLowerCase()}/`, entry);
    }
    for (const tag of fm.tags) bump(`/tags/${slugifyTag(tag)}/`, entry);
    if (!newest || ms > newest.ms) newest = entry;
  }

  bump('/', newest);
  return map;
};

// Serializer untuk @astrojs/sitemap: item.url adalah URL absolut penuh.
export function createLastmodSerializer({ postsDir, categoriesFile }) {
  const lastmodByPath = buildLastmodMap({ postsDir, categoriesFile });
  return (item) => {
    let pathname;
    try {
      pathname = new URL(item.url).pathname;
    } catch {
      return item;
    }
    const entry = lastmodByPath.get(pathname);
    if (!entry) return item; // tanpa lastmod lebih baik daripada lastmod salah
    return { ...item, lastmod: entry.date };
  };
}
