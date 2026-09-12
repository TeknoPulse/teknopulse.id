// Direktori penulis — sumber byline non-generik.
//
// Setiap artikel merujuk penulis lewat `author` di frontmatter, yang harus
// sama dengan `name` (atau salah satu `aliases`) di bawah. Kalau cocok,
// byline di halaman artikel jadi tautan ke halaman profil `/authors/<slug>/`
// dan JSON-LD `Article` mendapat `author` bertipe `Person` dengan `url`.
//
// Tambahkan penulis nyata di sini (nama, slug, role, bio) saat redaksi
// bertambah — tidak perlu mengubah template.

export interface AuthorLink {
  label: string;
  url: string;
}

export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  // Variasi byline lama di frontmatter yang dimapulkan ke penulis ini.
  aliases?: string[];
  links?: AuthorLink[];
}

export const authors: Author[] = [
  {
    slug: 'redaksi-teknopulse',
    name: 'TeknoPulse Redaksi',
    role: 'Redaksi TeknoPulse',
    bio: 'Tim redaksi TeknoPulse — meliput perkembangan AI, open source, dan developer tools untuk pembaca Indonesia.',
    aliases: ['TeknoPulse', 'Tim Redaksi Teknopulse'],
    links: [
      { label: 'X (Twitter)', url: 'https://x.com/teknopulse_id' },
      { label: 'Threads', url: 'https://threads.net/@teknopulse.id' },
    ],
  },
];

const normalize = (value: string) => value.trim().toLowerCase();

// Cari penulis berdasarkan byline frontmatter (cocokkan `name` atau `aliases`).
export function getAuthor(name: string | undefined): Author | undefined {
  if (!name) return undefined;
  const needle = normalize(name);
  return authors.find(
    (author) =>
      normalize(author.name) === needle ||
      (author.aliases ?? []).some((alias) => normalize(alias) === needle)
  );
}

// URL halaman profil penulis (path relatif).
export function getAuthorUrl(author: Author): string {
  return `/authors/${author.slug}`;
}

// Cari penulis berdasarkan slug profil (dipakai breadcrumb halaman penulis).
export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((author) => author.slug === slug);
}
