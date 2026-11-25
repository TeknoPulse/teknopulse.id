/**
 * Keyword Research Utility
 * Helper functions for manual keyword research (Google Autocomplete + GSC)
 * No paid API dependencies - designed for manual workflow with documentation
 */

export interface KeywordData {
  keyword: string;
  source: 'autocomplete' | 'related' | 'gsc' | 'manual';
  volumeEstimate?: 'low' | 'medium' | 'high';
  intent?: 'informational' | 'navigational' | 'transactional' | 'commercial';
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface KeywordResearchResult {
  targetKeyword: string;
  secondaryKeywords: KeywordData[];
  notes: string[];
}

/**
 * Generate Google Autocomplete URL for manual research
 * User opens this in browser and copies suggestions
 */
export function getAutocompleteUrl(query: string, locale: 'id' | 'en' = 'id'): string {
  const encoded = encodeURIComponent(query);
  return `https://www.google.${locale === 'id' ? 'co.id' : 'com'}/complete/search?q=${encoded}&client=chrome`;
}

/**
 * Generate Google Related Searches URL
 */
export function getRelatedSearchesUrl(query: string, locale: 'id' | 'en' = 'id'): string {
  const encoded = encodeURIComponent(query);
  return `https://www.google.${locale === 'id' ? 'co.id' : 'com'}/search?q=${encoded}&hl=${locale}`;
}

/**
 * Generate GSC query filter URL for existing site queries
 */
export function getGSCQueriesUrl(siteUrl: string, queryFilter: string): string {
  return `https://search.google.com/search-console/performance?resource_id=${encodeURIComponent(siteUrl)}&query=${encodeURIComponent(queryFilter)}`;
}

/**
 * Indonesian stopwords for filtering
 */
const INDONESIAN_STOPWORDS = new Set([
  'yang',
  'dan',
  'di',
  'ke',
  'dari',
  'untuk',
  'dengan',
  'pada',
  'adalah',
  'ini',
  'itu',
  'atau',
  'juga',
  'sudah',
  'belum',
  'bisa',
  'akan',
  'ada',
  'tidak',
  'apa',
  'siapa',
  'kapan',
  'dimana',
  'mengapa',
  'bagaimana',
  'berapa',
  'saya',
  'aku',
  'kamu',
  'dia',
  'kami',
  'kita',
  'mereka',
  'the',
  'a',
  'an',
  'in',
  'on',
  'at',
  'to',
  'for',
  'of',
  'with',
  'and',
  'or',
]);

/**
 * Extract meaningful keywords from text (for manual analysis)
 */
export function extractCandidateKeywords(text: string, maxKeywords: number = 20): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !INDONESIAN_STOPWORDS.has(w));

  // Get n-grams (2-3 words)
  const ngrams: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    ngrams.push(`${words[i]} ${words[i + 1]}`);
    if (i < words.length - 2) {
      ngrams.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
    }
  }

  // Count frequency
  const freq = new Map<string, number>();
  for (const ng of ngrams) {
    freq.set(ng, (freq.get(ng) || 0) + 1);
  }

  // Sort by frequency
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([kw]) => kw);
}

/**
 * Classify search intent from keyword
 */
export function classifyIntent(
  keyword: string
): 'informational' | 'navigational' | 'transactional' | 'commercial' {
  const lower = keyword.toLowerCase();

  if (/\b(cara|how to|tutorial|panduan|langkah|step)\b/.test(lower)) return 'informational';
  if (/\b(beli|buy|harga|price|diskon|promo|murah|gratis|free|download)\b/.test(lower))
    return 'transactional';
  if (/\b(terbaik|best|review|bandingkan|vs|versus|alternatif|alternative)\b/.test(lower))
    return 'commercial';
  if (/\b(situs|website|official|resmi|login|daftar|register)\b/.test(lower)) return 'navigational';

  return 'informational'; // default
}

/**
 * Estimate keyword difficulty (heuristic)
 */
export function estimateDifficulty(keyword: string): 'easy' | 'medium' | 'hard' {
  const wordCount = keyword.split(/\s+/).length;
  const hasBrand = /\b(google|microsoft|apple|meta|openai|anthropic|github|aws|azure)\b/i.test(
    keyword
  );

  if (hasBrand) return 'hard';
  if (wordCount >= 4) return 'easy'; // long-tail
  if (wordCount === 3) return 'medium';
  return 'hard'; // short head terms
}

/**
 * Generate keyword research checklist for manual process
 */
export function generateResearchChecklist(topic: string): string {
  return `
# Keyword Research Checklist: ${topic}

## 1. Google Autocomplete (google.co.id)
- [ ] Buka: ${getAutocompleteUrl(topic)}
- [ ] Catat 5-10 saran autocomplete
- [ ] Coba variasi: "${topic} cara", "${topic} tutorial", "${topic} panduan", "${topic} tips"

## 2. Related Searches (bottom of SERP)
- [ ] Search: ${getRelatedSearchesUrl(topic)}
- [ ] Scroll ke bawah → catat "Pencarian terkait"
- [ ] Klik 1-2 related → lihat related mereka

## 3. GSC Existing Queries (Search Console)
- [ ] Buka: ${getGSCQueriesUrl('https://teknopulse.id', topic.split(' ')[0])}
- [ ] Filter 3-6 bulan terakhir
- [ ] Cari query mengandung kata kunci topic
- [ ] Catat: impressions, CTR, position rata-rata

## 4. Competitor Check (manual)
- [ ] Search targetKeyword di google.co.id (incognito)
- [ ] Catat top 3 hasil: domain, tipe konten, panjang
- [ ] Apakah ada guide/how-to Indonesia yang rank baik?

## 5. Selection
- [ ] **targetKeyword**: 1 primary (volume + intent match + difficulty realistic)
- [ ] **secondaryKeywords**: 3-5 varian long-tail (autocomplete + related + GSC)
- [ ] Document alasan pemilihan di notes

## Output Format (copy ke curation JSON):
{
  "targetKeyword": "...",
  "secondaryKeywords": [
    {"keyword": "...", "source": "autocomplete", "intent": "informational"},
    {"keyword": "...", "source": "related", "intent": "informational"},
    {"keyword": "...", "source": "gsc", "intent": "informational"}
  ],
  "notes": ["..."]
}
`.trim();
}

/**
 * Validate keyword selection
 */
export function validateKeywords(
  target: string,
  secondary: string[]
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!target || target.length < 3) {
    issues.push('targetKeyword terlalu pendek/ kosong');
  }

  if (secondary.length < 2) {
    issues.push('secondaryKeywords minimal 2 (recommended 3-5)');
  }

  const allKeywords = [target, ...secondary];
  const duplicates = allKeywords.filter((kw, i) => allKeywords.indexOf(kw) !== i);
  if (duplicates.length > 0) {
    issues.push(`Duplikat: ${duplicates.join(', ')}`);
  }

  for (const kw of allKeywords) {
    if (kw.length > 80) {
      issues.push(`Keyword terlalu panjang: "${kw}"`);
    }
  }

  return { valid: issues.length === 0, issues };
}
