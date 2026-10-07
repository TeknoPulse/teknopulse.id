import type { CollectionEntry } from 'astro:content';

export function coverAlt(post: CollectionEntry<'posts'>): string {
  return post.data.coverImageAlt ?? post.data.title;
}
