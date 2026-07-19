// src/writer.js
//
// Agent "Penulis" — implementasi TEK-16.
//
// Tanggung jawab: menerima topic brief (judul/angle/keyword dari Editor & QA)
// lalu menghasilkan draf artikel Bahasa Indonesia yang ramah pembaca non-teknis,
// akurat, orisinal, 700-1200 kata, gaya TeknoPulse. Setelah draf, agent melakukan
// self-edit ringan (proofread, tone, EYD) sebelum diserahkan ke Editor & QA.
//
// Boundaries (lihat TEK-11 / plan Penulis):
//   - TIDAK memilih topik sendiri (topik datang dari Editor & QA).
//   - TIDAK mem-publish (publish hanya lewat commit ke repo oleh Editor/Founder).
//   - TIDAK mem-fabrikasi fakta atau sumber. Semua klaim butuh sumber nyata.
//
// Kontrak output (JSON terstruktur) — lihat `writerContract` di bawah.

/**
 * @typedef {Object} TopicBrief
 * @property {string} title           Judul usulan / angle dari Editor & QA.
 * @property {string} [angle]         Sudut pandang atau framing yang diminta.
 * @property {string[]} keywords      Keyword utama (SEO) yang harus masuk.
 * @property {string} [category]      Salah satu: AI | Cloud | Security | DevTools | Policy.
 * @property {string[]} [sources]     Daftar sumber rujukan wajib (url + nama).
 * @property {string} [format]        berita | rangkuman | konteks | panduan-pembaca.
 */

/**
 * @typedef {Object} ArticleDraft
 * @property {string} title            Judul final (bisa disesuaikan dari brief).
 * @property {string} metaDescription  Ringkasan SEO 150-160 karakter, mengandung keyword utama.
 * @property {string[]} keywords       Maksimal 6 keyword (subset/perluasan dari brief).
 * @property {string} body             Isi artikel dalam Markdown (700-1200 kata).
 * @property {string} [category]       Kategori (enum content schema).
 * @property {string} [format]         Format (enum content schema).
 * @property {Array<{name:string,url:string,primary?:boolean}>} [sources]
 */

const WORD_MIN = 700;
const WORD_MAX = 1200;
const KEYWORDS_MAX = 6;
const META_MIN = 150;
const META_MAX = 160;

/**
 * System prompt final Penulis (TEK-16). Disediakan ke LLM saat generateDraft.
 * @type {string}
 */
export const WRITER_SYSTEM_PROMPT = `Kamu adalah Penulis konten untuk TeknoPulse, situs berita & tips teknologi berbahasa Indonesia.

MISI: Bantu pembaca yang TIDAK punya latar belakang teknis memahami perkembangan tech terbaru lewat konten yang mudah dicerna dan aplikatif.

GAYA & TONA:
- Bahasa Indonesia yang ramah, jelas, dan tidak menggurui. Hindari jargon teknis berlebih; bila terpaksa pakai istilah, jelaskan sekali dalam bahasa sehari-hari.
- Hangat tapi profesional. Pakai contoh konkret dan analogi untuk pembaca awam.
- Tulis untuk manusia, bukan mesin — jangan "keyword stuffing".

KETENTUAN ARTIKEL:
- Panjang 700-1200 kata.
- Akurat dan orisinal. JANGAN mem-fabrikasi fakta, angka, atau sumber.
- Setiap klaim penting harus merujuk pada sumber nyata yang diberikan di brief.
- Sertakan meta description 150-160 karakter yang mengandung keyword utama.
- Pilih maksimal 6 keyword relevan.
- Struktur Markdown: pembukaan hook, subheading per bagian, poin-poin bila perlu, dan penutup dengan takeaway praktis untuk pembaca non-teknis.

OUTPUT: Balas HANYA dengan JSON terstruktur sesuai kontrak (title, metaDescription, keywords, body). Jangan tambahkan teks di luar JSON.`;

/**
 * Kontrak output JSON Penulis — dokumentasi & validasi ringan.
 * Field wajib: title, metaDescription (150-160 char + keyword utama),
 * keywords (max 6), body (Markdown).
 */
export const writerContract = {
  type: 'object',
  required: ['title', 'metaDescription', 'keywords', 'body'],
  properties: {
    title: { type: 'string' },
    metaDescription: { type: 'string', minLength: META_MIN, maxLength: META_MAX },
    keywords: { type: 'array', items: { type: 'string' }, maxItems: KEYWORDS_MAX },
    body: { type: 'string' },
  },
};

/**
 * Hitung jumlah kata (rough) untuk validasi panjang.
 * @param {string} text
 * @returns {number}
 */
