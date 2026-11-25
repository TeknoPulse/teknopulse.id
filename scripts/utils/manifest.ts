/**
 * Manifest types + IO untuk `.webinsight/manifest.json`.
 *
 * State tracking pipeline webinsight → artikel evergreen. Satu entri per file
 * .docx sumber, key = nama file. Lihat
 * `.scratch/webinsight-to-evergreen/issues/11-pipeline-arsitektur.md`.
 *
 * Status berjalan satu arah:
 *   curated → drafted → published   (failed = perlu perhatian manual)
 */

import * as fsp from 'fs/promises';
import * as path from 'path';

export type ManifestStatus = 'new' | 'curated' | 'drafted' | 'published' | 'failed';

export interface ManifestEntry {
  status: ManifestStatus;
  curatedAt?: string;
  draftedAt?: string;
  publishedAt?: string;
  guideSlug?: string;
  targetKeyword?: string;
  secondaryKeywords?: string[];
  outputPath?: string;
  wordCount?: number;
  authorityScore?: number;
  evergreen?: boolean;
  prUrl?: string;
}

export interface Manifest {
  version: number;
  lastSync?: string;
  files: Record<string, ManifestEntry>;
}

export function emptyManifest(): Manifest {
  return { version: 1, files: {} };
}

export async function loadManifest(manifestPath: string): Promise<Manifest> {
  try {
    const data = await fsp.readFile(manifestPath, 'utf-8');
    const parsed: unknown = JSON.parse(data);
    if (typeof parsed !== 'object' || parsed === null) return emptyManifest();
    const candidate = parsed as Partial<Manifest>;
    return {
      version: candidate.version ?? 1,
      lastSync: candidate.lastSync,
      files: candidate.files ?? {},
    };
  } catch {
    return emptyManifest();
  }
}

export async function saveManifest(manifestPath: string, manifest: Manifest): Promise<void> {
  await fsp.mkdir(path.dirname(manifestPath), { recursive: true });
  await fsp.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
}

/**
 * Tandai satu file sumber sebagai published. Dipanggil setelah PR digabung
 * (issue 11 langkah 7): status published + publishedAt + prUrl.
 *
 * Usage: node --import tsx scripts/utils/manifest.ts # → lihat scripts/publish-guide.ts
 */
export function markPublished(
  manifest: Manifest,
  filename: string,
  fields: { guideSlug: string; publishedAt: string; prUrl?: string }
): void {
  manifest.files[filename] = {
    ...manifest.files[filename],
    status: 'published',
    publishedAt: fields.publishedAt,
    prUrl: fields.prUrl,
    guideSlug: fields.guideSlug,
  };
}
