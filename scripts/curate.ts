#!/usr/bin/env node
/**
 * Curate Script
 * Auto-shortlist evergreen candidates from webinsight folder
 * Output: curation/YYYY-MM-DD.json with shortlisted topics
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { parseDocx, detectEvergreenTopic, scoreSourceAuthority } from './utils/docx-parser.js';
import { loadManifest, saveManifest, type Manifest } from './utils/manifest.js';

const WEBINSIGHT_DIR = path.resolve('../webinsight');
const CURATION_DIR = path.resolve('../curation');
const MANIFEST_PATH = path.resolve('../.webinsight/manifest.json');

interface SourceFile {
  filename: string;
  filepath: string;
  title: string;
  wordCount: number;
  metadata: {
    author?: string;
    sourceUrl?: string;
    date?: string;
    category?: string;
  };
  evergreen: {
    isEvergreen: boolean;
    reasons: string[];
  };
  authorityScore: number;
  status: 'new' | 'processed' | 'skipped';
}

interface CurationOutput {
  generatedAt: string;
  totalScanned: number;
  newFiles: number;
  shortlisted: Array<{
    filename: string;
    title: string;
    wordCount: number;
    sourceUrl: string;
    author: string;
    date: string;
    category: string;
    authorityScore: number;
    evergreenReasons: string[];
    approved: boolean; // owner sets this manually
    notes: string;
  }>;
}

// Hanya tanggal (YYYY-MM-DD), dipakai sebagai nama file curation.
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

async function scanWebinsight(manifest: Manifest): Promise<SourceFile[]> {
  const files = await fs.readdir(WEBINSIGHT_DIR);
  const docxFiles = files.filter((f) => f.endsWith('.docx') || f.endsWith('.md.docx'));

  const results: SourceFile[] = [];

  for (const filename of docxFiles) {
    const filepath = path.join(WEBINSIGHT_DIR, filename);

    // Check if already in manifest
    const manifestEntry = manifest.files?.[filename];
    const status = manifestEntry ? 'processed' : 'new';

    try {
      const parsed = await parseDocx(filepath);
      const evergreen = detectEvergreenTopic(parsed.rawText);
      const authorityScore = scoreSourceAuthority(
        parsed.metadata.sourceUrl || '',
        parsed.metadata.author || ''
      );

      results.push({
        filename,
        filepath,
        title: parsed.title || filename.replace(/\.md?\.docx$/, ''),
        wordCount: parsed.wordCount,
        metadata: parsed.metadata,
        evergreen,
        authorityScore,
        status,
      });
    } catch (error) {
      console.error(`Failed to parse ${filename}:`, error);
      results.push({
        filename,
        filepath,
        title: filename,
        wordCount: 0,
        metadata: {},
        evergreen: { isEvergreen: false, reasons: ['Parse error'] },
        authorityScore: 0,
        status: 'skipped',
      });
    }
  }

  return results;
}

function filterShortlist(files: SourceFile[]): SourceFile[] {
  return (
    files
      .filter((f) => f.status === 'new')
      .filter((f) => f.wordCount >= 800) // minimum length
      .filter((f) => f.evergreen.isEvergreen)
      .filter((f) => f.authorityScore >= 6) // minimum authority
      .sort((a, b) => b.authorityScore - a.authorityScore) // highest authority first
      // Shortlist 5-8 kandidat per minggu (issue 08): ambil 8 teratas saja,
      // biar review owner tetap ringkas.
      .slice(0, 8)
  );
}

async function main(): Promise<void> {
  console.log('🔍 Starting curation scan...');

  await fs.mkdir(CURATION_DIR, { recursive: true });

  const manifest = await loadManifest(MANIFEST_PATH);
  const allFiles = await scanWebinsight(manifest);

  const newFiles = allFiles.filter((f) => f.status === 'new');
  const shortlisted = filterShortlist(allFiles);

  console.log(`📊 Scanned: ${allFiles.length} files`);
  console.log(`🆕 New: ${newFiles.length}`);
  console.log(`✅ Shortlisted: ${shortlisted.length}`);

  // Show shortlisted
  for (const f of shortlisted) {
    console.log(`  • ${f.filename} (score: ${f.authorityScore}, words: ${f.wordCount})`);
    console.log(`    ${f.evergreen.reasons.join(', ')}`);
  }

  const output: CurationOutput = {
    generatedAt: new Date().toISOString(),
    totalScanned: allFiles.length,
    newFiles: newFiles.length,
    shortlisted: shortlisted.map((f) => ({
      filename: f.filename,
      title: f.title,
      wordCount: f.wordCount,
      sourceUrl: f.metadata.sourceUrl || '',
      author: f.metadata.author || '',
      date: f.metadata.date || '',
      category: f.metadata.category || 'AI',
      authorityScore: f.authorityScore,
      evergreenReasons: f.evergreen.reasons,
      approved: false, // Owner sets to true manually
      notes: '',
    })),
  };

  const outputPath = path.join(CURATION_DIR, `${getTodayDate()}.json`);
  await fs.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf-8');

  console.log(`\n📝 Output written to: ${outputPath}`);
  console.log('\n📋 NEXT STEPS:');
  console.log('1. Open the JSON file and set "approved": true for topics you want to proceed with');
  console.log('2. Add any "notes" for the drafting phase');
  console.log('3. Run: pnpm draft-guide');

  // Update manifest with new files
  for (const f of newFiles) {
    manifest.files[f.filename] = {
      status: 'curated',
      curatedAt: new Date().toISOString(),
      wordCount: f.wordCount,
      authorityScore: f.authorityScore,
      evergreen: f.evergreen.isEvergreen,
    };
  }

  await saveManifest(MANIFEST_PATH, manifest);
}

main().catch(console.error);
