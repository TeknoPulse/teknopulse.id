#!/usr/bin/env node
/**
 * Draft Guide Script
 * Generate guide markdown files from approved curation shortlist
 * Uses template and keyword research data
 */

import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';
import { generateResearchChecklist } from './utils/keyword-research.js';
import { loadManifest, saveManifest } from './utils/manifest.js';
import { fitMetaDescription } from './utils/meta-description.js';
import { slugifyTitle } from './utils/slug.js';

const CURATION_DIR = path.resolve('../curation');
const TEMPLATE_PATH = path.resolve('scripts/templates/guide-template.md');
const POSTS_DIR = path.resolve('src/content/posts');
const MANIFEST_PATH = path.resolve('../.webinsight/manifest.json');

interface CurationItem {
  filename: string;
  title: string;
  wordCount: number;
  sourceUrl: string;
  author: string;
  date: string;
  category: string;
  authorityScore: number;
  evergreenReasons: string[];
  approved: boolean;
  notes: string;
}

interface CurationFile {
  generatedAt: string;
  totalScanned: number;
  newFiles: number;
  shortlisted: CurationItem[];
}

interface GuideFrontmatter {
  title: string;
  summary: string;
  metaDescription: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  category: string;
  author: string;
  draft: boolean;
  format: 'panduan-pembaca';
  source: Array<{
    name: string;
    url: string;
    primary: boolean;
  }>;
  faq?: Array<{ question: string; answer: string }>;
  coverImage?: string;
  coverImageAlt?: string;
  ogImage?: string;
  readingTime: number;
}

