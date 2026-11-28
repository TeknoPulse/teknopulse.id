/**
 * Slug helper untuk pipeline guide.
 *
 * Dipakai saat menurunkan nama file guide dari judul artikel. Panjang dibatasi
 * supaya nama file tidak melewati batas filesystem dan URL tetap terbaca.
 * Ini slug *nama file/URL*, bukan slug tampilan editorial — guide yang sudah
 * terbit tetap memakai nama filenya saat ini.
 */

const MAX_LENGTH = 60;

export function slugifyTitle(text: string, maxLength = MAX_LENGTH): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, maxLength)
    .replace(/-+$/, ''); // jangan tinggalkan '-' menggantung setelah dipotong
}
