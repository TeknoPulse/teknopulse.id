#!/usr/bin/env node
/**
 * Publish Guide Script
 *
 * Menandai satu atau lebih guide sebagai published di manifest setelah PR
 * digabung (issue 11 langkah 7: status published + publishedAt + prUrl).
 *
 * Sebelum ini tidak ada kode yang pernah menulis status `published`:
 * curate.ts hanya menulis `curated` untuk file baru, draft-guide.ts `drafted`.
 *
 * Usage:
 *   pnpm publish:guide <slug> [--pr=<url>]
 *   pnpm publish:guide --all-approved
 *
 * `--all-approved` menandai semua entri berstatus `drafted` yang file guide-nya
 * sudah ada dan tidak draft.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { loadManifest, saveManifest, markPublished } from './utils/manifest.js';

const REPO_ROOT = path.resolve('..');
const MANIFEST_PATH = path.join(REPO_ROOT, '.webinsight/manifest.json');
const POSTS_DIR = path.resolve('src/content/posts');

async function guideIsLive(slug: string): Promise<boolean> {
  try {
    const raw = await fs.readFile(path.join(POSTS_DIR, `${slug}.md`), 'utf-8');
    // Draft tidak di-build, jadi belum bisa disebut published. Cek HANYA di
    // frontmatter — teks "draft: false" di body tidak boleh dihitung.
    const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)?.[1];
    if (!fm) return false;
    return /^draft:\s*false(?:\s+#.*)?\s*$/m.test(fm);
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const prArg = args.find((a) => a.startsWith('--pr='));
  const prUrl = prArg?.slice('--pr='.length);
  const allApproved = args.includes('--all-approved');
  const slugArg = args.find((a) => !a.startsWith('--'));

  if (!allApproved && !slugArg) {
    console.error('Usage: pnpm publish:guide <slug> [--pr=<url>] | --all-approved');
    process.exit(1);
  }

  const manifest = await loadManifest(MANIFEST_PATH);
  const now = new Date().toISOString();

  const candidates = Object.entries(manifest.files).filter(([, entry]) =>
    allApproved ? entry.status === 'drafted' : entry.guideSlug === slugArg
  );

  if (candidates.length === 0) {
    console.error(
      allApproved
        ? '❌ Tidak ada entri berstatus drafted di manifest.'
        : `❌ Slug "${slugArg}" tidak ada di manifest.`
    );
    process.exit(1);
  }

  let marked = 0;
  for (const [filename, entry] of candidates) {
    const slug = entry.guideSlug;
    if (!slug) continue;

    if (!(await guideIsLive(slug))) {
      console.log(`⏭️  Lewati ${slug}: file belum ada atau masih draft: true`);
      continue;
    }

    markPublished(manifest, filename, { guideSlug: slug, publishedAt: now, prUrl });
    console.log(`✅ ${slug} → published${prUrl ? ` (${prUrl})` : ''}`);
    marked++;
  }

  if (marked === 0) {
    console.error('❌ Tidak ada guide yang bisa ditandai published.');
    process.exit(1);
  }

  await saveManifest(MANIFEST_PATH, manifest);
  console.log(`\n📝 Manifest diperbarui: ${marked} entri → published`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
