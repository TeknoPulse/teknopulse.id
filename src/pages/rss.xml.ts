// src/pages/rss.xml.js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../config'; // { name, description, url }

export async function GET() {
  const posts = await getCollection('posts');
  const publishedPosts = posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());

  return rss({
    title: site.name,
    description: site.description,
    site: site.url, // ✅ URL lengkap
    items: publishedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishedAt, // harus Date object
      description: post.data.summary,
      link: `/posts/${post.slug}/`,
      author: post.data.author,
      categories: [post.data.category, ...(post.data.tags ?? [])],
    })),
    customData: `
      <language>id-ID</language>
      <copyright>© ${new Date().getFullYear()} ${site.name}</copyright>
      <generator>Astro.js</generator>
    `.trim(),
  });
}