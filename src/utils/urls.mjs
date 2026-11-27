// SSOT bentuk URL internal (TEKAA-377).
//
// `astro.config.mjs` memakai `trailingSlash: 'always'` dan
// `build.format: 'directory'`, jadi URL kanonik SELALU berakhiran `/`.
// Tautan internal yang ditulis tanpa slash memicu 308 di Cloudflare Pages
// (audit indexasi 342 URL: 318 dari 497 tautan internal = 64%).
//
// Semua helper di sini mengembalikan path absolut yang sudah ber-slash,
// supaya komponen cukup memanggilnya dan tidak menempelkan `/` sendiri.
//
// Sengaja `.mjs` tanpa sintaks TypeScript: modul ini diimpor juga oleh
// `scripts/sitemap-exclusions.mjs` saat `astro.config.mjs` dimuat, jadi
// harus jalan di Node apa pun yang dipakai Cloudflare Pages — tanpa
// bergantung pada type-stripping Node 22+. Pemakai TypeScript tetap dapat
// tipe lewat JSDoc di bawah.

/** Beranda, satu-satunya path yang memang sudah ber-slash. */
export const HOME_URL = '/';

// Ekstensi berkas statis yang memang tidak boleh diberi slash.
const STATIC_FILE_RE =
  /\.(?:xml|json|txt|csv|png|jpe?g|webp|avif|gif|svg|ico|css|js|mjs|map|pdf|webmanifest|woff2?|ttf|otf|zip)$/i;

/**
 * Slug tag — SSOT untuk route `/tags/<slug>/` dan filter sitemap.
 * @param {string} tag
 * @returns {string}
 */
export const slugifyTag = (tag) => tag.toLowerCase().replace(/\s+/g, '-');

/**
 * Pastikan sebuah path internal berakhiran tepat satu `/`.
 * Tidak menyentuh eksternal (`http`, `//`), anchor (`#`), atau query (`?`).
 * Berkas statis (mis. `/rss.xml`, `/favicon.svg`) dibiarkan apa adanya.
 * @param {string} path
 * @returns {string}
 */
export function withTrailingSlash(path) {
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) return path;
  const [, pathname = '', suffix = ''] = /^([^?#]*)([?#].*)?$/.exec(path) ?? [];
  if (pathname === '' || pathname.endsWith('/')) return path;
  const lastSegment = pathname.slice(pathname.lastIndexOf('/') + 1);
  // Hanya ekstensi berkas statis yang dilewati. Heuristik "ada titik" salah
  // untuk slug tag berangka seperti `/tags/opus-5.5`.
  if (STATIC_FILE_RE.test(lastSegment)) return path;
  return `${pathname}/${suffix}`;
}

/**
 * `/posts/<slug>/`
 * @param {string} slug
 * @returns {string}
 */
export function getPostUrl(slug) {
  return withTrailingSlash(`/posts/${slug}`);
}

/**
 * `/category/<slug>/` atau `/category/<slug>/<page>/`.
 * Halaman 1 = tanpa segmen nomor (kanonik), selaras `paginate`.
 * @param {string} categorySlug
 * @param {number} [page]
 * @returns {string}
 */
export function getCategoryUrl(categorySlug, page = 1) {
  return withTrailingSlash(
    page > 1 ? `/category/${categorySlug}/${page}` : `/category/${categorySlug}`
  );
}

/**
 * `/tags/<slug>/` atau `/tags/<slug>/<page>/`
 * @param {string} tagSlug
 * @param {number} [page]
 * @returns {string}
 */
export function getTagUrl(tagSlug, page = 1) {
  return withTrailingSlash(page > 1 ? `/tags/${tagSlug}/${page}` : `/tags/${tagSlug}`);
}

/**
 * `/authors/<slug>/`
 * @param {string} authorSlug
 * @returns {string}
 */
export function getAuthorUrl(authorSlug) {
  return withTrailingSlash(`/authors/${authorSlug}`);
}

/**
 * `/posts/<page>/`, dengan halaman 1 = `/posts/`.
 * @param {number} [page]
 * @returns {string}
 */
export function getPostsIndexUrl(page = 1) {
  return withTrailingSlash(page > 1 ? `/posts/${page}` : '/posts');
}
