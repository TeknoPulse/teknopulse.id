/**
 * Label & emoji badge untuk `difficulty` guide.
 *
 * Nilai difficulty didefinisikan di skema Zod collection guides
 * (`src/content/config.ts`). Helper ini satu-satunya tempat pemetaan
 * nilai → tampilan, supaya badge di daftar guide dan halaman detail
 * tidak pernah berbeda.
 */

export type GuideDifficulty = 'pemula' | 'menengah' | 'lanjutan';

const EMOJI: Record<GuideDifficulty, string> = {
  pemula: '🟢',
  menengah: '🟡',
  lanjutan: '🔴',
};

const LABEL: Record<GuideDifficulty, string> = {
  pemula: 'Pemula',
  menengah: 'Menengah',
  lanjutan: 'Lanjutan',
};

/** `'pemula'` → `'🟢 Pemula'` (dipakai badge & tabel "Sekilas") */
export function difficultyBadge(difficulty: GuideDifficulty): string {
  return `${EMOJI[difficulty]} ${LABEL[difficulty]}`;
}
