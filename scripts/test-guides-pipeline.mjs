/**
 * scripts/test-guides-pipeline.mjs
 *
 * Unit tests untuk logika murni pipeline webinsight → guide:
 *   - scripts/utils/docx-parser.ts (deteksi evergreen + skor otoritas sumber)
 *   - scripts/utils/slug.ts (slug nama file guide)
 *   - src/utils/difficulty.ts (label & badge kesulitan)
 *
 * Mengikuti pola scripts/test-consent.mjs.
 * Run: node scripts/test-guides-pipeline.mjs
 */

import assert from 'node:assert/strict';
import { detectEvergreenTopic, scoreSourceAuthority } from '../scripts/utils/docx-parser.ts';
import { slugifyTitle } from '../scripts/utils/slug.ts';
import { difficultyBadge } from '../src/utils/difficulty.ts';

// ── Test runner ───────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
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

test('detectEvergreenTopic → teks panduan = evergreen', () => {
  const r = detectEvergreenTopic(
    'Cara membuat agen AI: panduan langkah demi langkah untuk pemula. Tips memilih tools.'
  );
  assert.equal(r.isEvergreen, true);
  assert.ok(r.reasons.some((x) => x.includes('evergreen')));
});

test('detectEvergreenTopic → teks berita launch = bukan evergreen', () => {
  const r = detectEvergreenTopic(
    'OpenAI meluncurkan model baru hari ini. Pendanaan Series B senilai jutaan dolar diumumkan. Acara konferensi diadakan minggu depan.'
  );
  assert.equal(r.isEvergreen, false);
});

test('detectEvergreenTopic → teks pendek tanpa indikator = bukan evergreen', () => {
  assert.equal(detectEvergreenTopic('Halo dunia.').isEvergreen, false);
});

test('scoreSourceAuthority → domain otoritas dapat skor tinggi', () => {
  assert.equal(scoreSourceAuthority('https://www.latent.space/p/x', ''), 10);
  assert.equal(scoreSourceAuthority('https://newsletter.pragmaticengineer.com/p/y', ''), 10);
  assert.equal(scoreSourceAuthority('https://bytebytego.com/z', ''), 10);
});

test('scoreSourceAuthority → author dikenal dapat boost +1 (maks 10)', () => {
  assert.equal(scoreSourceAuthority('https://mattpocock.uk/x', 'Matt Pocock'), 10);
  assert.equal(scoreSourceAuthority('https://ideabrowser.com/x', 'nate'), 8);
});

test('scoreSourceAuthority → sumber tak dikenal dapat skor default 5', () => {
  assert.equal(scoreSourceAuthority('https://contoh-blog-lain.com/x', 'Penulis Anonim'), 5);
});

// ── slug.ts ──────────────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════════');
console.log('  pipeline guides — slug.ts (4 scenarios)');
console.log('══════════════════════════════════════════════════════════\n');

test('slugifyTitle → huruf kecil, spasi jadi strip', () => {
  assert.equal(slugifyTitle('Decision Models untuk Agen AI'), 'decision-models-untuk-agen-ai');
});

test('slugifyTitle → tanda baca dibuang, strip ganda diringkas', () => {
  assert.equal(slugifyTitle('Apa itu CVE? — Panduan!'), 'apa-itu-cve-panduan');
});

test('slugifyTitle → dipotong di batas panjang tanpa strip menggantung', () => {
  const out = slugifyTitle('kata '.repeat(40), 20);
  assert.ok(out.length <= 20, `panjang ${out.length} > 20`);
  assert.ok(!out.endsWith('-'), `masih ada strip di akhir: ${out}`);
});

test('slugifyTitle → judul kosong jadi string kosong, bukan crash', () => {
  assert.equal(slugifyTitle(''), '');
});

// ── src/utils/difficulty.ts ──────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════════');
console.log('  pipeline guides — difficulty.ts (2 scenarios)');
console.log('══════════════════════════════════════════════════════════\n');

test('difficultyBadge → emoji + spasi + label', () => {
  assert.equal(difficultyBadge('pemula'), '🟢 Pemula');
  assert.equal(difficultyBadge('lanjutan'), '🔴 Lanjutan');
});

test('difficultyBadge → semua level menghasilkan string tidak kosong', () => {
  for (const d of ['pemula', 'menengah', 'lanjutan']) {
    assert.ok(difficultyBadge(d).length > 0);
  }
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
