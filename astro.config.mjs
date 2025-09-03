// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
// 1. Perbarui import adapter Vercel (tanpa '/serverless')
import vercel from '@astrojs/vercel'; // <-- Perubahan utama di sini

export default defineConfig({
  site: 'https://teknopulse.id',
  // Mode SSR
  output: 'server',
  integrations: [tailwind(), sitemap(), react()],
  build: {
    inlineStylesheets: 'auto',
  },

  vite: {
    optimizeDeps: {
      exclude: ['pagefind'],
    },
  },

  adapter: vercel()
});