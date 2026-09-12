# TeknoPulse

A production-ready Tech & AI news website built with Astro, TypeScript, and pnpm. Designed to deploy seamlessly on Vercel Free.

## Features

- 🚀 **Astro v5** with TypeScript for optimal performance
- 🎨 **Tailwind CSS** with dark/light theme toggle
- 📝 **Content Collections** for type-safe content management
- 🔍 **Pagefind** for client-side search
- 💬 **Giscus** comments integration
- 📊 **RSS & JSON Feed** generation
- 🗺️ **Sitemap** generation
- 🖼️ **Dynamic OG images** with Satori
- 📱 **Responsive design** with accessibility focus
- ⚡ **Performance optimized** for Lighthouse scores 95+

## Tech Stack

- **Framework**: Astro v5
- **Language**: TypeScript
- **Styling**: Tailwind CSS + @tailwindcss/typography
- **Package Manager**: pnpm
- **Search**: Pagefind
- **Comments**: Giscus (GitHub Discussions)
- **Analytics**: Plausible (optional)
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd teknopulse
```

2. Install dependencies:

```bash
pnpm install
```

3. Start development server:

```bash
pnpm dev
```

4. Open [http://localhost:4321](http://localhost:4321) in your browser.

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint and Prettier checks
- `pnpm lint:fix` - Fix linting issues
- `pnpm seo:check` - SEO pre-publish checklist (`seo:check:strict` untuk gate pra-terbit)
- `pnpm post:new "Title"` - Create a new blog post

### Creating Content

#### New Post

Use the built-in script to create a new post:

```bash
pnpm post:new "Your Amazing Post Title"
```

This creates a new Markdown file in `src/content/posts/` with proper frontmatter.

#### Post Frontmatter

```yaml
---
title: 'Your Post Title'
slug: 'your-post-slug' # URL: /posts/<slug>/ — TANPA tanggal utk artikel baru
summary: 'Brief description of your post'
metaDescription: 'Deskripsi SEO 120–155 karakter, ditulis manual (bukan potongan artikel)'
publishedAt: 2025-08-25T10:00:00Z
updatedAt: 2025-08-25T10:00:00Z # set ulang saat artikel diperbarui → dateModified JSON-LD
tags: ['AI', 'Technology']
category: AI # AI, OpenSource, DevTools
author: 'TeknoPulse Redaksi' # harus terdaftar di src/utils/authors.ts (byline + profil)
coverImage: '../../assets/images/<slug>-16x9.png' # unik per artikel, 16:9, ≥1200px
ogImage: '../../assets/images/<slug>-og-16x9.png' # opsional override og:image (unik per artikel)
draft: false
faq: # opsional, 2–4 pertanyaan (definisi/how-to) → JSON-LD FAQPage
  - question: 'Pertanyaan yang sering diajukan?'
    answer: 'Jawaban 2–3 kalimat.'
---
```

**Aturan SEO on-page (TEKAA-4/TEKAA-5):** tepat satu H1 per halaman — template sudah
membuang/menurunkan H1 duplikat di awal Markdown (`src/utils/rehype-unique-h1.js`);
artikel baru jangan diawali `# Judul`. og:image otomatis = `coverImage`, kecuali file itu
dipakai bareng artikel lain → otomatis diganti kartu OG generate `/og/<slug>.png` (unik).
Byline yang terdaftar di `src/utils/authors.ts` jadi tautan profil `/authors/<slug>/` +
`author.url` di JSON-LD. Struktur data: `Article` (+`dateModified`), `FAQPage`,
`BreadcrumbList` (di `Breadcrumbs.astro`), `Person` (halaman profil).

Jalankan `pnpm seo:check` sebelum publish; `pnpm seo:check:strict` untuk gate ketat.

### Configuration

#### Site Configuration

Edit `src/config.ts` to customize your site:

```typescript
export const site = {
  name: 'Your Site Name',
  description: 'Your site description',
  url: 'https://yoursite.vercel.app',
  defaultLocale: 'id-ID',
  socials: { x: '', threads: '', github: '' },
};
```

#### Comments (Giscus)

Set these environment variables for comments:

```bash
GISCUS_REPO=username/repo
GISCUS_REPO_ID=your-repo-id
GISCUS_CATEGORY=General
GISCUS_CATEGORY_ID=your-category-id
```

#### Analytics (Optional)

For Plausible analytics:

```bash
PLAUSIBLE_DOMAIN=yoursite.com
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

The site is configured to work out-of-the-box on Vercel Free tier.

### Manual Deployment Steps

1. Install dependencies:

```bash
pnpm install
```

2. Build the project:

```bash
pnpm build
```

3. The built files will be in the `dist/` directory.

## Project Structure

```
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   ├── content/         # Content collections
│   │   └── posts/       # Blog posts
│   ├── layouts/         # Page layouts
│   ├── pages/           # Route pages
│   ├── styles/          # Global styles
│   └── utils/           # Utility functions
├── scripts/             # Build and utility scripts
└── astro.config.mjs     # Astro configuration
```

## Content Categories

- **AI**: Artificial Intelligence news and developments
- **OpenSource**: Open source tools, self-hosting, and free alternatives
- **DevTools**: Development tools and methodologies

## Performance

This site is optimized for:

- ⚡ **Lighthouse Score**: 95+ across all metrics
- 🚀 **Core Web Vitals**: Excellent scores
- 📱 **Mobile-first**: Responsive design
- ♿ **Accessibility**: WCAG 2.1 AA compliant
- 🔍 **SEO**: Comprehensive meta tags and structured data

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Commit Convention

Use conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Maintenance tasks

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

For questions and support:

- 📧 Email: hello@teknopulse.com
- 🐛 Issues: [GitHub Issues](https://github.com/username/teknopulse/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/username/teknopulse/discussions)
