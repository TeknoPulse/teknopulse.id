/**
 * Paksa string jadi metaDescription 120–155 karakter (aturan on-page SEO
 * TeknoPulse). Dipakai draft-guide.ts saat membangun frontmatter guide.
 *
 * - <120: diberi kalimat padding sampai mencapai 120.
 * - >155: dipotong di spasi terakhir ≤154, rapi, lalu ditutup '.'.
 */

const PAD_SENTENCE = ' Lengkap dengan langkah praktis, FAQ, dan checklist.';
const PAD_FALLBACK = ' Cocok untuk pemula hingga menengah.';

export function fitMetaDescription(text: string): string {
  let out = text.replace(/\s+/g, ' ').trim();

  if (out.length < 120) {
    out += PAD_SENTENCE;
    while (out.length < 120) out += PAD_FALLBACK;
  }

  if (out.length > 155) {
    const cut = out.lastIndexOf(' ', 154);
    const candidate = out.slice(0, cut).replace(/[\s.,;:!?—–-]+$/, '') + '.';
    // Potong di spasi terakhir kalau hasilnya masih ≥120; kalau tidak (kata
    // sangat panjang di awal), potong keras di 154 supaya tetap di rentang.
    const hardCut = out.slice(0, 154);
    const trimmed = hardCut.replace(/[\s.,;:!?—–-]+$/, '');
    out =
      cut > 0 && candidate.length >= 120
        ? candidate
        : (trimmed.length >= 119 ? trimmed : hardCut) + '.';
  }

  return out;
}
