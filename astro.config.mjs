// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
// 1. Perbarui import adapter Vercel (tanpa '/serverless')
import vercel from '@astrojs/vercel'; // <-- Perubahan utama di sini

export default defineConfig({
  site: 'https://teknopulse.id', // Pastikan tidak ada spasi tambahan
  output: 'server', // Mode SSR
  // 2. Tambahkan adapter Vercel ke integrations
  integrations: [tailwind(), sitemap(), react(), vercel()], // <-- Pastikan ada di sini
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    optimizeDeps: {
      exclude: ['pagefind'],
    },
  },
  // Opsional: Konfigurasi tambahan untuk adapter Vercel jika diperlukan
  // adapter: vercel({ /* opsi konfigurasi spesifik Vercel */ })
});
