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
slug: 'your-post-slug'
summary: 'Brief description of your post'
publishedAt: 2025-08-25T10:00:00Z
updatedAt: 2025-08-25T10:00:00Z
tags: ['AI', 'Technology']
category: AI # AI, Cloud, Security, DevTools, Policy
author: 'Author Name'
coverImage: 'https://example.com/image.jpg'
draft: false
---
```

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
- **Cloud**: Cloud computing and infrastructure
- **Security**: Cybersecurity and data protection
- **DevTools**: Development tools and methodologies
- **Policy**: Technology policy and regulations

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
