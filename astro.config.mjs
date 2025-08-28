// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://teknopulse.id',
  output: 'static', // ✅ Untuk SEO terbaik
  integrations: [tailwind(), sitemap(), react()],
  build: {
    inlineStylesheets: 'auto',
  },
});