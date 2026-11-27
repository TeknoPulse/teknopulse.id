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

const VALID_STATUSES: readonly ManifestStatus[] = [
  'new',
  'curated',
  'drafted',
  'published',
  'failed',
];

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

export async function loadManifest(manifestPath: string): Promise<Manifest> {
  let data: string;
  try {
    data = await fsp.readFile(manifestPath, 'utf-8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return emptyManifest();
    throw err;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(data);
  } catch (err) {
    throw new Error(`Manifest ${manifestPath} bukan JSON valid: ${(err as Error).message}`);
  }

  if (!isPlainObject(parsed)) {
    throw new Error(`Manifest ${manifestPath} tidak valid: root harus objek`);
  }
  const candidate = parsed as Partial<Manifest>;

  const files = candidate.files ?? {};
  if (!isPlainObject(files)) {
    throw new Error(`Manifest ${manifestPath} tidak valid: "files" harus objek`);
  }
  for (const [filename, entry] of Object.entries(files)) {
    if (!isPlainObject(entry)) {
      throw new Error(`Manifest ${manifestPath} tidak valid: entry "${filename}" harus objek`);
    }
    const status = (entry as ManifestEntry).status;
    if (!VALID_STATUSES.includes(status)) {
      throw new Error(
        `Manifest ${manifestPath} tidak valid: entry "${filename}" punya status "${status}"`
      );
    }
  }

  return {
    version: candidate.version ?? 1,
    lastSync: candidate.lastSync,
    files: files as Record<string, ManifestEntry>,
  };
}

export async function saveManifest(manifestPath: string, manifest: Manifest): Promise<void> {
  await fsp.mkdir(path.dirname(manifestPath), { recursive: true });
  const tmpPath = `${manifestPath}.${process.pid}.${Date.now()}.tmp`;
  try {
    await fsp.writeFile(tmpPath, JSON.stringify(manifest, null, 2), 'utf-8');
    await fsp.rename(tmpPath, manifestPath);
  } catch (err) {
    await fsp.unlink(tmpPath).catch(() => {});
    throw err;
  }
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
