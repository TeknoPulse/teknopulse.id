# TeknoPulse Deployment Guide

This guide provides step-by-step instructions for deploying TeknoPulse to Vercel and other platforms.

## Quick Deploy to Vercel (Recommended)

### Prerequisites

- GitHub account
- Vercel account (free tier is sufficient)
- Node.js 18+ and pnpm 8+ (for local development)

### Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push your local code to GitHub:

```bash
git remote add origin https://github.com/yourusername/teknopulse.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Astro
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

5. Set environment variables (optional):

   ```
   GISCUS_REPO=yourusername/teknopulse
   GISCUS_REPO_ID=your-repo-id
   GISCUS_CATEGORY=General
   GISCUS_CATEGORY_ID=your-category-id
   PLAUSIBLE_DOMAIN=yoursite.com
   ```

6. Click "Deploy"

### Step 3: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Navigate to "Settings" > "Domains"
3. Add your custom domain
4. Update `src/config.ts` with your domain:

```typescript
export const site = {
  name: 'TeknoPulse',
  description: 'Berita harian teknologi dan AI: cepat, ringkas, kontekstual.',
  url: 'https://yourdomain.com', // Update this
  defaultLocale: 'id-ID',
  socials: {
    x: 'https://x.com/teknopulse',
    threads: 'https://threads.net/@teknopulse',
    github: 'https://github.com/yourusername/teknopulse',
  },
};
```

## Alternative Deployment Options

### Netlify

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - **Build command**: `pnpm build`
   - **Publish directory**: `dist`
   - **Node version**: 18

### Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings:
   - **Framework preset**: Astro
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`

### Self-Hosted (VPS/Dedicated Server)

1. Install Node.js 18+ and pnpm
2. Clone your repository
3. Install dependencies: `pnpm install`
4. Build the project: `pnpm build`
5. Serve the `dist` folder with a web server (nginx, Apache, etc.)

## Post-Deployment Configuration

### 1. Enable Comments (Giscus)

1. Enable GitHub Discussions on your repository
2. Install the Giscus app: https://github.com/apps/giscus
3. Get your configuration from: https://giscus.app
4. Update environment variables in Vercel/Netlify

### 2. Enable Analytics (Optional)

For Plausible Analytics:

1. Sign up at https://plausible.io
2. Add your domain
3. Set `PLAUSIBLE_DOMAIN` environment variable

### 3. Configure Search (Pagefind)

The search functionality will work automatically after deployment. Pagefind will index your content during the build process.

### 4. Update Site Configuration

Edit `src/config.ts` to match your deployment:

```typescript
export const site = {
  name: 'Your Site Name',
  description: 'Your site description',
  url: 'https://yoursite.vercel.app', // Your actual URL
  defaultLocale: 'id-ID',
  socials: {
    x: 'https://x.com/yourhandle',
    threads: 'https://threads.net/@yourhandle',
    github: 'https://github.com/yourusername/yourrepo',
  },
};
```

## Content Management

### Adding New Posts

Use the built-in script to create new posts:

```bash
pnpm post:new "Your Post Title"
```

This creates a new Markdown file with proper frontmatter in `src/content/posts/`.

### Post Frontmatter Structure

```yaml
---
title: 'Your Post Title'
slug: 'your-post-slug' # Optional, auto-generated from filename
summary: 'Brief description of your post'
publishedAt: 2025-08-25T10:00:00Z
updatedAt: 2025-08-25T10:00:00Z # Optional
tags: ['AI', 'Technology']
category: AI # AI, Cloud, Security, DevTools, Policy
author: 'Author Name'
coverImage: 'https://example.com/image.jpg' # Optional
draft: false # Set to true to hide from public
---
```

### Categories

Available categories:

- **AI**: Artificial Intelligence news and developments
- **Cloud**: Cloud computing and infrastructure
- **Security**: Cybersecurity and data protection
- **DevTools**: Development tools and methodologies
- **Policy**: Technology policy and regulations

## Performance Optimization

### Lighthouse Scores

The site is optimized for excellent Lighthouse scores:

- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Image Optimization

- Use WebP format when possible
- Include proper alt text for accessibility
- Optimize images before uploading
- Use appropriate sizes for different viewports

## SEO Features

### Automatic Generation

- **Sitemap**: Generated at `/sitemap.xml`
- **RSS Feed**: Available at `/rss.xml`
- **JSON Feed**: Available at `/feed.json`
- **Robots.txt**: Configured for search engines

### Meta Tags

Each page includes:

- Open Graph tags for social sharing
- Twitter Card tags
- Structured data (JSON-LD)
- Canonical URLs
- Meta descriptions

### Dynamic OG Images

Open Graph images are generated dynamically for each post using the post title and category.

## Monitoring and Analytics

### Error Monitoring

Consider adding error monitoring services:

- Sentry
- LogRocket
- Bugsnag

### Performance Monitoring

- Vercel Analytics (built-in)
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

## Backup and Recovery

### Content Backup

- All content is stored in Git
- Regular commits ensure version history
- Consider automated backups of your repository

### Database-Free Architecture

TeknoPulse uses a static site architecture with no database dependencies, making it:

- Highly reliable
- Easy to backup
- Fast to restore
- Secure by default

## Security Considerations

### HTTPS

- Vercel provides HTTPS by default
- Custom domains get automatic SSL certificates

### Content Security

- No user-generated content reduces attack surface
- Static site architecture eliminates many vulnerabilities
- Regular dependency updates via Dependabot

### Environment Variables

Never commit sensitive information:

- Use environment variables for API keys
- Keep `.env` files out of version control
- Use Vercel's environment variable management

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+ required)
   - Verify pnpm version (8+ required)
   - Review build logs for specific errors

2. **Missing Content**
   - Ensure posts have `draft: false`
   - Check frontmatter syntax
   - Verify file extensions (.md)

3. **Styling Issues**
   - Clear browser cache
   - Check Tailwind CSS configuration
   - Verify CSS imports

4. **Search Not Working**
   - Pagefind requires deployment to function
   - Check build logs for Pagefind errors
   - Ensure content is properly indexed

### Getting Help

- Check the [GitHub Issues](https://github.com/yourusername/teknopulse/issues)
- Review [Astro Documentation](https://docs.astro.build)
- Join the [Astro Discord](https://astro.build/chat)

## Maintenance

### Regular Updates

1. **Dependencies**: Update monthly

   ```bash
   pnpm update
   ```

2. **Security**: Monitor for security advisories

   ```bash
   pnpm audit
   ```

3. **Content**: Regular posting schedule
4. **Performance**: Monthly Lighthouse audits

### Automated Workflows

Consider setting up GitHub Actions for:

- Automated testing
- Dependency updates
- Security scanning
- Performance monitoring

## Scaling

### Traffic Growth

The static site architecture scales automatically with CDN:

- Vercel Edge Network handles global distribution
- No server capacity planning needed
- Automatic scaling during traffic spikes

### Content Growth

- Pagination handles large numbers of posts
- Search remains fast with Pagefind indexing
- Consider content archiving for very old posts

### Team Growth

- Multiple authors supported via frontmatter
- Git workflow supports collaborative editing
- Consider CMS integration for non-technical editors

---

For additional support, please refer to the main [README.md](README.md) and [CONTRIBUTING.md](CONTRIBUTING.md) files.
