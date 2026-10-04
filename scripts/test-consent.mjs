/**
 * scripts/test-consent.mjs
 *
 * Unit tests for src/utils/consent.ts pure functions.
 * Mirrors the pattern in scripts/test-preservation-baseline.mjs.
 * Run: node scripts/test-consent.mjs
 */

import assert from 'node:assert/strict';

// ── Local JS copies of the pure functions (browser effects excluded) ──────────

const CYCLE_MAX = 3;
const REST_DAYS = 30;

function _daysBetween(dateStr1, dateStr2) {
  const [y1, m1, d1] = dateStr1.split('-').map(Number);
  const [y2, m2, d2] = dateStr2.split('-').map(Number);
  return Math.floor((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}

function next(prev, event, today) {
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

function shouldShow(prev, today) {
  if (!prev || prev.decision !== 'deferred') {
    return prev === null;
  }
  if (!prev.lastDismissed) return true;
  const days = _daysBetween(prev.lastDismissed, today);
  if (prev.dismissCount < CYCLE_MAX) return days >= 1;
  return days >= REST_DAYS;
}

function isEnabled(state) {
  return state?.decision === 'granted';
}

// ── Test runner ───────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS  ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL  ${name}\n         ${err.message}`);
    failed++;
    failures.push(name);
  }
}

// ── Scenarios ─────────────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════════');
console.log('  consent.ts — pure function unit tests (13 scenarios)');
console.log('══════════════════════════════════════════════════════════\n');

// 1. accept → granted state
test('next(null, accept) → decision granted, counts zeroed', () => {
  const s = next(null, 'accept', '2026-01-01');
  assert.equal(s.decision, 'granted');
  assert.equal(s.dismissCount, 0);
  assert.equal(s.lastDismissed, null);
  assert.equal(s.cycleStarted, '2026-01-01');
});

// 2. deny → denied state
test('next(null, deny) → decision denied, cycleStarted null', () => {
  const s = next(null, 'deny', '2026-01-01');
  assert.equal(s.decision, 'denied');
  assert.equal(s.cycleStarted, null);
});

// 3. defer from null → deferred, dismissCount=1, cycleStarted set to today
test('next(null, defer) → dismissCount 1, cycleStarted = today', () => {
  const s = next(null, 'defer', '2026-01-05');
  assert.equal(s.decision, 'deferred');
  assert.equal(s.dismissCount, 1);
  assert.equal(s.lastDismissed, '2026-01-05');
  assert.equal(s.cycleStarted, '2026-01-05');
});

// 4. defer increments dismissCount and preserves cycleStarted
test('next(deferred, defer) → dismissCount incremented, cycleStarted preserved', () => {
  const prev = {
    decision: 'deferred',
    dismissCount: 1,
    lastDismissed: '2026-01-05',
    cycleStarted: '2026-01-05',
  };
  const s = next(prev, 'defer', '2026-01-06');
  assert.equal(s.dismissCount, 2);
  assert.equal(s.cycleStarted, '2026-01-05'); // preserved
  assert.equal(s.lastDismissed, '2026-01-06');
});

// 5. toggleOn → same shape as accept
test('next(denied, toggleOn) → granted, counts zeroed', () => {
  const prev = { decision: 'denied', dismissCount: 0, lastDismissed: null, cycleStarted: null };
  const s = next(prev, 'toggleOn', '2026-02-01');
  assert.equal(s.decision, 'granted');
  assert.equal(s.dismissCount, 0);
  assert.equal(s.cycleStarted, '2026-02-01');
});

// 6. toggleOff → same shape as deny
test('next(granted, toggleOff) → denied, cycleStarted null', () => {
  const prev = {
    decision: 'granted',
    dismissCount: 0,
    lastDismissed: null,
    cycleStarted: '2026-01-01',
  };
  const s = next(prev, 'toggleOff', '2026-02-15');
  assert.equal(s.decision, 'denied');
  assert.equal(s.cycleStarted, null);
  assert.equal(s.dismissCount, 0);
});

// 7. shouldShow(null) → true (first visit)
test('shouldShow(null, today) → true (first visit)', () => {
  assert.equal(shouldShow(null, '2026-01-01'), true);
});

// 8. shouldShow(granted) → false
test('shouldShow(granted state) → false', () => {
  const s = {
    decision: 'granted',
    dismissCount: 0,
    lastDismissed: null,
    cycleStarted: '2026-01-01',
  };
  assert.equal(shouldShow(s, '2026-01-02'), false);
});

// 9. shouldShow(denied) → false
test('shouldShow(denied state) → false', () => {
  const s = { decision: 'denied', dismissCount: 0, lastDismissed: null, cycleStarted: null };
  assert.equal(shouldShow(s, '2026-01-02'), false);
});

// 10. shouldShow deferred same day → false (within cycle, not yet next day)
test('shouldShow(deferred, same day as lastDismissed) → false', () => {
  const s = {
    decision: 'deferred',
    dismissCount: 1,
    lastDismissed: '2026-01-05',
    cycleStarted: '2026-01-05',
  };
  assert.equal(shouldShow(s, '2026-01-05'), false);
});

// 11. shouldShow deferred next day → true (within active cycle)
test('shouldShow(deferred, next calendar day) → true', () => {
  const s = {
    decision: 'deferred',
    dismissCount: 1,
    lastDismissed: '2026-01-05',
    cycleStarted: '2026-01-05',
  };
  assert.equal(shouldShow(s, '2026-01-06'), true);
});

// 12. shouldShow deferred cycle exhausted, 29 days later → false (still in rest)
test('shouldShow(deferred, cycle exhausted, 29 days later) → false', () => {
  const s = {
    decision: 'deferred',
    dismissCount: 3,
    lastDismissed: '2026-01-01',
    cycleStarted: '2025-12-30',
  };
  assert.equal(shouldShow(s, '2026-01-30'), false); // 29 days, need 30
});

// 13. isEnabled: granted → true; denied/deferred/null → false
test('isEnabled: granted→true, denied→false, deferred→false, null→false', () => {
  assert.equal(
    isEnabled({ decision: 'granted', dismissCount: 0, lastDismissed: null, cycleStarted: null }),
    true
  );
  assert.equal(
    isEnabled({ decision: 'denied', dismissCount: 0, lastDismissed: null, cycleStarted: null }),
    false
  );
  assert.equal(
    isEnabled({
      decision: 'deferred',
      dismissCount: 1,
      lastDismissed: '2026-01-01',
      cycleStarted: '2026-01-01',
    }),
    false
  );
  assert.equal(isEnabled(null), false);
});

// ── Summary ───────────────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════════');
if (failed === 0) {
  console.log(`  ✅ ALL PASS: ${passed}/${passed + failed} scenarios passed\n`);
  process.exit(0);
} else {
  console.error(`  ❌ FAILED: ${failed}/${passed + failed} scenarios failed`);
  console.error(`  Failures: ${failures.join(', ')}\n`);
  process.exit(1);
}
