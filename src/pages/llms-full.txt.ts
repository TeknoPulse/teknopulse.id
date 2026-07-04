import { getCollection } from 'astro:content';
import { site } from '../config';

// Expanded LLM summary (https://llmstxt.org) — companion to the curated /llms.txt.
// Mirrors the pattern in feed.json.ts: read the posts collection, drop drafts,
// sort newest-first, render as plain text. Self-maintaining — regenerates on
// every post add, no manual sync.
export async function GET() {
  const posts = (await getCollection('posts'))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());

  const lines: string[] = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `> Daftar lengkap artikel ( expanded list for LLMs). ${posts.length} artikel. Bahasa: ${site.defaultLocale}.`,
    '',
  ];

  for (const post of posts) {
    const url = `${site.url}/posts/${post.slug}/`;
    const date = post.data.publishedAt.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    lines.push(`## ${post.data.title}`, '', post.data.summary, '');
    lines.push(`URL: ${url}`);
    lines.push(`Tanggal: ${date}`);
    lines.push(`Kategori: ${post.data.category}`);
    if (post.data.tags?.length) lines.push(`Tag: ${post.data.tags.join(', ')}`);
    lines.push(`Penulis: ${post.data.author}`, '');
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
