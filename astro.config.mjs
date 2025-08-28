// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://teknopulse.id',
  output: 'static',
  adapter: vercel(),
  integrations: [tailwind(), sitemap(), react()],
  build: {
    inlineStylesheets: 'auto',
  },
});