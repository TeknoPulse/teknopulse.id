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

const CURATION_DIR = path.resolve('../curation');
const TEMPLATE_PATH = path.resolve('scripts/templates/guide-template.md');
const GUIDES_DIR = path.resolve('src/content/guides');
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
  description: string;
  metaDescription: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  category: string;
  author: string;
  draft: boolean;
  difficulty: 'pemula' | 'menengah' | 'lanjutan';
  targetKeyword: string;
  secondaryKeywords: string[];
  sources: Array<{
    title: string;
    url: string;
    author?: string;
    date?: string;
  }>;
  faq?: Array<{ question: string; answer: string }>;
  coverImage?: string;
  coverImageAlt?: string;
  ogImage?: string;
  readingTime: number;
}

function getTodayString(): string {
  // Use ISO datetime with timezone like posts do
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const sign = offset <= 0 ? '+' : '-';
  const pad = (n: number) => String(Math.abs(n)).padStart(2, '0');
  const hours = pad(Math.floor(Math.abs(offset) / 60));
  const minutes = pad(Math.abs(offset) % 60);
  const timezone = `${sign}${hours}:${minutes}`;
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}${timezone}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 60);
}

// 200 wpm, sama dengan src/utils/readingTime.ts (SSOT). Ditulis ulang di sini
// karena script ini hanya punya wordCount hasil parse .docx, bukan teks artikel.
const WORDS_PER_MINUTE = 200;

function estimateReadingTime(wordCount: number): number {
  return Math.ceil(wordCount / WORDS_PER_MINUTE);
}

function inferDifficulty(
  wordCount: number,
  targetKeyword: string
): 'pemula' | 'menengah' | 'lanjutan' {
  const lower = targetKeyword.toLowerCase();
  if (/\b(pemula|dasar|basic|intro|pengenalan)\b/.test(lower)) return 'pemula';
  if (/\b(lanjutan|advanced|optimasi|optimization|arsitektur|architecture)\b/.test(lower))
    return 'lanjutan';
  if (wordCount > 2500) return 'menengah';
  return 'pemula';
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
  const publishDate = getTodayString();
  const readingTime = estimateReadingTime(item.wordCount);
  const difficulty = inferDifficulty(item.wordCount, keywordData.targetKeyword);
  const tags = generateTags(
    item.category,
    keywordData.targetKeyword,
    keywordData.secondaryKeywords
  );

  return {
    title: item.title,
    description: `Panduan lengkap ${item.title.toLowerCase()} untuk pemula hingga menengah. ${item.notes || 'Termasuk langkah-langkah praktis, tips, dan troubleshooting.'}`,
    metaDescription: `Belajar ${item.title.toLowerCase()} dengan panduan step-by-step TeknoPulse. ${keywordData.targetKeyword} + ${keywordData.secondaryKeywords.slice(0, 2).join(', ')}. Cocok untuk pemula.`,
    publishedAt: publishDate,
    updatedAt: publishDate,
    tags,
    category: item.category,
    author: 'TeknoPulse Redaksi',
    draft: true,
    difficulty,
    targetKeyword: keywordData.targetKeyword,
    secondaryKeywords: keywordData.secondaryKeywords,
    sources: [
      {
        title: item.title,
        url: item.sourceUrl,
        author: item.author,
        date: item.date,
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

  await fsp.mkdir(GUIDES_DIR, { recursive: true });

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

  for (const item of approved) {
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
      DESCRIPTION: fm.description,
      META_DESCRIPTION: fm.metaDescription,
      PUBLISH_DATE: fm.publishedAt,
      UPDATE_DATE: fm.updatedAt,
      TAGS: JSON.stringify(fm.tags),
      CATEGORY: fm.category,
      DIFFICULTY: fm.difficulty,
      DIFFICULTY_LABEL:
        fm.difficulty === 'pemula'
          ? 'Pemula'
          : fm.difficulty === 'menengah'
            ? 'Menengah'
            : 'Lanjutan',
      TARGET_KEYWORD: fm.targetKeyword,
      SECONDARY_KEYWORDS: JSON.stringify(fm.secondaryKeywords),
      SOURCES: JSON.stringify(fm.sources),
      FAQ: '[]',
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
      FAQ_ITEMS: '',
      CHECKLIST: '',
    };

    const body = renderTemplate(template, templateData);
    const content = yaml + '\n\n' + body;

    const slug = slugify(item.title);
    const outputPath = path.join(GUIDES_DIR, `${slug}.md`);

    await fsp.writeFile(outputPath, content, 'utf-8');
    console.log(`  ✅ Written: ${outputPath}`);

    // Update manifest
    manifest.files[item.filename] = {
      ...manifest.files[item.filename],
      status: 'drafted',
      draftedAt: new Date().toISOString(),
      guideSlug: slug,
      targetKeyword: fm.targetKeyword,
      secondaryKeywords: fm.secondaryKeywords,
      outputPath,
    };
  }

  await saveManifest(MANIFEST_PATH, manifest);

  console.log('\n📋 NEXT STEPS:');
  console.log('1. Edit each .md file in web/src/content/guides/ to fill in content');
  console.log('2. Add FAQ, steps, tips, troubleshooting, checklist');
  console.log('3. Run antislop-copywriting checklist on each article');
  console.log('4. Create PR for review');
  console.log('5. After merge, run `pnpm curate` again to update manifest to published');
}

main().catch(console.error);
