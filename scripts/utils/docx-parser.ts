/**
 * DOCX Parser Utility
 * Extract text content and frontmatter-like data from .docx files
 * Uses mammoth.js for .docx parsing
 */

import * as mammoth from 'mammoth';
import * as fs from 'fs/promises';

export interface DocxParseResult {
  title: string;
  content: string; // HTML content
  rawText: string; // Plain text
  metadata: {
    author?: string;
    sourceUrl?: string;
    date?: string;
    category?: string;
  };
  wordCount: number;
}

const AUTHOR_PATTERNS = [
  /^(?:oleh|by|author|penulis)\s*:?\s*(.+)$/im,
  /^(?:sumber|source)\s*:?\s*(.+)$/im,
];

const URL_PATTERN = /https?:\/\/[^\s]+/g;

const DATE_PATTERNS = [
  /(\d{4}-\d{2}-\d{2})/,
  /(\d{2}\/\d{2}\/\d{4})/,
  /(\d{2}\s+(?:Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\s+\d{4})/i,
];

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  AI: [
    'ai',
    'artificial intelligence',
    'machine learning',
    'llm',
    'model',
    'claude',
    'gpt',
    'gemini',
    'agent',
    'prompting',
  ],
  Developer: [
    'code',
    'coding',
    'developer',
    'programming',
    'typescript',
    'javascript',
    'python',
    'api',
    'library',
    'framework',
    'ide',
    'vscode',
    'github',
    'git',
  ],
  Software: ['software', 'aplikasi', 'platform', 'os', 'database', 'framework', 'release', 'versi'],
  Automation: [
    'automation',
    'otomatisasi',
    'workflow',
    'agent',
    'no-code',
    'low-code',
    'n8n',
    'zapier',
    'make',
    'connector',
  ],
  Experiments: ['eksperimen', 'experiment', 'coba', 'try', 'test', 'benchmark', 'perbandingan'],
  Insights: [
    'analisis',
    'insight',
    'tren',
    'trend',
    'pasar',
    'market',
    'bisnis',
    'business',
    'strategi',
    'growth',
    'pertumbuhan',
  ],
};

export async function parseDocx(filePath: string): Promise<DocxParseResult> {
  const buffer = await fs.readFile(filePath);
  const result = await mammoth.convertToHtml({ buffer });

  const html = result.value;
  // Batas paragraf/heading/list/<br> jadi newline dulu supaya struktur baris
  // dokumen terjaga — judul & metadata hidup di baris-baris awal.
  const lines = html
    .replace(/<\/(p|h[1-6]|li)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter((l) => l.length > 0);
  const rawText = lines.join(' ');
  const wordCount = rawText.split(/\s+/).filter((w) => w.length > 0).length;

  // Extract metadata from first few paragraphs
  const headerText = lines.slice(0, 10).join('\n');

  let title = '';
  let author = '';
  let sourceUrl = '';
  let date = '';
  let category = 'AI';

  // Try to extract title from the leading frontmatter block only — a
  // `title:` key later in the body is not metadata.
  const fmTitle = extractFrontmatterTitle(lines);
  if (fmTitle) {
    title = fmTitle;
  } else {
    for (const line of lines) {
      if (line.length > 10 && line.length < 200) {
        title = line;
        break;
      }
    }
  }

  // Extract author
  for (const pattern of AUTHOR_PATTERNS) {
    const match = headerText.match(pattern);
    if (match) {
      author = match[1].trim();
      break;
    }
  }

  // Extract URL
  const urlMatch = headerText.match(URL_PATTERN);
  if (urlMatch) {
    sourceUrl = urlMatch[0];
  }

  // Extract date
  for (const pattern of DATE_PATTERNS) {
    const match = headerText.match(pattern);
    if (match) {
      date = match[1];
      break;
    }
  }

  // Detect category from content
  const lowerContent = rawText.toLowerCase();
  let maxScore = 0;
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.reduce((sum, kw) => sum + (lowerContent.split(kw).length - 1), 0);
    if (score > maxScore) {
      maxScore = score;
      category = cat;
    }
  }

  return {
    title,
    content: html,
    rawText,
    metadata: { author, sourceUrl, date, category },
    wordCount,
  };
}

