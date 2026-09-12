import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Slug URL artikel. Untuk artikel BARU: 3–6 kata, tanpa tanggal
      // (`/posts/<slug>/`). Tanggal sudah ada di metadata & tampilan.
      // Artikel lama yang filenya masih berprefiks tanggal tidak boleh
      // diubah tanpa redirect 301.
      slug: z.string().optional(), // Astro auto-generates slug from filename
      summary: z.string(),
      // Meta description yang dikelola (120–155 karakter, ditulis manual —
      // bukan potongan otomatis konten). Dipakai untuk
      // `<meta name="description">`, og:description, dan JSON-LD.
      // Kosongkan untuk fallback ke `summary`.
      metaDescription: z.string().optional(),
      publishedAt: z.date(),
      // Diisi saat artikel diperbarui → jadi `dateModified` di JSON-LD
      // dan "Diperbarui: …" di halaman artikel.
      updatedAt: z.date().optional(),
      tags: z.array(z.string()),
      category: z.enum(['AI', 'OpenSource', 'DevTools']),
      // Byline harus sama dengan `name` (atau salah satu `aliases`) di
      // `src/utils/authors.ts` agar punya halaman profil & `author.url`
      // di JSON-LD.
      author: z.string(),
      draft: z.boolean().default(false),
      coverImage: image().optional(),
      // Override og:image per artikel. Harus unik per artikel (16:9,
      // ≥1200px, memuat judul/brand). Kalau kosong, og:image = coverImage —
      // asalkan tidak dipakai artikel lain; kalau coverImage juga dipakai
      // bareng, otomatis memakai kartu OG hasil generate `/og/<slug>.png`.
      ogImage: image().optional(),
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
      // Blok FAQ (2–4 pertanyaan) untuk konten definisi & how-to.
      // Dirender sebagai bagian "Pertanyaan yang Sering Diajukan" dan
      // menghasilkan JSON-LD `FAQPage`.
      faq: z
        .array(
          z.object({
            question: z.string().min(1),
            answer: z.string().min(1),
          })
        )
        .max(4)
        .optional(),
    }),
});

export const collections = { posts };
