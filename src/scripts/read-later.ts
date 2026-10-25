export const READ_LATER_KEY = 'teknopulse:read-later:v2';

function safeRead(): string[] {
  try {
    const raw = window.localStorage.getItem(READ_LATER_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function safeWrite(ids: string[]): void {
  try {
    window.localStorage.setItem(READ_LATER_KEY, JSON.stringify(ids));
  } catch {
    // Penyimpanan bisa diblokir (mode privat/kebijakan peramban). Fitur tetap
    // tampil, tetapi tautan tidak bertahan setelah halaman ditutup.
  }
}

export function readLaterIds(): string[] {
  return safeRead();
}

export function isSaved(id: string): boolean {
  return safeRead().includes(id);
}

export function toggleSaved(id: string): boolean {
  const ids = safeRead();
  const exists = ids.includes(id);
  const next = exists ? ids.filter((item) => item !== id) : [...ids, id];
  safeWrite(next);
  document.dispatchEvent(new CustomEvent('readlater:change', { detail: { id, saved: !exists } }));
  return !exists;
}

export function removeSaved(id: string): void {
  const next = safeRead().filter((item) => item !== id);
  safeWrite(next);
  document.dispatchEvent(new CustomEvent('readlater:change', { detail: { id, saved: false } }));
}

export function clearSaved(): void {
  safeWrite([]);
  document.dispatchEvent(
    new CustomEvent('readlater:change', { detail: { id: null, saved: false } })
  );
}

export function updateCount(): void {
  const count = safeRead().length;
  document.querySelectorAll<HTMLElement>('[data-readlater-count]').forEach((el) => {
    el.textContent = String(count);
    el.hidden = count === 0;
  });
}

function paintButton(button: HTMLButtonElement, saved: boolean): void {
  const title = button.dataset.title ?? 'artikel ini';
  button.classList.toggle('is-saved', saved);
  button.setAttribute('aria-pressed', String(saved));
  button.setAttribute(
    'aria-label',
    saved ? `Hapus ${title} dari Baca nanti` : `Simpan ${title} ke Baca nanti`
  );
  const label = button.querySelector<HTMLElement>('[data-readlater-label]');
  if (label) label.textContent = saved ? 'Tersimpan' : 'Baca nanti';
}

function paintAll(id?: string | null): void {
  document.querySelectorAll<HTMLButtonElement>('[data-readlater-toggle]').forEach((button) => {
    const buttonId = button.dataset.readlaterToggle;
    if (id != null && buttonId !== id) return;
    paintButton(button, buttonId ? isSaved(buttonId) : false);
  });
}

let bound = false;

export function bindReadLaterButtons(root: ParentNode = document): void {
  root.querySelectorAll<HTMLButtonElement>('[data-readlater-toggle]').forEach((button) => {
    if (button.dataset.readlaterBound === 'true') return;
    const id = button.dataset.readlaterToggle;
    if (!id) return;
    button.dataset.readlaterBound = 'true';
    paintButton(button, isSaved(id));
    button.addEventListener('click', () => {
      toggleSaved(id);
    });
  });
}

export function initReadLater(): void {
  if (bound) return;
  bound = true;

  bindReadLaterButtons();

  document.addEventListener('readlater:change', (event) => {
    const detail = (event as CustomEvent<{ id: string | null }>).detail;
    paintAll(detail?.id);
    updateCount();
  });

  window.addEventListener('storage', (event) => {
    if (event.key !== READ_LATER_KEY) return;
    paintAll();
    updateCount();
  });

  updateCount();
}

/** Dipakai halaman Baca nanti setelah daftar dirender ulang oleh skrip. */
export function repaintReadLater(): void {
  paintAll();
  updateCount();
}
