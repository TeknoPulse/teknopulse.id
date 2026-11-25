/**
 * scripts/test-guides-pipeline.mjs
 *
 * Unit tests untuk logika murni pipeline webinsight → guide:
 *   - scripts/utils/schema-generator.ts (JSON-LD Guide/HowTo/FAQ)
 *   - scripts/utils/docx-parser.ts (deteksi evergreen + skor otoritas sumber)
 *   - scripts/utils/slug.ts (slug nama file guide)
 *   - src/utils/difficulty.ts (label & badge kesulitan)
 *
 * Mengikuti pola scripts/test-consent.mjs.
 * Run: node scripts/test-guides-pipeline.mjs
 */

import assert from 'node:assert/strict';
import {
  generateGuideSchema,
  generateHowToSchema,
  generateFAQSchema,
  detectSchemaType,
  extractStepsFromMarkdown,
  generateAllSchemas,
  schemasToJsonLd,
} from '../scripts/utils/schema-generator.ts';
import { detectEvergreenTopic, scoreSourceAuthority } from '../scripts/utils/docx-parser.ts';
import { slugifyTitle } from '../scripts/utils/slug.ts';
import {
  GUIDE_DIFFICULTIES,
  difficultyBadge,
  difficultyEmoji,
  difficultyLabel,
  parseDifficulty,
} from '../src/utils/difficulty.ts';

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

// ── Fixture ───────────────────────────────────────────────────────────────────

const FM = {
  title: 'Decision Models untuk Agen AI',
  slug: 'decision-models-ai-agent-panduan',
  description: 'Panduan Decision Models untuk agen AI.',
  publishedAt: '2026-11-24',
  updatedAt: '2026-11-25',
  tags: ['ai', 'decision-models'],
  category: 'AI',
  author: 'TeknoPulse Redaksi',
  difficulty: 'menengah',
  targetKeyword: 'decision models ai agent',
  secondaryKeywords: ['model keputusan ai'],
  sources: [
    {
      title: 'Latent Space — TypeSafe/Jev',
      url: 'https://www.latent.space/p/contoh',
      author: 'Latent Space',
      date: '2026-10-11',
    },
  ],
  readingTime: 12,
};

const STEPS = [
  { name: 'Buat akun', text: 'Daftar di situs resminya.' },
  { name: 'Ambil API key', text: 'Salin key dari dashboard.' },
  { name: 'Panggil endpoint', text: 'Kirim request pertama.' },
];

// ── Scenarios ─────────────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════════');
console.log('  pipeline guides — schema-generator.ts (14 scenarios)');
console.log('══════════════════════════════════════════════════════════\n');

// ── generateGuideSchema ──────────────────────────────────────────────────────

test('generateGuideSchema → @type Guide + url pakai slug frontmatter', () => {
  const s = generateGuideSchema(FM);
  assert.equal(s['@type'], 'Guide');
  assert.equal(s.url, 'https://teknopulse.id/guides/decision-models-ai-agent-panduan/');
});

test('generateGuideSchema tanpa slug → url diturunkan dari title', () => {
  const s = generateGuideSchema({ ...FM, slug: undefined });
  assert.equal(s.url, 'https://teknopulse.id/guides/decision-models-untuk-agen-ai/');
});

test('generateGuideSchema → datePublished/dateModified format YYYY-MM-DD', () => {
  const s = generateGuideSchema(FM);
  assert.equal(s.datePublished, '2026-11-24');
  assert.equal(s.dateModified, '2026-11-25');
});

test('generateGuideSchema → keywords gabungan target + secondary', () => {
  const s = generateGuideSchema(FM);
  assert.equal(s.keywords, 'decision models ai agent, model keputusan ai');
});

test('generateGuideSchema → sumber jadi mentions dengan author & tanggal', () => {
  const s = generateGuideSchema(FM);
  assert.equal(s.mentions.length, 1);
  assert.equal(s.mentions[0]['@type'], 'Article');
  assert.equal(s.mentions[0].author['@type'], 'Person');
  assert.equal(s.mentions[0].author.name, 'Latent Space');
  assert.equal(s.mentions[0].datePublished, '2026-10-11');
});

// ── generateHowToSchema ──────────────────────────────────────────────────────

test('generateHowToSchema → @type HowTo + url + totalTime PT12M', () => {
  const s = generateHowToSchema(FM, STEPS, [], [], 12);
  assert.equal(s['@type'], 'HowTo');
  assert.equal(s.url, 'https://teknopulse.id/guides/decision-models-ai-agent-panduan/');
  assert.equal(s.totalTime, 'PT12M');
});

test('generateHowToSchema tanpa totalTime → totalTime tidak terisi', () => {
  const s = generateHowToSchema(FM, STEPS);
  assert.equal(s.totalTime, undefined);
});

