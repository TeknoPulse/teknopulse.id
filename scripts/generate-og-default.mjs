// Regenerate aset brand rasters (TEKAA-3 P0-2 & P1-9):
//
//   public/og-default.png — kartu OG default 1200×630. Sebelumnya file ini
//     berisi teks placeholder 156 byte dengan content-type image/png, yang
//     merusak preview share di 112 halaman. Kartu ini memakai layout yang
//     sama dengan kartu OG per-artikel (src/components/og-template.tsx).
//
//   public/logo-512.png — logo 512×512 untuk `publisher.logo` di JSON-LD
//     Article (syarat rich result Google). SVG (favicon) tidak dipakai
//     karena dukungan formatnya tidak dijamin.
//
// Jalankan manual saat brand/tagline berubah:
//   node scripts/generate-og-default.mjs
//
// Catatan: layout kartu disalin dari og-template.tsx sebagai object literal
// (bukan import) supaya skrip ini jalan di Node polos tanpa compiler TSX.

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Font Inter — sumber & URL sama dengan src/pages/og/[slug].png.ts.
const fontUrls = {
  regular:
    'https://fonts.gstatic.com/s/inter/v19/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf',
  bold: 'https://fonts.gstatic.com/s/inter/v19/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf',
};

const fonts = await Promise.all(
  Object.values(fontUrls).map((url) => fetch(url).then((res) => res.arrayBuffer()))
);

const interFonts = [
  { name: 'Inter', data: fonts[0], weight: 400, style: 'normal' },
  { name: 'Inter', data: fonts[1], weight: 700, style: 'normal' },
];

async function renderPng(svg, width) {
  const resvg = new Resvg(svg, {
    background: 'rgba(28, 25, 23, 1)',
    fitTo: { mode: 'width', value: width },
  });
  return resvg.render().asPng();
}

// — og-default.png (1200×630) — layout identik dengan og-template.tsx —
const tagline = 'Berita Teknologi, AI & Gadget Terkini Indonesia';
const ogSvg = await satori(
  {
    type: 'div',
    props: {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: '#1c1917',
        backgroundImage: 'linear-gradient(135deg, #1c1917 0%, #0c0a09 100%)',
        padding: '60px',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '32px',
                    fontWeight: 700,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                  },
                  children: 'TeknoPulse',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    backgroundColor: '#f97316',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '18px',
                    fontWeight: 600,
                  },
                  children: 'Berita AI',
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
              width: '100%',
            },
            children: {
              type: 'h1',
              props: {
                style: {
                  fontSize: '64px',
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: '1.1',
                  margin: 0,
                  marginBottom: '20px',
                },
                children: tagline,
              },
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: { color: '#a8a29e', fontSize: '20px' },
                  children: 'Review dan analisis teknologi',
                },
              },
              {
                type: 'div',
                props: { style: { color: '#9ca3af', fontSize: '18px' }, children: 'teknopulse.id' },
              },
            ],
          },
        },
      ],
    },
  },
  { width: 1200, height: 630, fonts: interFonts }
);

// — logo-512.png — logo brand untuk publisher.logo (JSON-LD) —
const logoSvg = await satori(
  {
    type: 'div',
    props: {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1c1917',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              width: '64px',
              height: '10px',
              backgroundColor: '#f97316',
              borderRadius: '5px',
              marginBottom: '28px',
            },
          },
        },
        {
          type: 'div',
          props: {
            style: { fontSize: '86px', fontWeight: 700, color: '#ffffff', letterSpacing: '-2px' },
            children: 'TeknoPulse',
          },
        },
        {
          type: 'div',
          props: {
            style: { fontSize: '26px', color: '#a8a29e', marginTop: '14px' },
            children: 'teknopulse.id',
          },
        },
      ],
    },
  },
  { width: 512, height: 512, fonts: interFonts }
);

await writeFile(path.join(repoRoot, 'public/og-default.png'), await renderPng(ogSvg, 1200, 630));
await writeFile(path.join(repoRoot, 'public/logo-512.png'), await renderPng(logoSvg, 512, 512));
console.log('OK: public/og-default.png (1200×630) + public/logo-512.png (512×512)');
