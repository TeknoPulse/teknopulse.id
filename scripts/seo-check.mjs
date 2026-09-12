#!/usr/bin/env node
// scripts/seo-check.mjs — checklist pra-terbit teknis (TEKAA-4 §10 / TEKAA-5).
//
// Memeriksa frontmatter + nama file semua artikel di src/content/posts:
//   1. Slug bertanggal (pola lama `/posts/YYYY-MM-DD-slug/`) — artikel BARU
//      wajib tanpa tanggal; artikel lama hanya dicatat, jangan diubah
//      tanpa redirect 301.
//   2. metaDescription — wajib ada & panjangnya 120–155 karakter.
//   3. coverImage dipakai bareng oleh ≥2 artikel — og:image & gambar harus
//      spesifik per artikel.
//   4. Byline `author` tidak terdaftar di src/utils/authors.ts — tidak
//      punya halaman profil / author.url JSON-LD.
//
// Jalankan: `pnpm seo:check` (laporan) atau `pnpm seo:check:strict`
// (exit 1 bila ada temuan — untuk gate pra-terbit/CI).

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = join(__dirname, '..', 'src', 'content', 'posts');
const AUTHORS_FILE = join(__dirname, '..', 'src', 'utils', 'authors.ts');
const ASSETS_DIR = join(__dirname, '..', 'src', 'assets', 'images');

const META_MIN = 120;
const META_MAX = 155;
const strict = process.argv.includes('--strict');

/** Parse nama penulis dari src/utils/authors.ts (name + aliases). */
function registeredAuthorNames() {
  const source = readFileSync(AUTHORS_FILE, 'utf8');
  const names = [];
  for (const match of source.matchAll(/name:\s*'([^']+)'/g)) names.push(match[1]);
  for (const match of source.matchAll(/aliases:\s*\[([^\]]*)\]/g)) {
    for (const alias of match[1].matchAll(/'([^']+)'/g)) names.push(alias[1]);
  }
  return names.map((name) => name.trim().toLowerCase());
}

/** Ambil field skalar satu-baris dari blok frontmatter YAML. */
function parseFrontmatter(raw) {
  const fields = {};
  let inside = false;
  for (const line of raw.split('\n')) {
    if (line.trim() === '---') {
      if (inside) break;
      inside = true;
      continue;
    }
    if (!inside) continue;
    const match = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (match && !line.startsWith(' ') && !line.startsWith('#')) {
      fields[match[1]] = (match[2] ?? '').trim().replace(/^['"]|['"]$/g, '');
    }
  }
  return fields;
}

const authorNames = registeredAuthorNames();
const posts = [];
let parseErrors = 0;

for (const file of readdirSync(POSTS_DIR)
  .filter((name) => name.endsWith('.md'))
  .sort()) {
  const raw = readFileSync(join(POSTS_DIR, file), 'utf8').replace(/^\uFEFF/, '');
  if (!raw.startsWith('---')) {
    console.error(`✖ ${file}: blok frontmatter tidak ditemukan`);
    parseErrors++;
    continue;
  }
  posts.push({ file, fields: parseFrontmatter(raw) });
}

// Kelompokkan coverImage per file fisik untuk deteksi pemakaian bareng.
const coverUsage = new Map();
for (const { file, fields } of posts) {
  const cover = fields.coverImage?.split('/').pop();
  if (cover) {
    if (!coverUsage.has(cover)) coverUsage.set(cover, []);
    coverUsage.get(cover).push(file);
  }
}

// Gambar identik secara byte (salinan dengan nama beda) — Astro menggabungkan
// file yang kontennya sama jadi satu aset ber-hash, sehingga og:image beberapa
// artikel bisa sama walau nama filenya beda. Kelompokkan per md5.
const contentGroups = new Map(); // md5 -> [nama file gambar]
for (const name of new Set([...coverUsage.keys()])) {
  try {
    const md5 = createHash('md5')
      .update(readFileSync(join(ASSETS_DIR, name)))
      .digest('hex');
    if (!contentGroups.has(md5)) contentGroups.set(md5, []);
    contentGroups.get(md5).push(name);
  } catch {
    // file gambar tidak ada — biarkan Astro yang error dengan pesan jelas
  }
}
const twinFiles = new Map(); // nama file -> [nama file kembar]
for (const group of contentGroups.values()) {
  if (group.length > 1) {
    for (const name of group)
      twinFiles.set(
        name,
        group.filter((other) => other !== name)
      );
  }
}

const findings = []; // { level: 'WARN'|'INFO', file, message }
const warn = (file, message) => findings.push({ level: 'WARN', file, message });

for (const { file, fields } of posts) {
  const isDraft = fields.draft === 'true';
  const label = isDraft ? `${file} (draft)` : file;

  // 1. Slug bertanggal
  if (/^\d{4}-\d{2}-\d{2}-/.test(file)) {
    warn(
      label,
      'slug bertanggal (pola lama). Artikel baru wajib /posts/<slug>/ tanpa tanggal; ' +
        'artikel lama jangan diubah tanpa redirect 301.'
    );
  }

  // 2. Meta description
  const meta = fields.metaDescription;
  const effective = meta || fields.summary || '';
  if (!meta) {
    warn(
      label,
      `metaDescription kosong — fallback ke summary (${effective.length} karakter). ` +
        `Tulis manual 120–155 karakter.`
    );
  } else if (effective.length < META_MIN || effective.length > META_MAX) {
    warn(label, `metaDescription ${effective.length} karakter — harus 120–155.`);
  }

  // 3. coverImage dipakai bareng
  const cover = fields.coverImage?.split('/').pop();
  if (cover && coverUsage.get(cover)?.length > 1) {
    warn(
      label,
      `coverImage "${cover}" juga dipakai: ${coverUsage
        .get(cover)
        .filter((f) => f !== file)
        .join(', ')}. Gambar & og:image harus spesifik per artikel ` +
        `(og:image artikel ini otomatis diganti kartu OG generate).`
    );
  }

  // 4. Byline tidak terdaftar
  if (fields.author && !authorNames.includes(fields.author.trim().toLowerCase())) {
    warn(
      label,
      `byline "${fields.author}" tidak ada di src/utils/authors.ts — ` +
        `tidak punya halaman profil / author.url JSON-LD.`
    );
  }
}

// Laporan
const warns = findings.filter((f) => f.level === 'WARN');
for (const { file, message } of findings) {
  console.log(`⚠ ${file}: ${message}`);
}

console.log('');
console.log(
  `seo-check: ${posts.length} artikel, ${warns.length} peringatan, ${parseErrors} error parse.`
);
console.log('Checkpoint: metaDescription 120–155 kar.; slug tanpa tanggal utk artikel baru;');
console.log('            coverImage/og:image unik per artikel; byline terdaftar di authors.ts.');

if (parseErrors > 0 || (strict && warns.length > 0)) {
  console.error('seo-check: GAGAL (mode strict).');
  process.exit(1);
}
