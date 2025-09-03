// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
// 1. Impor adapter Vercel
import vercel from '@astrojs/vercel/serverless'; // Gunakan '/serverless' untuk SSR

export default defineConfig({
  site: 'https://teknopulse.id', // Diperbaiki: Spasi dihapus
  output: 'server', // Mode SSR
  // 2. Tambahkan adapter Vercel ke integrations
  integrations: [tailwind(), sitemap(), react(), vercel()],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    optimizeDeps: {
      exclude: ['pagefind'],
    },
  },
  // Opsional: Konfigurasi tambahan untuk adapter Vercel jika diperlukan
  // Lihat dokumentasi @astrojs/vercel untuk opsi konfigurasi
  // adapter: vercel({ /* opsi konfigurasi */ })
});