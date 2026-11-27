import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export function sortPosts(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

/** Artikel dengan tag yang sama, fallback ke artikel terbaru lain. */
export function getRelatedPosts(post: Post, sortedPosts: Post[], limit = 3): Post[] {
  const tags = post.data.tags ?? [];
  const result: Post[] = [];
  const seen = new Set<string>([post.slug]);

  // 1. Prioritaskan artikel dengan tag yang sama (tanpa filter/mapping array baru)
  if (tags.length > 0) {
    for (const item of sortedPosts) {
      if (item.slug === post.slug) continue;
      if (result.length >= limit) break;

      const itemTags = item.data.tags ?? [];
      // Array.some() is fast since tag lists are very small
      if (!seen.has(item.slug) && itemTags.some((tag) => tags.includes(tag))) {
        result.push(item);
        seen.add(item.slug);
      }
    }
  }

  // 2. Lengkapi dengan artikel terbaru lain jika belum mencapai limit
  for (const item of sortedPosts) {
    if (item.slug === post.slug) continue;
    if (result.length >= limit) break;

    if (!seen.has(item.slug)) {
      result.push(item);
      seen.add(item.slug);
    }
  }

  return result;
}

/** Artikel lain dari rubrik yang sama, urut terbaru. */
export function getCategoryPosts(post: Post, sortedPosts: Post[], limit = 3): Post[] {
  const result: Post[] = [];
  for (const item of sortedPosts) {
    if (item.slug === post.slug) continue;
    if (item.data.category === post.data.category) {
      result.push(item);
      if (result.length >= limit) break;
    }
  }
  return result;
}
