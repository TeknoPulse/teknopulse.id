import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import { fileURLToPath } from 'node:url';
import { rehypeUniqueH1 } from './src/utils/rehype-unique-h1.js';
import { createSitemapFilter } from './scripts/sitemap-exclusions.mjs';

// Static output (Astro default) — deploy `dist/` to Cloudflare Pages.
// SSR was dropped 2026-07-04 for the Cloudflare migration: @resvg/resvg-js
// (the native Rust renderer behind /og/<slug>.png) cannot run on Cloudflare's
// V8 Workers runtime, and Vite could not bundle the .node into the server
// entry anyway. OG images are now prerendered per-post at build time via
// getStaticPaths in src/pages/og/[slug].png.ts, so resvg runs only under Node
// during `astro build` and no native addon lands in any runtime bundle.
export default defineConfig({
  site: 'https://teknopulse.id',
  integrations: [
    tailwind(),
    // Sitemap bersih dari halaman tipis (TEKAA-3 P1-8): paginasi ≥2 dan
    // tag dengan ≤1 artikel dikeluarkan (halamannya tetap ada, noindex).
    sitemap({
      filter: createSitemapFilter({
        site: 'https://teknopulse.id',
        postsDir: fileURLToPath(new URL('./src/content/posts', import.meta.url)),
      }),
    }),
    react(),
  ],
  markdown: {
    // Tepat satu <h1> per halaman artikel (TEKAA-5): H1 pertama di badan
    // Markdown dibuang bila duplikat judul, atau diturunkan ke H2 bila beda.
    rehypePlugins: [rehypeUniqueH1],
  },
  build: {
    inlineStylesheets: 'auto',
  },

  vite: {
    optimizeDeps: {
      exclude: ['pagefind'],
    },
  },
});
