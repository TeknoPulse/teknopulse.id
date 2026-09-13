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

export async function onRequest(context) {
  const host = (context.request.headers.get('host') || '').toLowerCase();
  if (!DUPLICATE_HOSTS.has(host)) {
    return context.next();
  }
  const url = new URL(context.request.url);
  return Response.redirect(`https://${CANONICAL_HOST}${url.pathname}${url.search}`, 301);
}
