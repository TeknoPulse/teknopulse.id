/**
 * Label & emoji badge untuk `difficulty` guide.
 *
 * Nilai difficulty didefinisikan di skema Zod collection guides
 * (`src/content/config.ts`). Helper ini satu-satunya tempat pemetaan
 * nilai → tampilan, supaya badge di daftar guide dan halaman detail
 * tidak pernah berbeda.
 */

export type GuideDifficulty = 'pemula' | 'menengah' | 'lanjutan';

export const GUIDE_DIFFICULTIES = ['pemula', 'menengah', 'lanjutan'] as const;

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

/** `'pemula'` → `'🟢'` */
export function difficultyEmoji(difficulty: GuideDifficulty): string {
  return EMOJI[difficulty];
}

/** `'pemula'` → `'Pemula'` */
export function difficultyLabel(difficulty: GuideDifficulty): string {
  return LABEL[difficulty];
}

/** `'pemula'` → `'🟢 Pemula'` (dipakai badge & tabel "Sekilas") */
export function difficultyBadge(difficulty: GuideDifficulty): string {
  return `${EMOJI[difficulty]} ${LABEL[difficulty]}`;
}

/** Validasi nilai dari query string `?diff=`; nilai asing → undefined. */
export function parseDifficulty(value: string | null): GuideDifficulty | undefined {
  return GUIDE_DIFFICULTIES.find((d) => d === value);
}
