import { getCollection, type CollectionEntry } from 'astro:content';
import { calculateReadingTime } from './readingTime';

export type Issue = CollectionEntry<'issues'>;
export type IssueArticle = CollectionEntry<'issueArticles'>;

export interface Topic {
  slug: string;
  label: string;
  short: string;
  description: string;
}

// Rubrik edisi demo. Slug dipakai di frontmatter + URL /topik/<slug>/.
export const topics: Topic[] = [
  {
    slug: 'ai',
    label: 'Kecerdasan Buatan',
    short: 'AI',
    description:
      'Model, alat, dan kebiasaan baru yang muncul ketika mesin ikut menulis, memilih, dan memutuskan.',
  },
  {
    slug: 'perangkat',
    label: 'Perangkat',
    short: 'Perangkat',
    description:
      'Benda yang kita pakai setiap hari — dan biaya, usia pakai, serta siapa yang berhak memperbaikinya.',
  },
  {
    slug: 'budaya',
    label: 'Budaya Digital',
    short: 'Budaya',
    description:
      'Cara kerja, perhatian, dan kehidupan sehari-hari berubah bersama perangkat yang kita bawa.',
  },
  {
    slug: 'open-source',
    label: 'Open Source',
    short: 'Open Source',
    description:
      'Kode yang dibangun bersama, dirawat oleh sedikit orang, dan menopang hampir semua hal lain.',
  },
  {
    slug: 'bisnis',
    label: 'Bisnis Teknologi',
    short: 'Bisnis',
    description:
      'Keputusan infrastruktur, biaya, dan model usaha yang menentukan teknologi mana yang bertahan.',
  },
];

export const getTopic = (slug: string): Topic =>
  topics.find((topic) => topic.slug === slug) ?? {
    slug,
    label: slug,
    short: slug,
    description: '',
  };

export const padIssue = (number: number): string => String(number).padStart(2, '0');

export const issueUrl = (number: number): string => `/edisi/${padIssue(number)}/`;

/** Astro memakai id koleksi termasuk ekstensi berkas (mis. `slug.md`). */
const withoutExtension = (id: string): string => id.replace(/\.md$/, '');

export const articleUrl = (article: IssueArticle): string =>
  `${issueUrl(article.data.issue)}${withoutExtension(article.id)}/`;

export const topicUrl = (slug: string): string => `/topik/${slug}/`;

export const formatDate = (date: Date): string =>
  date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  });

export const formatShortDate = (date: Date): string =>
  date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  });

export const readingTime = (body: string): number => Math.max(1, calculateReadingTime(body));

/** Semua edisi, terbaru lebih dulu. */
export async function getIssues(): Promise<Issue[]> {
  const issues = await getCollection('issues');
  return issues.sort((a, b) => b.data.number - a.data.number);
}

/** Semua artikel demo, terbaru lebih dulu. */
export async function getIssueArticles(): Promise<IssueArticle[]> {
  const articles = await getCollection('issueArticles');
  return articles.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export function articlesForIssue(articles: IssueArticle[], number: number): IssueArticle[] {
  return articles.filter((article) => article.data.issue === number);
}

/** Artikel dalam urutan tampil: laporan utama, pilihan editor, lalu ringkas. */
export function arrangeIssue(issue: Issue, articles: IssueArticle[]) {
  const inIssue = articlesForIssue(articles, issue.data.number);
  const byId = new Map(inIssue.map((article) => [withoutExtension(article.id), article]));
  return {
    cover: byId.get(issue.data.coverStory),
    picks: issue.data.editorPicks.map((id) => byId.get(id)).filter(Boolean) as IssueArticle[],
    briefs: issue.data.briefs.map((id) => byId.get(id)).filter(Boolean) as IssueArticle[],
    all: inIssue,
  };
}

export interface ClientArticle {
  id: string;
  title: string;
  dek: string;
  kicker: string;
  topic: string;
  topicLabel: string;
  author: string;
  issue: number;
  issueLabel: string;
  date: string;
  dateISO: string;
  readingTime: number;
  url: string;
  searchText: string;
}

const stripMarkdown = (body: string): string =>
  body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~]/g, ' ')
    .replace(/^\s*[-|]\s*/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Indeks kecil yang ditanam di halaman pencarian & baca-nanti. Halaman ini
 * statis, jadi metadata artikel perlu ikut ke browser — localStorage hanya
 * menyimpan id artikel.
 */
export function buildClientIndex(articles: IssueArticle[]): ClientArticle[] {
  return articles.map((article) => {
    const topic = getTopic(article.data.topic);
    return {
      id: article.id,
      title: article.data.title,
      dek: article.data.dek,
      kicker: article.data.kicker,
      topic: article.data.topic,
      topicLabel: topic.label,
      author: article.data.author,
      issue: article.data.issue,
      issueLabel: `Edisi ${padIssue(article.data.issue)}`,
      date: formatDate(article.data.publishedAt),
      dateISO: article.data.publishedAt.toISOString(),
      readingTime: readingTime(article.body),
      url: articleUrl(article),
      searchText: stripMarkdown(article.body).toLowerCase(),
    };
  });
}

/** JSON yang aman ditanam di dalam <script type="application/json">. */
export function serializeForScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
