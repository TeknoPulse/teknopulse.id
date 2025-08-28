// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel'; // ✅ Import yang benar

export default defineConfig({
  site: 'https://teknopulse.id', // ✅ URL bersih
  output: 'server', // ✅ Wajib untuk SSR/OG image
  adapter: vercel(), // ✅ Adapter ditempatkan di sini
  integrations: [tailwind(), sitemap(), react()], // ✅ vercel() TIDAK di sini
  build: {
    inlineStylesheets: 'auto',
  },
});