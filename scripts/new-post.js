#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);
const title = args[0];

if (!title) {
  console.error('Usage: pnpm post:new "Your Post Title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .trim('-');

const now = new Date();
const publishedAt = now.toISOString();

const categories = ['AI', 'OpenSource', 'DevTools'];
console.log('Available categories:', categories.join(', '));
const category = 'AI'; // Default category, can be changed manually

const frontmatter = `---
title: "${title}"
slug: "${slug}"
summary: "Add a brief summary of your post here."
metaDescription: ""
publishedAt: ${publishedAt}
updatedAt: ${publishedAt}
tags: ["tag1", "tag2"]
category: ${category}
author: "TeknoPulse Redaksi"
draft: true
# faq: # opsional, utk konten definisi/how-to (2–4 pertanyaan) → JSON-LD FAQPage
#   - question: "Pertanyaan yang sering diajukan?"
#     answer: "Jawaban 2–3 kalimat."
# ogImage: "../../assets/images/<slug>-og-16x9.png" # opsional; default og:image = coverImage (harus unik) atau kartu OG generate
---

Tulis paragraf pembuka (lead 40–60 kata yang menjawab 5W1H) langsung di sini —
TANPA baris '# Judul' di awal isi; judul sudah dirender template sebagai H1.

## Section 1

Your content goes here...

## Section 2

More content...

## Sumber

- [Nama Sumber](https://sumber-primer.example)
`;

const filename = `${slug}.md`;
const filepath = join(__dirname, '..', 'src', 'content', 'posts', filename);

try {
  writeFileSync(filepath, frontmatter);
  console.log(`✅ New post created: ${filepath}`);
  console.log(`📝 Checklist pra-terbit (lihat juga: pnpm seo:check):`);
  console.log(`   - Isi metaDescription 120–155 karakter (tulis manual, bukan potongan artikel)`);
  console.log(`   - Update summary + isi konten (lead 5W1H 40–60 kata, tanpa '# Judul' di awal)`);
  console.log(`   - Add appropriate tags + set the correct category`);
  console.log(`   - Author harus terdaftar di src/utils/authors.ts (byline + profil penulis)`);
  console.log(
    `   - coverImage spesifik artikel (unik, 16:9, ≥1200px) — jangan pakai gambar artikel lain`
  );
  console.log(`   - FAQ 2–4 pertanyaan utk konten definisi/how-to`);
  console.log(`   - Set draft: false when ready to publish`);
} catch (error) {
  console.error('❌ Error creating post:', error.message);
  process.exit(1);
}
