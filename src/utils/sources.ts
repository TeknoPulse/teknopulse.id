// src/utils/sources.ts
//
// Bantuan untuk merender `source:` frontmatter artikel sebagai section
// "Sumber" (TEKAA-398). Frontmatter ini sudah divalidasi schema sejak lama
// tapi sebelumnya tidak pernah dirender, sehingga 56 artikel menyimpan bukti
// sumber primer di data tanpa pernah sampai ke pembaca maupun crawler.
//
// Aturan yang dijaga di sini:
//   - `primary: true` ditandai eksplisit dan didahulukan.
//   - Sumber duplikat (URL sama, beda penulisan host/slash/trailing) dibuang.
//   - Label tautan memakai hostname tanpa `www.` — lebih pendek dan terbaca
//     daripada nama panjang yang sudah dipakai sebagai teks daftar.

const normalizeHost = (hostname: string) => hostname.replace(/^www\./, '').toLowerCase();

export interface SourceItem {
  name: string;
  url: string;
  primary: boolean;
  /** Hostname tanpa `www.` untuk label tautan; jatuh ke URL utuh bila invalid. */
  label: string;
}

const toLabel = (url: string): string => {
  try {
    return normalizeHost(new URL(url).hostname);
  } catch {
    return url;
  }
};

// Kunci dedup: host + path tanpa trailing slash + query. Protokol dan `www.`
// diabaikan supaya `https://www.x.com/a/` dan `http://x.com/a` dianggap sama.
const dedupeKey = (url: string): string => {
  try {
    const parsed = new URL(url);
    return `${normalizeHost(parsed.hostname)}${parsed.pathname.replace(/\/+$/, '')}${parsed.search}`;
  } catch {
    return url.toLowerCase();
  }
};

/**
 * Urutkan sumber: `primary: true` lebih dulu (urutannya dipertahankan sesuai
 * frontmatter), lalu sisanya. Duplikat URL dibuang, kemunculan pertama menang.
 */
export function normalizeSources(
  source?: readonly { name: string; url: string; primary?: boolean }[] | null
): SourceItem[] {
  if (!source?.length) return [];

  const seen = new Set<string>();
  const items: SourceItem[] = [];

  for (const entry of source) {
    const key = dedupeKey(entry.url);
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({
      name: entry.name,
      url: entry.url,
      primary: entry.primary ?? false,
      label: toLabel(entry.url),
    });
  }

  // Array.prototype.sort stabil di Node modern, jadi urutan dalam grup terjaga.
  return items.sort((a, b) => Number(b.primary) - Number(a.primary));
}

// Section "Sumber" / "Sumber Rujukan" / "Sumber dan Rujukan Terkait" yang
// sudah ditulis manual di badan artikel (hanya heading level 2 yang dihitung —
// heading level 3 adalah sub-bagian di dalam artikel, bukan daftar sumber).
const MANUAL_SOURCES_HEADING = /^##\s+.*(sumber|rujukan|referens)/i;

/**
 * Deteksi apakah badan artikel sudah punya section sumber manual. Dipakai
 * template untuk menghindari dua daftar sumber di satu halaman.
 */
export function hasManualSourcesSection(body?: string | null): boolean {
  if (!body) return false;
  return body.split('\n').some((line) => MANUAL_SOURCES_HEADING.test(line.trim()));
}