export function detectEvergreenTopic(rawText: string): { isEvergreen: boolean; reasons: string[] } {
  const lower = rawText.toLowerCase();
  const reasons: string[] = [];

  // News/launch indicators (NOT evergreen)
  const newsKeywords = [
    'launch',
    'luncurkan',
    'rilis',
    'release',
    'announce',
    'pengumuman',
    'funding',
    'pendanaan',
    'investment',
    'investasi',
    'series a',
    'series b',
    'series c',
    'acquisition',
    'akuisisi',
    'belanja',
    'beli',
    'ipo',
    'go public',
    'listing',
    'partnership',
    'kemitraan',
    'kolaborasi',
    'hiring',
    'rekrutmen',
    'lowongan',
    'event',
    'acara',
    'konferensi',
    'konperensi',
    'breaking',
    'baru saja',
    'just in',
  ];

  const evergreenKeywords = [
    'cara',
    'how to',
    'panduan',
    'guide',
    'tutorial',
    'tips',
    'trik',
    'tip',
    'trick',
    'strategi',
    'strategy',
    'best practice',
    'dasar',
    'fundamental',
    'pemula',
    'beginner',
    'optimasi',
    'optimization',
    'performa',
    'performance',
    'perbandingan',
    'comparison',
    'vs',
    'versus',
    'kesalahan',
    'mistake',
    'error',
    'hindari',
    'apa itu',
    'what is',
    'penjelasan',
    'explainer',
  ];

  const newsCount = newsKeywords.reduce((sum, kw) => sum + (lower.split(kw).length - 1), 0);
  const evergreenCount = evergreenKeywords.reduce(
    (sum, kw) => sum + (lower.split(kw).length - 1),
    0
  );

  if (newsCount > 0) {
    reasons.push(`Mengandung ${newsCount} indikator berita/launch`);
  }
  if (evergreenCount > 0) {
    reasons.push(`Mengandung ${evergreenCount} indikator evergreen`);
  }

  return {
    isEvergreen: evergreenCount > newsCount && evergreenCount >= 2,
    reasons,
  };
}

export function scoreSourceAuthority(sourceUrl: string, author: string): number {
  const authorityDomains = {
    'bytebytego.com': 10,
    'latent.space': 10,
    'pragmaticengineer.com': 10,
    'mattpocock.uk': 9,
    'rubenhassid.com': 8,
    'robin-ebers.com': 8,
    'ideabrowser.com': 7,
    'natesnewsletter.com': 7,
    'kilocode.dev': 8,
    'system-design.one': 9,
    'theslowai.com': 7,
    'god-of-prompt.com': 6,
    'startup-riders.com': 6,
    'kilo-code.com': 8,
    'alex-mcfarland.com': 7,
    'gloria-writers.com': 6,
    'ainews.com': 7,
  };

  let score = 5; // default
  // Cocokkan HOST, bukan substring URL — 'evil.com/?u=latent.space' tidak
  // boleh kebaca sebagai latent.space. URL tidak valid → skor default.
  let host = '';
  try {
    host = new URL(sourceUrl).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    host = '';
  }
  if (host) {
    for (const [domain, s] of Object.entries(authorityDomains)) {
      if (host === domain || host.endsWith('.' + domain)) {
        score = s;
        break;
      }
    }
  }

  // Boost for known authors
  const knownAuthors = [
    'matt pocock',
    'bytebytego',
    'latent space',
    'pragmatic engineer',
    'ruben hassid',
    'robin ebers',
    'nate',
    'kilo code',
  ];
  const lowerAuthor = author.toLowerCase();
  for (const known of knownAuthors) {
    if (lowerAuthor.includes(known)) {
      score = Math.min(10, score + 1);
    }
  }

  return score;
}

/**
 * Baca `title:` dari blok frontmatter di AWAL dokumen saja.
 *
 * Dua bentuk sumber yang didukung:
 *   - frontmatter inline satu paragraf: `title: "A: B" description: "x"`
 *   - blok `---` YAML: baris `---` lalu deretan `key: value`.
 *
 * Berhenti di baris pertama yang bukan `key:` atau di `---` berikutnya.
 * `title:` di badan dokumen tidak pernah dibaca (mengembalikan undefined).
 */
export function extractFrontmatterTitle(lines: string[]): string | undefined {
  let i = lines[0] === '---' ? 1 : 0;
  let raw: string | undefined;
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (line === '---' || !/^[A-Za-z_][\w-]*:/.test(line)) break;
    const m = /^title:\s*(.+)$/i.exec(line);
    if (m) {
      raw = m[1].trim();
      break;
    }
  }
  if (!raw) return undefined;

  // Sebagian docx menyimpan seluruh frontmatter dalam satu paragraf:
  // potong di key frontmatter berikutnya, lalu buang kutip/escape pembungkus.
  const title = raw
    .split(
      /\s+(?:slug|summary|description|metaDescription|publishedAt|pubDate|date|category|tags|author|draft|source|sourceUrl|coverImage):\s/
    )[0]
    .replace(/\\"/g, '"')
    .replace(/^["'\s]+|["'\s]+$/g, '');
  return title || undefined;
}
