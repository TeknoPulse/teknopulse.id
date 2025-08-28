import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  site: 'https://teknopulse.vercel.app',
  output: 'server',
  integrations: [tailwind(), sitemap(), react(), vercel()],
  build: {
    inlineStylesheets: 'auto',
  },
});
