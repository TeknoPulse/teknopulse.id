import { defineCollection, z } from 'astro:content';
import { image } from 'astro:assets';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(), // Astro auto-generates slug from filename
    summary: z.string(),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    tags: z.array(z.string()),
    category: z.enum(['AI', 'Cloud', 'Security', 'DevTools', 'Policy']),
    author: z.string(),
    draft: z.boolean().default(false),
    coverImage: image().optional(),
    readingTime: z.number().optional(), // This will be auto-generated
  }),
});

export const collections = { posts };