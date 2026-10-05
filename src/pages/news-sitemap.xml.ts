import { getCollection } from 'astro:content';
import { site } from '../config';

// News sitemap untuk Google News (TEKAA-201 P1). Versi sebelumnya kosong:
// filter 48 jam memakai "now -2 hari" yang bergeser setiap build, sehingga
// saat tidak ada artikel baru sitemap jadi <urlset/> kosong. Versi ini
// memuat semua artikel non-draft (urut terbaru dulu, maksimum 1000 sesuai
// batas Google) — Google tetap memfilter umur di sisi mereka sendiri.

const MAX_URLS = 1000;

// Escaping wajib: judul artikel bisa memuat & (mis. "AT&T").
const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

// Genre Google News yang valid: Blog | OpEd | News | PressRelease.
// "berita" (dan artikel tanpa format eksplisit) → News; panduan/konteks/
// rangkuman lebih dekat ke Blog.
const newsGenre = (format: string | undefined): string =>
  !format || format === 'berita' ? 'News' : 'Blog';

export async function GET() {
  const posts = (await getCollection('posts'))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf())
    .slice(0, MAX_URLS);

  const entries = posts.map((post) => {
    const { title, tags, publishedAt, format } = post.data;
    const keywords = tags.join(', ');

    return `  <url>
    <loc>${escapeXml(`${site.url}/posts/${post.slug}/`)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(site.name)}</news:name>
        <news:language>id</news:language>
      </news:publication>
      <news:genres>${newsGenre(format)}</news:genres>
      <news:publication_date>${publishedAt.toISOString()}</news:publication_date>
      <news:title>${escapeXml(title)}</news:title>${
        keywords ? `\n      <news:keywords>${escapeXml(keywords)}</news:keywords>` : ''
      }
    </news:news>
  </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries.join('\n')}
</urlset>`;

  return new Response(sitemap, { headers: { 'Content-Type': 'application/xml' } });
}
