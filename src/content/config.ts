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
      // Harus sinkron dengan kunci di src/utils/categories.ts (SSOT)
      category: z.enum(['AI', 'Software', 'Developer', 'Automation', 'Experiments', 'Insights']),
      // Byline harus sama dengan `name` (atau salah satu `aliases`) di
      // `src/utils/authors.ts` agar punya halaman profil & `author.url`
      // di JSON-LD.
      author: z.string(),
      draft: z.boolean().default(false),
      coverImage: image().optional(),
      // Teks alt untuk coverImage (aksesibilitas + SEO). Fallback di
      // template: judul artikel kalau kosong.
      coverImageAlt: z.string().optional(),
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
      // Blok FAQ (2–6 pertanyaan) untuk konten definisi & how-to.
      // Dirender sebagai bagian "Pertanyaan yang Sering Diajukan" dan
      // menghasilkan JSON-LD `FAQPage`. Batas dinaikkan 4 → 6 di TEKAA-67
      // untuk FAQ hasil audit (halaman pembayaran ChatGPT membutuhkan 6).
      faq: z
        .array(
          z.object({
            question: z.string().min(1),
            answer: z.string().min(1),
          })
        )
        .max(6)
        .optional(),
    }),
});

const guides = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Slug URL guide. Untuk guide BARU: 3–6 kata, tanpa tanggal
      // (`/guides/<slug>/`). Tanggal sudah ada di metadata & tampilan.
      slug: z.string().optional(), // Astro auto-generates slug from filename
      description: z.string(), // TL;DR ringkasan guide (2-3 kalimat)
      // Meta description yang dikelola (120–155 karakter, ditulis manual)
      // Dipakai untuk `<meta name="description">`, og:description, JSON-LD.
      metaDescription: z.string().optional(),
      publishedAt: z.coerce.date(),
      // Wajib diisi saat guide diperbarui → jadi `dateModified` di JSON-LD
      // dan "Diperbarui: …" di halaman guide.
      updatedAt: z.coerce.date(),
      tags: z.array(z.string()),
      // Harus sinkron dengan kunci di src/utils/categories.ts (SSOT)
      category: z.enum(['AI', 'Software', 'Developer', 'Automation', 'Experiments', 'Insights']),
      // Byline harus sama dengan `name` (atau salah satu `aliases`) di
      // `src/utils/authors.ts` agar punya halaman profil & `author.url`
      // di JSON-LD.
      author: z.string(),
      draft: z.boolean().default(false),
      coverImage: image().optional(),
      coverImageAlt: z.string().optional(),
      ogImage: image().optional(),
      readingTime: z.number().optional(), // Auto-generated
      // Tingkat kesulitan guide — dipakai untuk badge UI & schema.org
      difficulty: z.enum(['pemula', 'menengah', 'lanjutan']),
      // Primary target keyword untuk SEO (1 keyword utama)
      targetKeyword: z.string(),
      // Secondary/long-tail keywords (3-5 varian)
      secondaryKeywords: z.array(z.string()),
      // Sumber referensi webinsight (minimal 1)
      sources: z.array(
        z.object({
          title: z.string(),
          url: z.string().url(),
          author: z.string().optional(),
          date: z.string().optional(), // YYYY-MM-DD
        })
      ),
      // FAQ untuk schema.org FAQPage (maks 8, guide biasanya lebih banyak)
      faq: z
        .array(
          z.object({
            question: z.string().min(1),
            answer: z.string().min(1),
          })
        )
        .max(8)
        .optional(),
    }),
});

export const collections = { posts, guides };
