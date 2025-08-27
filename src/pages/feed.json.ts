import { getCollection } from 'astro:content';
import { site } from '../config';

export async function GET() {
  const posts = (await getCollection('posts'))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: site.name,
    description: site.description,
    home_page_url: site.url,
    feed_url: `${site.url}/feed.json`,
    language: site.defaultLocale,
    items: posts.map((post) => ({
      id: `${site.url}/posts/${post.slug}/`,
      url: `${site.url}/posts/${post.slug}/`,
      title: post.data.title,
      content_html: post.body,
      summary: post.data.summary,
      date_published: post.data.publishedAt.toISOString(),
      date_modified: post.data.updatedAt?.toISOString() || post.data.publishedAt.toISOString(),
      author: {
        name: post.data.author,
      },
      tags: [post.data.category, ...post.data.tags],
      image: post.data.coverImage,
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
