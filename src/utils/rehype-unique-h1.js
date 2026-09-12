// rehype-unique-h1
//
// Menjamin tepat satu <h1> per halaman artikel. Judul artikel sudah
// dirender sebagai <h1> di header template (`src/pages/posts/[slug].astro`),
// sehingga H1 pertama di badan Markdown harus ditangani:
//
//   - Kalau teksnya sama dengan `title` di frontmatter (pola lama:
//     `# <judul>` yang mengulang judul), H1 itu dibuang — duplikat persis.
//   - Kalau beda, H1 diturunkan jadi H2 — teks tetap tampil, struktur
//     heading tetap valid.
//
// Plugin ini jalan di pipeline Markdown global (astro.config.mjs) jadi
// memperbaiki semua artikel lama tanpa menyentuh file kontennya.

/**
 * @param {any} node - Node hast.
 * @returns {string} Teks di dalam node (digabung, tanpa HTML).
 */
function textContent(node) {
  if (node.type === 'text') return node.value ?? '';
  if (node.type === 'element' && Array.isArray(node.children)) {
    return node.children.map(textContent).join('');
  }
  return '';
}

const normalize = (value) =>
  String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();

export function rehypeUniqueH1() {
  /**
   * @param {any} tree - Pohon hast dokumen.
   * @param {any} file - VFile; Astro menyuntikkan frontmatter di
   *   `file.data.astroFrontmatter`.
   */
  return (tree, file) => {
    const children = Array.isArray(tree.children) ? tree.children : [];
    const firstElement = children.find((node) => node.type === 'element');
    if (!firstElement || firstElement.tagName !== 'h1') return;

    const frontmatter = file?.data?.astroFrontmatter;
    const title = normalize(frontmatter?.title);
    const heading = normalize(textContent(firstElement));

    if (title && heading === title) {
      tree.children = children.filter((node) => node !== firstElement);
    } else {
      firstElement.tagName = 'h2';
    }
  };
}