// ISO 8601 lengkap dengan offset zona waktu lokal (dipakai untuk
// publishedAt/updatedAt di frontmatter), bukan sekadar tanggal.
function getTodayIso(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const sign = offset <= 0 ? '+' : '-';
  const pad = (n: number) => String(Math.abs(n)).padStart(2, '0');
  const hours = pad(Math.floor(Math.abs(offset) / 60));
  const minutes = pad(Math.abs(offset) % 60);
  const timezone = `${sign}${hours}:${minutes}`;
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}${timezone}`;
}

// 200 wpm, sama dengan src/utils/readingTime.ts (SSOT). Ditulis ulang di sini
// karena script ini hanya punya wordCount hasil parse .docx, bukan teks artikel.
const WORDS_PER_MINUTE = 200;

function estimateReadingTime(wordCount: number): number {
  return Math.ceil(wordCount / WORDS_PER_MINUTE);
}

function generateTags(
  category: string,
  targetKeyword: string,
  secondaryKeywords: string[]
): string[] {
  const baseTags = [category.toLowerCase()];
  const keywordTags = [targetKeyword, ...secondaryKeywords]
    .map((k) => k.toLowerCase().replace(/\s+/g, '-'))
    .slice(0, 4);
  return [...new Set([...baseTags, ...keywordTags])].slice(0, 5);
}

function loadTemplate(): string {
  const content = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
  console.log(
    `📄 Template loaded (${content.length} chars), starts with: ${content.substring(0, 50)}`
  );
  return content;
}

function renderTemplate(template: string, data: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  // Remove any unmatched {{#each}} and {{#if}} blocks (since we're not using them yet)
  result = result.replace(/\{\{#each\s+\w+\}\}[\s\S]*?\{\{\/each\}\}/g, '');
  result = result.replace(/\{\{#if\s+\w+\}\}[\s\S]*?\{\{\/if\}\}/g, '');
  return result;
}

async function findLatestCuration(): Promise<string | null> {
  const files = await fsp.readdir(CURATION_DIR);
  const jsonFiles = files
    .filter((f) => f.endsWith('.json'))
    .sort()
    .reverse();
  return jsonFiles[0] ? path.join(CURATION_DIR, jsonFiles[0]) : null;
}

function buildFrontmatter(
  item: CurationItem,
  keywordData: { targetKeyword: string; secondaryKeywords: string[] }
): GuideFrontmatter {
  const publishDate = getTodayIso();
  const readingTime = estimateReadingTime(item.wordCount);
  const tags = generateTags(
    item.category,
    keywordData.targetKeyword,
    keywordData.secondaryKeywords
  );

  const keywordParts = [
    keywordData.targetKeyword,
    keywordData.secondaryKeywords.slice(0, 2).join(', '),
  ].filter((part) => part.length > 0);

  return {
    title: item.title,
    summary: `Panduan lengkap ${item.title.toLowerCase()} untuk pemula hingga menengah. ${item.notes || 'Termasuk langkah-langkah praktis, tips, dan troubleshooting.'}`,
    metaDescription: fitMetaDescription(
      `Belajar ${item.title.toLowerCase()} dengan panduan step-by-step TeknoPulse. ${keywordParts.join(' + ')}. Cocok untuk pemula.`
    ),
    publishedAt: publishDate,
    updatedAt: publishDate,
    tags,
    category: item.category,
    author: 'TeknoPulse Redaksi',
    draft: true,
    format: 'panduan-pembaca',
    source: [
      {
        name: item.title,
        url: item.sourceUrl,
        primary: true,
      },
    ],
    faq: undefined, // Will be filled manually
    coverImage: undefined,
    coverImageAlt: undefined,
    ogImage: undefined,
    readingTime,
  };
}

function frontmatterToYaml(fm: GuideFrontmatter): string {
  const lines: string[] = ['---'];

  for (const [key, value] of Object.entries(fm)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      if (typeof value[0] === 'object') {
        lines.push(`${key}:`);
        for (const item of value) {
          lines.push('  -');
          for (const [k, v] of Object.entries(item)) {
            if (v === undefined || v === null || v === '') continue;
            lines.push(`    ${k}: ${JSON.stringify(v)}`);
          }
        }
      } else {
        lines.push(`${key}: [${value.map((v) => JSON.stringify(v)).join(', ')}]`);
      }
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else if (typeof value === 'number') {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    }
  }

  lines.push('---');
  return lines.join('\n');
}

async function main(): Promise<void> {
  console.log('📝 Starting guide drafting...');

  await fsp.mkdir(POSTS_DIR, { recursive: true });

  const curationPath = await findLatestCuration();
  if (!curationPath) {
    console.error('❌ No curation file found. Run `pnpm curate` first.');
    process.exit(1);
  }

  console.log(`📂 Reading: ${curationPath}`);
  const curationData: CurationFile = JSON.parse(await fsp.readFile(curationPath, 'utf-8'));

  const approved = curationData.shortlisted.filter((item) => item.approved);
  if (approved.length === 0) {
    console.log('⚠️ No approved items in curation. Set "approved": true in the JSON first.');
    return;
  }

  console.log(`✅ Found ${approved.length} approved topic(s)`);

  const template = loadTemplate();
  const manifest = await loadManifest(MANIFEST_PATH);

  // Yang sudah drafted/published tidak disentuh lagi — status & file-nya final.
  const pending = approved.filter((item) => {
    const status = manifest.files[item.filename]?.status;
    if (status === 'drafted' || status === 'published') {
      console.log(`  ⏭️  Skip ${item.filename}: sudah ${status}`);
      return false;
    }
    return true;
  });

  // Slug dihitung untuk SEMUA item sebelum ada file yang ditulis: dua item
  // dengan slug sama adalah kolisi — resolusi manual, semuanya diskip.
  const slugByFilename = new Map(pending.map((item) => [item.filename, slugifyTitle(item.title)]));
  const slugCount = new Map<string, number>();
  for (const slug of slugByFilename.values()) {
    slugCount.set(slug, (slugCount.get(slug) ?? 0) + 1);
  }
  const colliding = new Set(
    [...slugCount.entries()].filter(([, n]) => n > 1).map(([slug]) => slug)
  );
  // Slug yang sudah punya file di src/content/posts/ juga kolisi — jangan
  // ada yang ditulis setengah-setengah (flag 'wx' tetap jadi safety net).
  for (const slug of slugByFilename.values()) {
    if (fs.existsSync(path.join(POSTS_DIR, `${slug}.md`))) colliding.add(slug);
  }
  for (const slug of colliding) {
    const names = pending.filter((item) => slugByFilename.get(item.filename) === slug);
    console.error(`  ❌ Kolisi slug "${slug}": ${names.map((n) => n.filename).join(', ')}`);
    console.error('     Perlu resolusi manual (rename judul / set slug di frontmatter).');
  }

  for (const item of pending) {
    const slug = slugByFilename.get(item.filename)!;
    if (colliding.has(slug)) continue;

    console.log(`\n📄 Drafting: ${item.title}`);
    console.log(`\n📄 Drafting: ${item.title}`);

    // Check if keyword data exists in notes or prompt for it
    let targetKeyword = '';
    let secondaryKeywords: string[] = [];

    // Try to parse from notes (format: "kw: target | secondary1, secondary2")
    const kwMatch = item.notes.match(/kw:\s*([^|]+)(?:\|\s*(.+))?/i);
    if (kwMatch) {
      targetKeyword = kwMatch[1].trim();
      secondaryKeywords = kwMatch[2] ? kwMatch[2].split(',').map((s) => s.trim()) : [];
    }

    if (!targetKeyword) {
      console.log(`  ⚠️  No keyword data in notes. Please add to curation JSON:`);
      console.log(`     "notes": "kw: your-target-keyword | secondary1, secondary2"`);
      console.log(`  💡 Or run keyword research checklist:`);
      console.log(generateResearchChecklist(item.title));
      continue;
    }

    const keywordData = { targetKeyword, secondaryKeywords };
    const fm = buildFrontmatter(item, keywordData);
    const yaml = frontmatterToYaml(fm);

    // Prepare template data
    const templateData: Record<string, string> = {
      TITLE: item.title,
      DESCRIPTION: fm.summary,
      META_DESCRIPTION: fm.metaDescription,
      PUBLISH_DATE: fm.publishedAt,
      UPDATE_DATE: fm.updatedAt,
      TAGS: JSON.stringify(fm.tags),
      CATEGORY: fm.category,
      SOURCES: JSON.stringify(fm.source),
      COVER_IMAGE: '',
      COVER_IMAGE_ALT: '',
      OG_IMAGE: '',
      READING_TIME: fm.readingTime.toString(),
      PAIN_POINT: `Banyak orang awam bingung soal ${item.title.toLowerCase()}. Artikel berbahasa Inggris terlalu teknis, tutorial YouTube terlalu cepat, dan dokumentasi resmi membingungkan.`,
      PERSONAL_NOTE: `Aku sendiri pernah stuck di sini — jadi aku tulis panduan ini biar kamu nggak perlu trial-error lama.`,
      PREREQUISITES: 'Akun Google/GitHub (gratis), koneksi internet, 15-30 menit waktu',
      ESTIMATED_TIME: `${fm.readingTime} menit bacaan + 30-60 menit praktek`,
      STEPS: '', // Will be filled manually
      TIPS: '',
      TROUBLESHOOTING: '',
      CHECKLIST: '',
    };

    const body = renderTemplate(template, templateData);
    const content = yaml + '\n\n' + body;

    const outputPath = path.join(POSTS_DIR, `${slug}.md`);

    // 'wx': gagal kalau file sudah ada — draf lama tidak boleh ditimpa,
    // dan manifest tidak diubah untuk item yang diskip.
    try {
      await fsp.writeFile(outputPath, content, { encoding: 'utf-8', flag: 'wx' });
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'EEXIST') {
        console.log(`  ⏭️  Skip ${item.filename}: ${outputPath} sudah ada`);
        continue;
      }
      throw err;
    }
    console.log(`  ✅ Written: ${outputPath}`);

    // Update manifest
    manifest.files[item.filename] = {
      ...manifest.files[item.filename],
      status: 'drafted',
      draftedAt: new Date().toISOString(),
      guideSlug: slug,
      targetKeyword: keywordData.targetKeyword,
      secondaryKeywords: keywordData.secondaryKeywords,
      outputPath,
    };
  }

  await saveManifest(MANIFEST_PATH, manifest);

  console.log('\n📋 NEXT STEPS:');
  console.log('1. Edit each .md file in web/src/content/posts/ to fill in content');
  console.log('2. Add FAQ (frontmatter `faq`), steps, tips, troubleshooting, checklist');
  console.log('3. Run antislop-copywriting checklist on each article');
  console.log('4. Set `draft: false` di frontmatter, lalu buka PR untuk review & merge');
  console.log('5. Setelah PR di-merge: `pnpm publish:guide <slug> --pr=<url>`');
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
