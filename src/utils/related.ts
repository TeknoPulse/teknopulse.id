import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export function sortPosts(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

function dedupeRelated(candidates: Post[], post: Post, limit: number): Post[] {
  const seen = new Set<string>([post.slug]);
  const result: Post[] = [];
  for (const item of candidates) {
    if (seen.has(item.slug)) continue;
    seen.add(item.slug);
    result.push(item);
    if (result.length === limit) break;
  }
  return result;
}

/** Artikel dengan tag yang sama, fallback ke artikel terbaru lain. */
export function getRelatedPosts(post: Post, sortedPosts: Post[], limit = 3): Post[] {
  const others = sortedPosts.filter((item) => item.slug !== post.slug);
  const tags = post.data.tags ?? [];
  const sharedTag = others.filter((item) =>
    (item.data.tags ?? []).some((tag) => tags.includes(tag))
  );
  // Tag yang sama diprioritaskan, lalu dilengkapi artikel terbaru lain agar
  // grid tiga kolom tetap terisi.
  return dedupeRelated([...sharedTag, ...others], post, limit);
}

/** Artikel lain dari rubrik yang sama, urut terbaru. */
export function getCategoryPosts(post: Post, sortedPosts: Post[], limit = 3): Post[] {
  return dedupeRelated(
    sortedPosts.filter((item) => item.data.category === post.data.category),
    post,
    limit
  );
}
