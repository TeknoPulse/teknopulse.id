/**
 * scripts/test-guides-pipeline.mjs
 *
 * Unit tests untuk logika murni pipeline webinsight → guide:
 *   - scripts/utils/docx-parser.ts (deteksi evergreen + skor otoritas sumber)
 *   - scripts/utils/slug.ts (slug nama file guide)
 *   - scripts/utils/manifest.ts (load/save .webinsight/manifest.json)
 *   - scripts/utils/meta-description.ts (fitMetaDescription 120–155)
 *
 * Mengikuti pola scripts/test-consent.mjs.
 * Run: pnpm test:guides
 */

import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { detectEvergreenTopic, scoreSourceAuthority } from '../scripts/utils/docx-parser.ts';
import { emptyManifest, loadManifest, saveManifest } from '../scripts/utils/manifest.ts';
import { fitMetaDescription } from '../scripts/utils/meta-description.ts';
import { slugifyTitle } from '../scripts/utils/slug.ts';

// ── Test runner ───────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures = [];

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ PASS  ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL  ${name}\n         ${err.message}`);
    failed++;
    failures.push(name);
  }
}

// ── docx-parser.ts ───────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════════');
console.log('  pipeline guides — docx-parser.ts (6 scenarios)');
console.log('══════════════════════════════════════════════════════════\n');

await test('detectEvergreenTopic → teks panduan = evergreen', () => {
  const r = detectEvergreenTopic(
    'Cara membuat agen AI: panduan langkah demi langkah untuk pemula. Tips memilih tools.'
  );
  assert.equal(r.isEvergreen, true);
  assert.ok(r.reasons.some((x) => x.includes('evergreen')));
});

await test('detectEvergreenTopic → teks berita launch = bukan evergreen', () => {
  const r = detectEvergreenTopic(
    'OpenAI meluncurkan model baru hari ini. Pendanaan Series B senilai jutaan dolar diumumkan. Acara konferensi diadakan minggu depan.'
  );
  assert.equal(r.isEvergreen, false);
});

await test('detectEvergreenTopic → teks pendek tanpa indikator = bukan evergreen', () => {
  assert.equal(detectEvergreenTopic('Halo dunia.').isEvergreen, false);
});

await test('scoreSourceAuthority → domain otoritas dapat skor tinggi', () => {
  assert.equal(scoreSourceAuthority('https://www.latent.space/p/x', ''), 10);
  assert.equal(scoreSourceAuthority('https://newsletter.pragmaticengineer.com/p/y', ''), 10);
  assert.equal(scoreSourceAuthority('https://bytebytego.com/z', ''), 10);
});

await test('scoreSourceAuthority → author dikenal dapat boost +1 (maks 10)', () => {
  assert.equal(scoreSourceAuthority('https://mattpocock.uk/x', 'Matt Pocock'), 10);
  assert.equal(scoreSourceAuthority('https://ideabrowser.com/x', 'nate'), 8);
});

await test('scoreSourceAuthority → sumber tak dikenal dapat skor default 5', () => {
  assert.equal(scoreSourceAuthority('https://contoh-blog-lain.com/x', 'Penulis Anonim'), 5);
});

// ── slug.ts ──────────────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════════');
console.log('  pipeline guides — slug.ts (4 scenarios)');
console.log('══════════════════════════════════════════════════════════\n');

await test('slugifyTitle → huruf kecil, spasi jadi strip', () => {
  assert.equal(slugifyTitle('Decision Models untuk Agen AI'), 'decision-models-untuk-agen-ai');
});

await test('slugifyTitle → tanda baca dibuang, strip ganda diringkas', () => {
  assert.equal(slugifyTitle('Apa itu CVE? — Panduan!'), 'apa-itu-cve-panduan');
});

await test('slugifyTitle → dipotong di batas panjang tanpa strip menggantung', () => {
  const out = slugifyTitle('kata '.repeat(40), 20);
  assert.ok(out.length <= 20, `panjang ${out.length} > 20`);
  assert.ok(!out.endsWith('-'), `masih ada strip di akhir: ${out}`);
});

await test('slugifyTitle → judul kosong jadi string kosong, bukan crash', () => {
  assert.equal(slugifyTitle(''), '');
});

// ── scoreSourceAuthority — hostname matching ─────────────────────────────────

test('scoreSourceAuthority → subdomain host cocok, URL spoof tidak', () => {
  assert.equal(scoreSourceAuthority('https://newsletter.pragmaticengineer.com/p/x', ''), 10);
  assert.equal(scoreSourceAuthority('https://www.latent.space/p/x', ''), 10);
  assert.equal(scoreSourceAuthority('https://evil.com/?u=latent.space', ''), 5);
  assert.equal(scoreSourceAuthority('not a url', ''), 5);
});

// ── meta-description.ts ──────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════════');
console.log('  pipeline guides — meta-description.ts (3 scenarios)');
console.log('══════════════════════════════════════════════════════════\n');

test('fitMetaDescription → input pendek dipad ke rentang 120–155', () => {
  const out = fitMetaDescription('Belajar tips singkat.');
  assert.ok(out.length >= 120 && out.length <= 155, `panjang ${out.length}`);
});

test('fitMetaDescription → input panjang dipotong 120–155 & diakhiri titik', () => {
  const out = fitMetaDescription(
    'Panduan sangat panjang tentang topik yang amat kompleks dan penuh detail teknis ' +
      'yang seharusnya tidak muat dalam batas seratus lima puluh lima karakter meta.'
  );
  assert.ok(out.length >= 120 && out.length <= 155, `panjang ${out.length}`);
  assert.ok(out.endsWith('.'));
});

test('fitMetaDescription → input sudah di rentang tidak diubah', () => {
  const ok =
    'Panduan Decision Models untuk agen AI: model yang menjawab ya/tidak, pilihan, atau ' +
    'skor hingga 10x lebih cepat. Cara kerja dan cara memakainya.';
  assert.equal(fitMetaDescription(ok), ok);
});

// ── manifest.ts ──────────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════════');
console.log('  pipeline guides — manifest.ts (4 scenarios)');
console.log('══════════════════════════════════════════════════════════\n');

await test('loadManifest → file tidak ada menghasilkan manifest kosong', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'tp-manifest-'));
  const mf = await loadManifest(path.join(dir, 'tidak-ada.json'));
  assert.deepEqual(mf, emptyManifest());
});

await test('loadManifest → JSON rusak melempar error', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'tp-manifest-'));
  const p = path.join(dir, 'manifest.json');
  await fs.writeFile(p, '{ rusak,', 'utf-8');
  await assert.rejects(() => loadManifest(p));
});

await test('loadManifest → status tidak dikenal melempar error', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'tp-manifest-'));
  const p = path.join(dir, 'manifest.json');
  await fs.writeFile(
    p,
    JSON.stringify({ version: 1, files: { 'a.docx': { status: 'bogus' } } }),
    'utf-8'
  );
  await assert.rejects(() => loadManifest(p));
});

await test('saveManifest → round-trip valid & tidak menyisakan file .tmp', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'tp-manifest-'));
  const p = path.join(dir, 'manifest.json');
  const mf = { version: 1, files: { 'a.docx': { status: 'curated' } } };
  await saveManifest(p, mf);
  const loaded = await loadManifest(p);
  assert.equal(loaded.files['a.docx'].status, 'curated');
  const leftovers = (await fs.readdir(dir)).filter((f) => f.endsWith('.tmp'));
  assert.equal(leftovers.length, 0);
});

// ── Summary ───────────────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════════');
if (failed === 0) {
  console.log(`  ✅ ALL PASS: ${passed}/${passed + failed} scenarios passed\n`);
  process.exit(0);
} else {
  console.error(`  ❌ FAILED: ${failed}/${passed + failed} scenarios failed`);
  console.error(`  Failures: ${failures.join(', ')}\n`);
  process.exit(1);
}
