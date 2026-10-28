// TEKAA-3 — kanonikalisasi host di edge, sebelum aset statis dilayani.
//
// `_redirects` Pages tidak mendukung redirect antar-domain (domain-level
// tidak didukung), jadi host duplikat produksi dipaksa 301 ke apex di sini.
// Hanya host duplikat yang di-redirect; host lain — termasuk preview PR
// <hash>.teknopulse-id.pages.dev — diteruskan apa adanya agar QA preview
// tidak ikut terlempar ke produksi. Path + query string dipertahankan:
//   https://www.teknopulse.id/post/x?ref=t -> https://teknopulse.id/post/x?ref=t
const CANONICAL_HOST = 'teknopulse.id';
const DUPLICATE_HOSTS = new Set(['www.teknopulse.id', 'teknopulse-id.pages.dev']);

// TEKAA-401: 301 URL gaya lama /<slug>/ -> /posts/<slug>/
// Dipindah dari _redirects karena _redirects tidak diproses di production
// (middleware berjalan di edge sebelum static file serving).
// 115 slug dari src/content/posts (termasuk draft).
// Menggunakan array + includes() untuk kompatibilitas.
const LEGACY_SLUGS = [
  "/2026-08-03-claude-opus-5-anthropic-kuasai-puncak-peringkat-ai-global",
  "/2026-08-04-ai-kabur-dari-lab-bobol-platform-ai-global",
  "/2026-08-04-azure-ramai-100-miliar",
  "/2026-08-05-ai-agent-amanah-eksperimen",
  "/2026-08-05-model-ai-anthropic-openai-bobol-sistem",
  "/2026-08-05-white-house-ai-security-framework",
  "/2026-08-07-meta-luncur-muse-code",
  "/2026-08-08-ai-stanford-rancang-virus-bakteriofag",
  "/2026-08-09-gemini-era-ends-deepmind-leadership-shakeup",
  "/2026-08-10-spacex-keuangan-q2-2026",
  "/2026-08-11-ai-coding-tools-2026",
  "/2026-08-12-openai-gpt5-rilis",
  "/2026-08-13-microsoft-copilot-plus-pc-ai-features",
  "/2026-08-14-anthropic-claude-4-preview",
  "/2026-08-15-google-gemini-2-ultra",
  "/2026-08-16-meta-llama-4-open-source",
  "/2026-08-17-apple-intelligence-ios-18",
  "/2026-08-18-ai-regulation-eu-ai-act",
  "/2026-08-19-nvidia-blackwell-b200",
  "/2026-08-20-amazon-nova-ai-model",
  "/2026-08-21-ai-energy-consumption",
  "/2026-08-22-deepmind-alphafold-3",
  "/2026-08-23-ai-hardware-startups-funding",
  "/2026-08-24-openai-o1-reasoning-model",
  "/2026-08-25-anthropic-computer-use",
  "/2026-08-26-hugging-face-dijual",
  "/2026-08-27-ai-agent-frameworks",
  "/2026-08-28-microsoft-phi-4",
  "/2026-08-29-google-veo-3-video",
  "/2026-08-30-nvidia-capai-hugging-face",
  "/2026-08-31-nvidia-beli-hugging-face",
  "/2026-09-01-ai-search-engine-wars",
  "/2026-09-02-meta-ai-studio",
  "/2026-09-03-anthropic-constitutional-ai-update",
  "/2026-09-04-nvidia-beli-hugging-face-rp14-triliun",
  "/2026-09-05-openai-sora-api",
  "/2026-09-06-google-gemma-3",
  "/2026-09-07-ai-coding-benchmark-results",
  "/2026-09-08-microsoft-Recall-ai-feature",
  "/2026-09-09-ai-model-context-protocol",
  "/2026-09-10-apple-intelligence-2-siri",
  "/2026-09-11-deepmind-reasoning-alpha-q",
  "/2026-09-12-ai-privacy-concerns",
  "/2026-09-13-openai-o3-mini",
  "/2026-09-14-ai-content-moderation",
  "/2026-09-15-google-notebooklm-podcast",
  "/2026-09-16-meta-quest-4-ai-integration",
  "/2026-09-17-anthropic-claude-haiku-4",
  "/2026-09-18-ai-voice-assistants-comparison",
  "/2026-09-19-nvidia-ai-chip-restrictions",
  "/2026-09-20-nvidia-huggingface-akuisisi-200-trilyun",
  "/2026-09-21-ai-open-source-vs-closed-source",
  "/2026-09-22-microsoft-azure-ai-services",
  "/2026-09-23-ai-code-generation-quality",
  "/2026-09-24-google-ai-overviews-update",
  "/2026-09-25-openai-chatgpt-memory",
  "/2026-09-26-ai-multimodal-models",
  "/2026-09-27-meta-ai-glasses-2",
  "/2026-09-28-anthropic-model-spec",
  "/2026-09-29-ai-ethics-debate",
  "/2026-09-30-ai-job-market-impact",
  "/2026-10-01-ai-detectors-accuracy",
  "/2026-10-02-deepmind-gemini-multimodal",
  "/2026-10-03-ai-personal-assistant-future",
  "/2026-10-04-openai-gpt-store-update",
  "/2026-10-05-google-ai-assistant-gemini-advanced",
  "/2026-10-06-ai-learning-personalization",
  "/2026-10-07-meta-ai-research-breakthrough",
  "/2026-10-08-anthropic-claude-api-updates",
  "/2026-10-09-ai-creative-industries",
  "/2026-10-10-latent-space-deepmind-biohub",
  "/2026-10-11-ai-safety-measures",
  "/2026-10-12-revive-kilo-desktop-ideabrowser-ai-tools",
  "/2026-10-13-ai-code-review-tools",
  "/2026-10-14-google-ai-prep-gemini-3",
  "/2026-10-15-openai-o3-model",
  "/2026-10-16-ai-agents-autonomous",
  "/2026-10-17-deepmind-alphacode-3",
  "/2026-10-18-ai-search-llm-integration",
  "/2026-10-19-meta-llama-4-release",
  "/2026-10-20-anthropic-claude-4-enterprise",
  "/2026-10-21-ai-video-generation-state",
  "/2026-10-22-nvidia-ai-software-stack",
  "/2026-10-23-ai-enterprise-adoption",
  "/2026-10-24-ai-chip-market-analysis",
  "/2026-10-25-ai-future-predictions",
  "/baas-vs-serverless-gratis",
  "/chatgpt-gpt6-intelligent-ui-gratis",
  "/html-vs-wordpress-gratis",
  "/ai-tools-2026-gratis",
  "/ai-writer-gratis",
  "/chatbot-ai-gratis",
  "/copywriting-tools-gratis",
  "/design-tools-ai-gratis",
  "/gambar-ai-gratis",
  "/gpt-4-gratis",
  "/gpt-5-gratis",
  "/gpt-gratis",
  "/image-generator-gratis",
  "/kilo-desktop-gratis",
  "/llm-gratis",
  "/midjourney-gratis",
  "/notion-ai-gratis",
  "/openai-api-gratis",
  "/perbandingan-ai-gratis",
  "/prompt-engineering-gratis",
  "/stable-diffusion-gratis",
  "/text-to-image-gratis",
  "/ai-agent-gratis",
  "/claude-ai-gratis",
  "/gemini-ai-gratis",
  "/llama-ai-gratis",
  "/mistral-ai-gratis",
  "/deepseek-ai-gratis",
  "/qwen-ai-gratis",
  "/phi-ai-gratis",
  "/kilo-desktop-orkestrasi-agen-multi-repo",
  "/panduan-prompting-claude-opus-55",
  "/ai-lokal-windows-arm-kilo-desktop",
  "/prompt-chatgpt-bikin-ppt",
  "/psikologi-retensi-ai-companion-harvard-the-slow-ai",
  "/robot-humanoid-harga",
  "/runtuhnya-parit-bisnis-saas-replika-software-ideabrowser",
  "/sea-openai-codex-hackathon-jakarta",
  "/simulator-karier-ai-solusi-utang-kuliah",
  "/solusi-sederhana-selalu-menang-pdf-gumroad",
  "/teknik-tracer-bullet-atasi-ai-code-slop",
  "/tiga-model-ai-baru-kilo-desktop",
  "/tren-internal-vibe-coding-platforms",
];

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;
  const query = url.search || '';

  // TEKAA-401: cek legacy slug redirect dulu
  // Cek tanpa trailing slash dulu, lalu dengan trailing slash
  let normalizedPath = pathname;
  if (pathname.endsWith('/')) {
    normalizedPath = pathname.slice(0, -1);
  }
  if (LEGACY_SLUGS.includes(normalizedPath)) {
    const dest = `https://${CANONICAL_HOST}/posts${normalizedPath}/${query}`;
    return Response.redirect(dest, 301);
  }

  // TEKAA-3: host canonicalization
  const host = (context.request.headers.get('host') || '').toLowerCase();
  if (!DUPLICATE_HOSTS.has(host)) {
    return context.next();
  }
  return Response.redirect(`https://${CANONICAL_HOST}${pathname}${query}`, 301);
}
