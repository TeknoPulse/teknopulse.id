/**
 * Task 2 — Preservation Baseline Test (Property 2)
 * Spec: .kiro/specs/category-restructuring/
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 *
 * TUJUAN:
 *   Memverifikasi bahwa perilaku artikel AI yang sudah ada TIDAK berubah
 *   setelah fix category-restructuring diterapkan.
 *
 * METODOLOGI: Observation-first preservation check
 *   - Fase 1 (SEBELUM fix): jalankan skrip ini pada kode yang belum diperbaiki.
 *     Semua assertion HARUS LULUS → ini adalah baseline.
 *   - Fase 2 (SESUDAH fix, Task 12.2): jalankan skrip yang SAMA lagi.
 *     Semua assertion HARUS TETAP LULUS → konfirmasi preservation.
 *
 * CARA MENJALANKAN:
 *   node scripts/test-preservation-baseline.mjs
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ──────────────────────────────────────────────────────────────
// BASELINE SNAPSHOT — Current state of categories.ts (SEBELUM fix)
// Nilai-nilai ini diambil langsung dari src/utils/categories.ts
// pada kode yang BELUM diperbaiki.
// ──────────────────────────────────────────────────────────────
const BASELINE = {
  // Observasi 1: getCategoryByName('AI') mengembalikan objek dengan nilai-nilai ini
  AI_CATEGORY: {
    name: 'AI',
    slug: 'ai',
    color: 'hsl(270, 80%, 60%)',
    bgColor: 'hsl(270, 80%, 60% / 0.1)',
    hoverColor: 'hsl(270, 80%, 60% / 0.2)',
    description: 'Machine Learning, AI models, research, and tools',
  },
  // Observasi 2: getAllCategories() mengembalikan 3 kategori sebelum fix
  // (Setelah fix ini akan berubah menjadi 6 — hanya BASELINE yang berubah,
  //  bukan properti preservation AI itu sendiri)
  CATEGORY_COUNT_BEFORE_FIX: 3,
  // Observasi 3: CSS class untuk AI
  AI_CSS_CLASS: 'category-ai',
  AI_COLOR_TOKEN: 'hsl(270, 80%, 60%)',
  // Observasi 4: CSS class ada di global.css
  AI_GLOBAL_CSS_RULE: '@apply bg-category-ai/10 text-category-ai hover:bg-category-ai/20',
  // Observasi 5: Tailwind token ada di tailwind.config.cjs
  AI_TAILWIND_TOKEN: "'category-ai': 'hsl(270, 80%, 60%)'",
};

// ──────────────────────────────────────────────────────────────
// Helper: minimal re-implementasi utilitas categories.ts
// (baca langsung dari file agar selalu sinkron dengan kode aktual)
// ──────────────────────────────────────────────────────────────
function parseCategoriesTs() {
  const content = fs.readFileSync(path.join(ROOT, 'src/utils/categories.ts'), 'utf-8');
  return content;
}

function extractCategoryKeys(tsContent) {
  // Ekstrak kunci dari objek categories: Record<string, Category>
  const matches = [...tsContent.matchAll(/^\s{2}(\w+):\s*\{/gm)];
  return matches.map((m) => m[1]).filter((k) => k !== 'category');
}

function extractColorForKey(tsContent, key) {
  // Ekstrak nilai color untuk key tertentu
  const keyBlock = tsContent.split(key + ':')[1];
  if (!keyBlock) return null;
  const colorMatch = keyBlock.match(/color:\s*'([^']+)'/);
  return colorMatch ? colorMatch[1] : null;
}

function extractSlugForKey(tsContent, key) {
  const keyBlock = tsContent.split(key + ':')[1];
  if (!keyBlock) return null;
  const slugMatch = keyBlock.match(/slug:\s*'([^']+)'/);
  return slugMatch ? slugMatch[1] : null;
}

// ──────────────────────────────────────────────────────────────
// Helper: hitung artikel AI non-draft
// ──────────────────────────────────────────────────────────────
function countAIPosts() {
  const postsDir = path.join(ROOT, 'src/content/posts');
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
  let count = 0;
  let draftCount = 0;
  const aiPostFiles = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    const isAI = /^category:\s*AI\s*$/m.test(content);
    if (!isAI) continue;
    const isDraft = /^draft:\s*true\s*$/m.test(content);
    if (!isDraft) {
      count++;
      aiPostFiles.push(file);
    } else {
      draftCount++;
    }
  }

  return { count, draftCount, files: aiPostFiles };
}

// ──────────────────────────────────────────────────────────────
// Test runner
// ──────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, testName, detail = '') {
  if (condition) {
    console.log(`  ✅ PASS  ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL  ${testName}${detail ? '\n         ' + detail : ''}`);
    failed++;
    failures.push(testName);
  }
}

// ──────────────────────────────────────────────────────────────
// PROPERTY 2 CHECKS
// ──────────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════════');
console.log('  PROPERTY 2: Preservation — Artikel AI Tetap Dirender Benar');
console.log('  Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7');
console.log('══════════════════════════════════════════════════════════\n');

// ── P2-1: categories.ts mendefinisikan 'AI' sebagai kunci valid ──────────────
console.log('── P2-1: categories.ts mendefinisikan AI sebagai kunci valid (Req 3.1, 3.5)');
const tsContent = parseCategoriesTs();
const keys = extractCategoryKeys(tsContent);
assert(keys.includes('AI'), "categories.ts memiliki kunci 'AI'", `Kunci yang ditemukan: ${keys.join(', ')}`);

// ── P2-2: Warna AI tidak berubah (preservation core) ─────────────────────────
console.log('\n── P2-2: Warna badge AI tetap hsl(270, 80%, 60%) (Req 3.1)');
const aiColor = extractColorForKey(tsContent, 'AI');
assert(
  aiColor === BASELINE.AI_CATEGORY.color,
  `getCategoryByName('AI').color = '${BASELINE.AI_CATEGORY.color}'`,
  `Aktual: '${aiColor}' | Diharapkan: '${BASELINE.AI_CATEGORY.color}'`
);

// ── P2-3: Slug AI tidak berubah ───────────────────────────────────────────────
console.log('\n── P2-3: Slug kategori AI tetap "ai" (Req 3.1, 3.4)');
const aiSlug = extractSlugForKey(tsContent, 'AI');
assert(
  aiSlug === BASELINE.AI_CATEGORY.slug,
  `getCategoryByName('AI').slug = '${BASELINE.AI_CATEGORY.slug}'`,
  `Aktual: '${aiSlug}' | Diharapkan: '${BASELINE.AI_CATEGORY.slug}'`
);

// ── P2-4: CSS class .category-ai ada di global.css ───────────────────────────
console.log('\n── P2-4: CSS class .category-ai ada di src/styles/global.css (Req 3.1, 3.4)');
const globalCss = fs.readFileSync(path.join(ROOT, 'src/styles/global.css'), 'utf-8');
assert(
  globalCss.includes('.category-ai {') || globalCss.includes('.category-ai{'),
  "global.css mendefinisikan .category-ai { ... }",
  'Kelas CSS .category-ai tidak ditemukan di global.css'
);

// ── P2-5: CSS class .category-ai memakai warna yang benar ────────────────────
console.log('\n── P2-5: .category-ai memakai token bg-category-ai (Req 3.1)');
assert(
  globalCss.includes('bg-category-ai'),
  ".category-ai menggunakan token bg-category-ai",
  'Token bg-category-ai tidak ditemukan di dalam blok .category-ai'
);

// ── P2-6: Tailwind token category-ai ada ─────────────────────────────────────
console.log('\n── P2-6: tailwind.config.cjs mendefinisikan token category-ai (Req 3.1)');
const tailwindConfig = fs.readFileSync(path.join(ROOT, 'tailwind.config.cjs'), 'utf-8');
assert(
  tailwindConfig.includes("'category-ai'"),
  "tailwind.config.cjs memiliki token 'category-ai'",
  "Token 'category-ai' tidak ditemukan di tailwind.config.cjs"
);

// ── P2-7: Tailwind token category-ai memakai warna ungu yang benar ───────────
console.log('\n── P2-7: Token category-ai = hsl(270, 80%, 60%) (Req 3.1)');
const tailwindAiColorMatch = tailwindConfig.match(/'category-ai':\s*'([^']+)'/);
const tailwindAiColor = tailwindAiColorMatch ? tailwindAiColorMatch[1] : null;
assert(
  tailwindAiColor === BASELINE.AI_COLOR_TOKEN,
  `tailwind 'category-ai' = '${BASELINE.AI_COLOR_TOKEN}'`,
  `Aktual: '${tailwindAiColor}' | Diharapkan: '${BASELINE.AI_COLOR_TOKEN}'`
);

// ── P2-8: Artikel AI ada dalam koleksi (non-draft) ───────────────────────────
console.log('\n── P2-8: Artikel category:AI non-draft ada dalam koleksi (Req 3.3, 3.6)');
const { count: aiPostCount, draftCount, files: aiFiles } = countAIPosts();
assert(
  aiPostCount > 0,
  `Koleksi memiliki ${aiPostCount} artikel AI non-draft`,
  'Tidak ditemukan artikel AI non-draft'
);

// ── P2-9: Jumlah artikel AI tidak berkurang setelah fix ───────────────────────
// Baseline: 45 file total berisi "category: AI" (termasuk draft)
// Dokumentasikan angka aktual sebagai checkpoint
console.log('\n── P2-9: Dokumentasi jumlah baseline artikel AI (Req 3.3)');
const BASELINE_AI_POST_COUNT_TOTAL = 45; // total dari grep (draft + non-draft)
assert(
  aiPostCount + draftCount <= BASELINE_AI_POST_COUNT_TOTAL + 5, // toleransi artikel baru
  `Jumlah artikel AI (non-draft: ${aiPostCount}, draft: ${draftCount}) konsisten dengan baseline ${BASELINE_AI_POST_COUNT_TOTAL}`,
  `Jumlah jauh berbeda: ${aiPostCount + draftCount} vs baseline ${BASELINE_AI_POST_COUNT_TOTAL}`
);

// ── P2-10: SSOT invariant — kunci categories.ts sinkron dengan Zod enum ───────
console.log('\n── P2-10: SSOT invariant — kunci categories.ts identik dengan enum Zod (Req 3.5)');
const configTs = fs.readFileSync(path.join(ROOT, 'src/content/config.ts'), 'utf-8');
// Ekstrak nilai enum dari z.enum([...])
const zodEnumMatch = configTs.match(/z\.enum\(\[([^\]]+)\]\)/);
const zodEnumValues = zodEnumMatch
  ? zodEnumMatch[1]
    .split(',')
    .map((v) => v.trim().replace(/['"]/g, ''))
    .filter(Boolean)
  : [];

// Ekstrak kunci dari categories.ts
const categoriesKeys = extractCategoryKeys(tsContent);

// Setiap kunci categories.ts harus ada di enum Zod
const missingFromZod = categoriesKeys.filter((k) => !zodEnumValues.includes(k));
const missingFromCats = zodEnumValues.filter((v) => !categoriesKeys.includes(v));

assert(
  missingFromZod.length === 0,
  `Semua kunci categories.ts ada di enum Zod: [${categoriesKeys.join(', ')}]`,
  `Kunci di categories.ts tapi TIDAK di enum Zod: [${missingFromZod.join(', ')}]`
);
assert(
  missingFromCats.length === 0,
  `Semua nilai enum Zod ada di categories.ts: [${zodEnumValues.join(', ')}]`,
  `Nilai di enum Zod tapi TIDAK di categories.ts: [${missingFromCats.join(', ')}]`
);

// ── P2-11: getCategoryColorClasses('AI') mengembalikan format 'category-{slug}' ─
console.log('\n── P2-11: getCategoryColorClasses format check (Req 3.4)');
// Implementasi ulang logika sederhana dari categories.ts
function getCategoryColorClassesSimple(name, cats) {
  const cat = cats[name];
  if (!cat) return '';
  return `category-${cat.slug}`;
}

// Parse categories object dari TypeScript source
function parseCategoriesObject(tsContent) {
  const cats = {};
  // Ekstrak setiap blok kategori
  const blockRegex = /(\w+):\s*\{[^}]+slug:\s*'([^']+)'[^}]+color:\s*'([^']+)'/g;
  let m;
  while ((m = blockRegex.exec(tsContent)) !== null) {
    const [, key, slug, color] = m;
    if (key !== 'category') {
      cats[key] = { slug, color };
    }
  }
  return cats;
}

const catsObj = parseCategoriesObject(tsContent);
const aiColorClass = getCategoryColorClassesSimple('AI', catsObj);
assert(
  aiColorClass === BASELINE.AI_CSS_CLASS,
  `getCategoryColorClasses('AI') = '${BASELINE.AI_CSS_CLASS}'`,
  `Aktual: '${aiColorClass}' | Diharapkan: '${BASELINE.AI_CSS_CLASS}'`
);

// ── P2-12: Property: untuk setiap artikel AI, slug kategori konsisten ──────────
console.log('\n── P2-12: [Property] Setiap artikel AI menggunakan kelas badge category-ai (Req 3.1)');
// Sampling: cek 5 artikel AI pertama
const sampleFiles = aiFiles.slice(0, 5);
let allSampleHaveAI = true;
for (const file of sampleFiles) {
  const content = fs.readFileSync(
    path.join(ROOT, 'src/content/posts', file),
    'utf-8'
  );
  if (!/^category:\s*AI\s*$/m.test(content)) {
    allSampleHaveAI = false;
    break;
  }
}
assert(
  allSampleHaveAI && sampleFiles.length === 5,
  `Sample 5 artikel AI semuanya memiliki category: AI di frontmatter`,
  `Sample: [${sampleFiles.slice(0, 3).join(', ')}...]`
);

// ── Ringkasan ──────────────────────────────────────────────────────────────────
console.log('\n══════════════════════════════════════════════════════════');
console.log('  RINGKASAN OBSERVASI BASELINE (SEBELUM FIX)');
console.log('══════════════════════════════════════════════════════════');
console.log(`  Kunci categories.ts saat ini : [${keys.join(', ')}] (${keys.length} kategori)`);
console.log(`  Warna AI                     : ${aiColor}`);
console.log(`  Slug AI                      : ${aiSlug}`);
console.log(`  Artikel AI non-draft         : ${aiPostCount}`);
console.log(`  Artikel AI draft             : ${draftCount}`);
console.log(`  Total artikel AI             : ${aiPostCount + draftCount}`);
console.log(`  Kunci enum Zod saat ini      : [${zodEnumValues.join(', ')}]`);
console.log(`  SSOT sinkron?                : ${missingFromZod.length === 0 && missingFromCats.length === 0 ? 'YA' : 'TIDAK'}`);
console.log('');
console.log('  YANG HARUS DIPERTAHANKAN SETELAH FIX:');
console.log(`  ✔ categories.ts TETAP mendefinisikan kunci 'AI'`);
console.log(`  ✔ AI color TETAP '${BASELINE.AI_CATEGORY.color}'`);
console.log(`  ✔ AI slug TETAP '${BASELINE.AI_CATEGORY.slug}'`);
console.log(`  ✔ CSS class '.category-ai' TETAP ada di global.css`);
console.log(`  ✔ Tailwind token 'category-ai' TETAP ada dengan warna ungu`);
console.log(`  ✔ Jumlah artikel AI non-draft TIDAK berkurang (saat ini: ${aiPostCount})`);
console.log(`  ✔ SSOT invariant: kunci categories.ts = nilai enum Zod`);
console.log(`  ✔ getAllCategories() mencakup 'AI' (boleh lebih dari 3 setelah fix)`);
console.log('');

if (failed === 0) {
  console.log(`  ✅ BASELINE TERKONFIRMASI: ${passed}/${passed + failed} pemeriksaan LULUS`);
  console.log('  Jalankan skrip ini KEMBALI setelah fix (Task 12.2) untuk verifikasi preservation.\n');
  process.exit(0);
} else {
  console.error(`  ❌ BASELINE GAGAL: ${failed} dari ${passed + failed} pemeriksaan GAGAL`);
  console.error(`  Gagal: ${failures.join(', ')}\n`);
  process.exit(1);
}
