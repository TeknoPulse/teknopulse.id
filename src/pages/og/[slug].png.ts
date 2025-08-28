// src/pages/og/[slug].png.ts
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import OgTemplate from '../../components/og-template';

// ⚠️ Tidak perlu getStaticPaths() di API route

export const prerender = false;

export async function GET({ params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const posts = await getCollection('posts');
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
      return new Response('Post not found', { status: 404 });
    }

    const svg = await satori(
      OgTemplate({
        title: post.data.title,
        category: post.data.category,
        author: post.data.author,
        publishedAt: new Date(post.data.publishedAt).toLocaleDateString('id-ID'),
      }),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: await fetch('https://fonts.gstatic.com/s/inter/v19/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf').then(res => res.arrayBuffer()),
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Inter',
            data: await fetch('https://fonts.gstatic.com/s/inter/v19/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf').then(res => res.arrayBuffer()),
            weight: 600,
            style: 'normal',
          },
          {
            name: 'Inter',
            data: await fetch('https://fonts.gstatic.com/s/inter/v19/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf').then(res => res.arrayBuffer()),
            weight: 700,
            style: 'normal',
          },
        ],
      }
    );

    const resvg = new Resvg(svg, {
      background: 'rgba(31, 41, 55, 1)',
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    return new Response(pngBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('OG Image generation failed:', error);
    return new Response('OG Image generation failed', { status: 500 });
  }
}