import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
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
      source: z
        .array(
          z.object({
            name: z.string(),
            url: z.string().url(),
            primary: z.boolean().default(false),
          })
        )
        .optional(),
      featured: z.boolean().default(false).optional(),
      aiSummary: z.string().optional(),
      format: z.enum(['berita', 'rangkuman', 'konteks', 'panduan-pembaca']).optional(),
    }),
});

export const collections = { posts };
