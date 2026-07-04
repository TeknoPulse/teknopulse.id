import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// Static output (Astro default) — deploy `dist/` to Cloudflare Pages.
// SSR was dropped 2026-07-04 for the Cloudflare migration: @resvg/resvg-js
// (the native Rust renderer behind /og/<slug>.png) cannot run on Cloudflare's
// V8 Workers runtime, and Vite could not bundle the .node into the server
// entry anyway. OG images are now prerendered per-post at build time via
// getStaticPaths in src/pages/og/[slug].png.ts, so resvg runs only under Node
// during `astro build` and no native addon lands in any runtime bundle.
export default defineConfig({
  site: 'https://teknopulse.id',
  integrations: [tailwind(), sitemap(), react()],
  build: {
    inlineStylesheets: 'auto',
  },

  vite: {
    optimizeDeps: {
      exclude: ['pagefind'],
    },
  },
});