function countWords(text) {
  const trimmed = (text || '').trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/**
 * Validasi draf terhadap kontrak & konstrain TeknoPulse.
 * Melempar Error bila kontrak tidak terpenuhi.
 * @param {ArticleDraft} draft
 */
export function validateDraft(draft) {
  const errors = [];
  if (!draft || typeof draft !== 'object') {
    throw new Error('Draft harus berupa object JSON.');
  }
  if (!draft.title || typeof draft.title !== 'string') {
    errors.push('Field "title" wajib berupa string non-kosong.');
  }
  if (!draft.metaDescription || typeof draft.metaDescription !== 'string') {
    errors.push('Field "metaDescription" wajib.');
  } else {
    const len = draft.metaDescription.length;
    if (len < META_MIN || len > META_MAX) {
      errors.push(`metaDescription harus ${META_MIN}-${META_MAX} karakter (sekarang ${len}).`);
    }
  }
  if (!Array.isArray(draft.keywords)) {
    errors.push('Field "keywords" wajib berupa array.');
  } else {
    if (draft.keywords.length > KEYWORDS_MAX) {
      errors.push(`keywords maksimal ${KEYWORDS_MAX} (sekarang ${draft.keywords.length}).`);
    }
    if (draft.keywords.length === 0) {
      errors.push('keywords tidak boleh kosong.');
    }
  }
  if (!draft.body || typeof draft.body !== 'string') {
    errors.push('Field "body" wajib berupa string Markdown.');
  } else {
    const words = countWords(draft.body);
    if (words < WORD_MIN || words > WORD_MAX) {
      errors.push(`body harus ${WORD_MIN}-${WORD_MAX} kata (sekarang ~${words}).`);
    }
  }
  if (errors.length) {
    throw new Error('Draft gagal validasi kontrak:\n- ' + errors.join('\n- '));
  }
  return true;
}

/**
 * generateDraft — hasilkan draf artikel dari topic brief.
 *
 * Fungsi ini adalah titik integrasi ke LLM (mis. OpenAI/Anthropic). Implementasi
 * transport dibiarkan injectable agar tetap testable dan tidak mengikat ke satu
 * provider. Agent Penulis TIDAK memilih topik — brief datang dari Editor & QA.
 *
 * @param {TopicBrief} brief
 * @param {(opts: { system: string, user: string }) => Promise<string>} llmCall
 *   Fungsi yang memanggil LLM dan mengembalikan teks respons (raw JSON).
 * @returns {Promise<ArticleDraft>}
 */
export async function generateDraft(brief, llmCall) {
  if (!brief || !brief.title) {
    throw new Error('TopicBrief harus menyertakan "title" (dari Editor & QA).');
  }
  if (!llmCall || typeof llmCall !== 'function') {
    throw new Error('llmCall wajib diinjeksikan (transport LLM).');
  }

  const keywordLine = (brief.keywords || []).join(', ');
  const sourceLine = (brief.sources || []).map((s) => `- ${s.name}: ${s.url}`).join('\n');

  const userPrompt = `Tulis artikel berdasarkan brief berikut.

JUDUL / ANGLE: ${brief.title}
${brief.angle ? `ANGLE: ${brief.angle}\n` : ''}${brief.format ? `FORMAT: ${brief.format}\n` : ''}${brief.category ? `KATEGORI: ${brief.category}\n` : ''}KEYWORD WAJIB: ${keywordLine || '(tidak ada, pilih sendiri yang relevan)'}
${sourceLine ? `SUMBER WAJIB RUJUKAN:\n${sourceLine}\n` : 'SUMBER: gunakan sumber nyata bila kamu tahu; jangan fabrikasi.'}

Berikan JSON dengan field: title, metaDescription (150-160 karakter, mengandung keyword utama), keywords (maksimal 6), body (Markdown 700-1200 kata, gaya ramah non-teknis).`;

  const raw = await llmCall({ system: WRITER_SYSTEM_PROMPT, user: userPrompt });
  const draft = parseDraftJson(raw);
  validateDraft(draft);
  return draft;
}

/**
 * editDraft — self-edit ringan: proofread, tone, dan konsistensi EYD.
 * TIDAK mengubah fakta atau menambah klaim tanpa sumber.
 *
 * @param {ArticleDraft} draft
 * @param {(opts: { system: string, user: string }) => Promise<string>} llmCall
 * @returns {Promise<ArticleDraft>}
 */
export async function editDraft(draft, llmCall) {
  if (!draft || typeof draft !== 'object') {
    throw new Error('editDraft butuh draft valid.');
  }
  if (!llmCall || typeof llmCall !== 'function') {
    throw new Error('llmCall wajib diinjeksikan (transport LLM).');
  }

  const userPrompt = `Edit & perbaiki draf artikel berikut dengan self-edit ringan:
- Proofread ejaan & EYD Bahasa Indonesia.
- Pastikan nada ramah dan mudah dipahami pembaca non-teknis.
- JANGAN ubah fakta atau tambah klaim tanpa sumber.
- Pertahankan panjang 700-1200 kata dan metaDescription 150-160 karakter.

DRAF:
${JSON.stringify(draft, null, 2)}

Kembalikan JSON dengan struktur SAMA persis (title, metaDescription, keywords, body).`;

  const raw = await llmCall({ system: WRITER_SYSTEM_PROMPT, user: userPrompt });
  const edited = parseDraftJson(raw);
  validateDraft(edited);
  return edited;
}

/**
 * Parse JSON dari respons LLM, toleran terhadap markdown code fence.
 * @param {string} raw
 * @returns {ArticleDraft}
 */
function parseDraftJson(raw) {
  if (!raw) throw new Error('Respons LLM kosong.');
  let text = raw.trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) text = fence[1].trim();
  try {
    return JSON.parse(text);
  } catch {
    // Coba ekstrak objek JSON pertama dari teks bebas.
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) {
      throw new Error('Respons LLM bukan JSON terstruktur yang valid.');
    }
    return JSON.parse(text.slice(start, end + 1));
  }
}

export const WRITER_CONSTRAINTS = {
  WORD_MIN,
  WORD_MAX,
  KEYWORDS_MAX,
  META_MIN,
  META_MAX,
};
