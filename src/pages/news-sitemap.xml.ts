import { getCollection } from 'astro:content';
import { site } from '../config';

export async function GET() {
  const posts = (await getCollection('posts'))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const newsPosts = posts.filter((post) => post.data.publishedAt >= twoDaysAgo);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${newsPosts
    .map(
      (post) => `
    <url>
      <loc>${site.url}/posts/${post.slug}/</loc>
      <news:news>
        <news:publication>
          <news:name>${site.name}</news:name>
          <news:language>id</news:language>
        </news:publication>
        <news:publication_date>${post.data.publishedAt.toISOString()}</news:publication_date>
        <news:title>${post.data.title}</news:title>
      </news:news>
    </url>
  `
    )
    .join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