test('generateHowToSchema → step dipetakan ke HowToStep', () => {
  const s = generateHowToSchema(FM, STEPS);
  assert.equal(s.step.length, 3);
  assert.equal(s.step[0]['@type'], 'HowToStep');
  assert.equal(s.step[0].name, 'Buat akun');
});

// ── generateFAQSchema ────────────────────────────────────────────────────────

test('generateFAQSchema → Question/Answer terstruktur', () => {
  const s = generateFAQSchema([
    { question: 'Apa itu Decision Model?', answer: 'Model output terstruktur.' },
  ]);
  assert.equal(s['@type'], 'FAQPage');
  assert.equal(s.mainEntity[0]['@type'], 'Question');
  assert.equal(s.mainEntity[0].acceptedAnswer['@type'], 'Answer');
  assert.equal(s.mainEntity[0].acceptedAnswer.text, 'Model output terstruktur.');
});

// ── detectSchemaType + extractStepsFromMarkdown ──────────────────────────────

test('detectSchemaType → Guide saat tidak ada langkah', () => {
  assert.equal(detectSchemaType('# Judul\n\nParagraf biasa.'), 'Guide');
});

test('detectSchemaType → HowTo saat ada 3+ langkah', () => {
  const md = '## Langkah 1: Satu\n\nIsi\n\n## Langkah 2: Dua\n\nIsi\n\n## Langkah 3: Tiga\n\nIsi';
  assert.equal(detectSchemaType(md), 'HowTo');
});

test('extractStepsFromMarkdown → nama & isi langkah terpotong benar', () => {
  const md =
    '# Judul\n\n## Langkah 1: Buat akun\n\nDaftar dulu.\n\n## Langkah 2: Ambil key\n\nSalin dari dashboard.';
  const steps = extractStepsFromMarkdown(md);
  assert.equal(steps.length, 2);
  assert.equal(steps[0].name, '1. Buat akun');
  assert.match(steps[0].text, /Daftar dulu\./);
});

// ── generateAllSchemas + schemasToJsonLd ─────────────────────────────────────

test('generateAllSchemas → konten guide + faq frontmatter menghasilkan 2 skema', () => {
  const schemas = generateAllSchemas(
    { ...FM, faq: [{ question: 'Apa itu?', answer: 'Model output terstruktur.' }] },
    '# Judul\n\nParagraf.'
  );
  assert.equal(schemas.length, 2);
  assert.equal(schemas[0]['@type'], 'Guide');
  assert.equal(schemas[1]['@type'], 'FAQPage');
});

test('schemasToJsonLd → string JSON valid di dalam tag script', () => {
  const jsonLd = schemasToJsonLd([generateGuideSchema(FM)]);
  assert.match(jsonLd, /^<script type="application\/ld\+json">/);
  assert.match(jsonLd, /<\/script>$/);
  const inner = jsonLd
    .replace(/^<script type="application\/ld\+json">/, '')
    .replace(/<\/script>$/, '');
  const parsed = JSON.parse(inner);
  assert.equal(parsed['@type'], 'Guide');
});

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
console.log('  pipeline guides — difficulty.ts (6 scenarios)');
console.log('══════════════════════════════════════════════════════════\n');

test('difficultyEmoji → emoji per level', () => {
  assert.equal(difficultyEmoji('pemula'), '🟢');
  assert.equal(difficultyEmoji('menengah'), '🟡');
  assert.equal(difficultyEmoji('lanjutan'), '🔴');
});

test('difficultyLabel → label berkapital per level', () => {
  assert.equal(difficultyLabel('pemula'), 'Pemula');
  assert.equal(difficultyLabel('menengah'), 'Menengah');
  assert.equal(difficultyLabel('lanjutan'), 'Lanjutan');
});

test('difficultyBadge → emoji + spasi + label', () => {
  assert.equal(difficultyBadge('pemula'), '🟢 Pemula');
  assert.equal(difficultyBadge('lanjutan'), '🔴 Lanjutan');
});

test('GUIDE_DIFFICULTIES → tepat tiga level sesuai enum skema', () => {
  assert.deepEqual([...GUIDE_DIFFICULTIES], ['pemula', 'menengah', 'lanjutan']);
});

test('parseDifficulty → nilai valid diteruskan, nilai asing jadi undefined', () => {
  assert.equal(parseDifficulty('menengah'), 'menengah');
  assert.equal(parseDifficulty('expert'), undefined);
  assert.equal(parseDifficulty(''), undefined);
  assert.equal(parseDifficulty(null), undefined);
});

test('difficultyBadge → semua level menghasilkan string tidak kosong', () => {
  for (const d of GUIDE_DIFFICULTIES) {
    assert.ok(difficultyBadge(d).includes(difficultyLabel(d)));
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
