// src/utils/consent.ts
//
// Consent deep module — single source of truth for all GA4 consent state logic.
// ADR 0001. Imported by CookieConsent.astro and privacy-policy.astro.
//
// Pure functions (state machine, shouldShow, isEnabled, read) are safe to call
// in any environment. Browser-effect functions (loadGa4, saveStored) must only
// be called from client-side <script> contexts.

const GA4_ID = 'G-79X7QWV977';

export interface ConsentState {
  decision: 'granted' | 'denied' | 'deferred';
  dismissCount: number;
  lastDismissed: string | null; // 'YYYY-MM-DD' or null
  cycleStarted: string | null; // 'YYYY-MM-DD' or null
}

export type ConsentEvent = 'accept' | 'deny' | 'defer' | 'toggleOn' | 'toggleOff';

const STORAGE_KEY = 'teknopulse-consent-ga4';

// ── Pure functions ────────────────────────────────────────────────────────────

/**
 * Read and migrate the consent record from localStorage.
 * Migrates legacy bare-string "granted"/"denied" → ConsentState shape.
 * Returns null when no record exists or on parse error.
 * BROWSER ONLY — uses localStorage.
 */
export function read(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    // Migrate legacy bare-string format from old two-button implementation.
    if (raw === 'granted' || raw === 'denied') {
      const migrated: ConsentState = {
        decision: raw,
        dismissCount: 0,
        lastDismissed: null,
        cycleStarted: null,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

/**
 * Pure state machine. Returns the next ConsentState given a previous state and
 * a consent event. `today` must be a 'YYYY-MM-DD' string.
 */
export function next(prev: ConsentState | null, event: ConsentEvent, today: string): ConsentState {
  switch (event) {
    case 'accept':
    case 'toggleOn':
      return { decision: 'granted', dismissCount: 0, lastDismissed: null, cycleStarted: today };
    case 'deny':
    case 'toggleOff':
      return { decision: 'denied', dismissCount: 0, lastDismissed: null, cycleStarted: null };
    case 'defer':
      return {
        decision: 'deferred',
        dismissCount: (prev?.dismissCount ?? 0) + 1,
        lastDismissed: today,
        cycleStarted: prev?.cycleStarted ?? today,
      };
  }
}

/**
 * Pure visibility predicate. Returns true when the consent banner should be shown.
 *
 * Rules:
 * - null state (first visit) → show
 * - decision 'granted' or 'denied' → never show
 * - 'deferred' with no lastDismissed → show (shouldn't normally occur, but safe)
 * - 'deferred' within active cycle (dismissCount < 3): show again next calendar day
 *   (daysBetween(lastDismissed, today) >= 1)
 * - 'deferred' with cycle exhausted (dismissCount >= 3): show after 30-day rest
 *   from lastDismissed
 */
export function shouldShow(prev: ConsentState | null, today: string): boolean {
  if (!prev || prev.decision !== 'deferred') {
    // null → first visit; granted/denied → never show
    return prev === null;
  }
  if (!prev.lastDismissed) return true;

  const days = _daysBetween(prev.lastDismissed, today);
  const CYCLE_MAX = 3;
  const REST_DAYS = 30;

  if (prev.dismissCount < CYCLE_MAX) {
    return days >= 1;
  }
  return days >= REST_DAYS;
}

/** Returns true only when the user has actively granted consent. */
export function isEnabled(state: ConsentState | null): boolean {
  return state?.decision === 'granted';
}

// ── Browser-effect functions ──────────────────────────────────────────────────

/**
 * Idempotent GA4 script injection.
 * Calling this twice is safe — the data-ga4 guard prevents double injection.
 * BROWSER ONLY.
 */
export function loadGa4(): void {
  if (document.querySelector('script[data-ga4]')) return;
  // GA4 bootstrap uses the `arguments` object — rest params break the command
  // queue because GA4 expects a single arguments-like entry per gtag() call.
  // We cast through `unknown` to avoid ESLint's no-explicit-any on window.
  const win = window as unknown as Record<string, unknown>;
  win['dataLayer'] = win['dataLayer'] ?? [];
  const dl = win['dataLayer'] as IArguments[];
  win['gtag'] = function gtag() {
    // GA4 command queue requires a single arguments-like entry per call.
    // eslint-disable-next-line prefer-rest-params
    dl.push(arguments as unknown as IArguments);
  };
  (win['gtag'] as (cmd: string, ...args: unknown[]) => void)('js', new Date());
  (win['gtag'] as (cmd: string, ...args: unknown[]) => void)('config', GA4_ID);
  const s = document.createElement('script');
  s.async = true;
  s.dataset.ga4 = GA4_ID;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
  document.head.appendChild(s);
}

/**
 * Serialize ConsentState to localStorage.
 * Throws when localStorage is blocked (private-mode browsers).
 * BROWSER ONLY.
 */
export function saveStored(state: ConsentState): void {
  // Let the exception propagate — callers decide how to handle storage failures.
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ── Internal helper ───────────────────────────────────────────────────────────

/** Compare ordinal calendar days (not UTC milliseconds). */
function _daysBetween(dateStr1: string, dateStr2: string): number {
  const [y1, m1, d1] = dateStr1.split('-').map(Number);
  const [y2, m2, d2] = dateStr2.split('-').map(Number);
  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);
  return Math.floor((utc2 - utc1) / 86400000);
}
