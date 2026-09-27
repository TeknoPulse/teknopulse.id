# Implementation Plan: Cookie Consent Redesign

**Goal:** Implement soft consent banner with daily re-prompt cycles as documented in ADR 0001.

**Files to modify:**
1. `src/components/CookieConsent.astro` — Banner UI and client-side logic
2. `src/pages/privacy-policy.astro` — Add GA4 toggle at top of page
3. `src/styles/global.css` (if needed) — Styling for privacy policy toggle

**Verification:**
- `pnpm build` must succeed
- `pnpm lint` must pass
- Manual testing: banner behavior across multiple sessions

---

## Task 1: Update CookieConsent.astro UI

**Changes:**

### Remove "Tolak" button
- Delete `<button id="consent-decline">` element
- Keep only `<button id="consent-accept">` (change text from "Setuju" to "Setuju")

### Add [×] close button
- Add `<button id="consent-close">` at top-right of banner container
- Styling: small (20×20px), gray color, `hover:bg-gray-100`
- Accessible: `aria-label="Tutup banner"`, `type="button"`

### Update banner copy
- Change from: "Kami memakai cookie analitik dari Google Analytics untuk memahami konten yang paling berguna. Fitur ini hanya diaktifkan setelah Anda memberikan persetujuan."
- Change to: "Kami memakai Google Analytics untuk memahami konten yang berguna. Anda dapat mengubah preferensi ini kapan saja di [Kebijakan Privasi](/privacy-policy)."
- Shorter, less legalistic, points to settings page

### Visual hierarchy
- "Setuju" button: keep current styling (primary color, prominent)
- [×] close: de-emphasized (smaller, gray, top-right corner of banner card)

**Pseudo-code UI structure:**

```astro
<div id="cookie-consent" class="...banner wrapper...">
  <div class="...banner card...">
    <!-- Close button top-right -->
    <button id="consent-close" class="absolute top-2 right-2 ...">
      <svg><!-- × icon --></svg>
      <span class="sr-only">Tutup banner</span>
    </button>
    
    <!-- Text + link -->
    <p class="...">
      Kami memakai Google Analytics untuk memahami konten yang berguna. 
      Anda dapat mengubah preferensi ini kapan saja di 
      <a href="/privacy-policy">Kebijakan Privasi</a>.
    </p>
    
    <!-- Single action button -->
    <button id="consent-accept" class="...">Setuju</button>
  </div>
</div>
```

---

## Task 2: Update CookieConsent.astro Logic

**localStorage schema change:**

From (current):
```javascript
localStorage.setItem(KEY, "granted" | "denied")
```

To (new):
```javascript
localStorage.setItem(KEY, JSON.stringify({
  decision: "granted" | "denied" | "deferred",
  dismissCount: 0,        // 0-3
  lastDismissed: null,    // "YYYY-MM-DD" or null
  cycleStarted: null      // "YYYY-MM-DD" or null
}))
```

**New functions:**

### `getTodayDateString()`
```javascript
const getTodayDateString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0]; // "YYYY-MM-DD"
};
```

### `shouldShowBanner(stored)`
```javascript
const shouldShowBanner = (stored) => {
  if (!stored || stored.decision === 'deferred') {
    if (!stored || stored.dismissCount === 0) return true; // first visit or reset
    
    const today = getTodayDateString();
    const daysSinceLastDismiss = daysBetween(stored.lastDismissed, today);
    
    // Within 3-day cycle
    if (stored.dismissCount < 3) {
      return daysSinceLastDismiss >= 1; // show next day
    }
    
    // After 3 dismissals, wait 30 days
    if (stored.dismissCount === 3) {
      return daysSinceLastDismiss >= 30; // reset cycle after 30 days
    }
  }
  return false; // granted or denied
};

const daysBetween = (date1Str, date2Str) => {
  const d1 = new Date(date1Str);
  const d2 = new Date(date2Str);
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
};
```

### Event handlers

**Accept button:**
```javascript
document.getElementById('consent-accept')?.addEventListener('click', () => {
  localStorage.setItem(KEY, JSON.stringify({ decision: 'granted' }));
  banner.hidden = true;
  loadGa4();
});
```

**Close button (new):**
```javascript
document.getElementById('consent-close')?.addEventListener('click', () => {
  const stored = getStored(); // parse JSON from localStorage
  const today = getTodayDateString();
  
  let newCount = (stored?.dismissCount || 0) + 1;
  let newCycleStart = stored?.cycleStarted || today;
  
  // Reset cycle after 30 days
  if (stored?.dismissCount === 3 && daysBetween(stored.lastDismissed, today) >= 30) {
    newCount = 1;
    newCycleStart = today;
  }
  
  localStorage.setItem(KEY, JSON.stringify({
    decision: 'deferred',
    dismissCount: newCount,
    lastDismissed: today,
    cycleStarted: newCycleStart
  }));
  
  banner.hidden = true;
});
```

**Remove old decline handler:**
```javascript
// DELETE THIS:
document.getElementById('consent-decline')?.addEventListener('click', () => decide('denied'));
```

### Main logic on page load

```javascript
(() => {
  const KEY = 'teknopulse-consent-ga4';
  const banner = document.getElementById('cookie-consent');
  if (!banner) return;

  const getStored = () => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const stored = getStored();

  // If granted, load GA4 immediately
  if (stored?.decision === 'granted') {
    loadGa4();
    return; // never show banner
  }

  // If denied, never show banner
  if (stored?.decision === 'denied') {
    return;
  }

  // If deferred or first visit, check if we should show
  if (shouldShowBanner(stored)) {
    banner.hidden = false;
  }

  // Attach event handlers (defined above)
  // ...
})();
```

---

## Task 3: Create Privacy Policy Toggle

**File:** `src/pages/privacy-policy.astro`

**Location:** Add at the top of the page content, before the main heading.

**UI:**

```astro
<div class="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
  <div class="flex items-center justify-between">
    <div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Pengaturan Google Analytics
      </h3>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Aktifkan atau nonaktifkan pelacakan analitik untuk situs ini.
      </p>
    </div>
    <button
      id="ga4-toggle"
      type="button"
      role="switch"
      aria-checked="false"
      class="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-gray-600"
    >
      <span class="sr-only">Toggle Google Analytics</span>
      <span
        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
        style="transform: translateX(0.25rem);"
      ></span>
    </button>
  </div>
  <p id="ga4-status" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
    Status: <span id="ga4-status-text">Nonaktif</span>
  </p>
</div>
```

**Client-side script:**

```astro
<script is:inline>
(() => {
  const KEY = 'teknopulse-consent-ga4';
  const toggle = document.getElementById('ga4-toggle');
  const statusText = document.getElementById('ga4-status-text');
  const toggleThumb = toggle?.querySelector('span:last-child');
  
  const getStored = () => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };
  
  const updateUI = (isEnabled) => {
    if (isEnabled) {
      toggle.classList.add('bg-primary');
      toggle.classList.remove('bg-gray-300', 'dark:bg-gray-600');
      toggleThumb.style.transform = 'translateX(1.25rem)';
      toggle.setAttribute('aria-checked', 'true');
      statusText.textContent = 'Aktif';
    } else {
      toggle.classList.remove('bg-primary');
      toggle.classList.add('bg-gray-300', 'dark:bg-gray-600');
      toggleThumb.style.transform = 'translateX(0.25rem)';
      toggle.setAttribute('aria-checked', 'false');
      statusText.textContent = 'Nonaktif';
    }
  };
  
  // Initialize toggle state from localStorage
  const stored = getStored();
  const isEnabled = stored?.decision === 'granted';
  updateUI(isEnabled);
  
  // Toggle handler
  toggle?.addEventListener('click', () => {
    const currentlyEnabled = toggle.getAttribute('aria-checked') === 'true';
    const newState = !currentlyEnabled;
    
    if (newState) {
      // Enable GA4
      localStorage.setItem(KEY, JSON.stringify({ decision: 'granted' }));
      updateUI(true);
      
      // Load GA4 script if not already loaded
      if (!document.querySelector('script[data-ga4]')) {
        const ga4Id = 'G-79X7QWV977';
        window.dataLayer = window.dataLayer || [];
        window.gtag = (...args) => { window.dataLayer.push(args); };
        window.gtag('js', new Date());
        window.gtag('config', ga4Id);
        const s = document.createElement('script');
        s.async = true;
        s.dataset.ga4 = ga4Id;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
        document.head.appendChild(s);
      }
    } else {
      // Disable GA4
      localStorage.setItem(KEY, JSON.stringify({ decision: 'denied' }));
      updateUI(false);
      
      // Remove GA4 script and cookies (requires page reload for full cleanup)
      // Note: This doesn't immediately stop tracking; user should reload
      alert('GA4 telah dinonaktifkan. Muat ulang halaman untuk menerapkan perubahan sepenuhnya.');
    }
  });
})();
</script>
```

---

## Task 4: Testing Checklist

### Manual Tests

1. **First visit (no localStorage):**
   - [ ] Banner shows immediately
   - [ ] Clicking "Setuju" → banner hides, GA4 loads, localStorage = `{ decision: "granted" }`
   - [ ] Reload page → banner does NOT show, GA4 loads

2. **First visit → close banner:**
   - [ ] Clicking [×] → banner hides, localStorage = `{ decision: "deferred", dismissCount: 1, lastDismissed: "YYYY-MM-DD", cycleStarted: "YYYY-MM-DD" }`
   - [ ] Same day reload → banner does NOT show
   - [ ] Change system date to next day, reload → banner shows again
   - [ ] Close [×] again → `dismissCount: 2`
   - [ ] Repeat for 3rd day → `dismissCount: 3`
   - [ ] 4th day reload → banner does NOT show (within 30-day wait)

3. **After 3 dismissals + 30 days:**
   - [ ] Change system date to 30 days later, reload → banner shows again
   - [ ] localStorage reset: `dismissCount: 1` (new cycle)

4. **Privacy policy toggle:**
   - [ ] Visit `/privacy-policy` → toggle shows OFF (if deferred or denied)
   - [ ] Click toggle ON → localStorage = `{ decision: "granted" }`, GA4 loads
   - [ ] Reload page → toggle shows ON
   - [ ] Click toggle OFF → localStorage = `{ decision: "denied" }`, alert shown
   - [ ] Reload page → toggle shows OFF, GA4 does NOT load

5. **Granted → back to deferred:**
   - [ ] With `decision: "granted"`, clear localStorage manually
   - [ ] Reload → banner shows (first visit state)

### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest, macOS/iOS)
- [ ] Dark mode toggle works with banner and privacy toggle

### Accessibility
- [ ] Banner has `role="region"` and `aria-label`
- [ ] [×] close button has `aria-label` and keyboard focus
- [ ] Privacy policy toggle has `role="switch"` and `aria-checked`
- [ ] All interactive elements are keyboard-navigable (Tab, Enter/Space)

### Build & Lint
- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] No console errors in browser devtools

---

## Task 5: Documentation Updates

- [×] ADR 0001 created
- [×] CONTEXT.md updated with "Analytics Consent State" glossary entry
- [ ] Update `README.md` if cookie consent workflow is mentioned (check and update if needed)
- [ ] Add comment in `src/components/Analytics.astro` referencing ADR 0001 for context

---

## Rollback Plan

If issues arise post-deployment:

1. **Revert CookieConsent.astro** to previous version (two-button: "Setuju" / "Tolak")
2. **Remove privacy policy toggle** (or disable it with `display: none`)
3. **localStorage migration:** Old format (`"granted"` / `"denied"` string) is incompatible with new format (JSON object). If reverting, add migration script:

```javascript
const old = localStorage.getItem(KEY);
if (old === 'granted' || old === 'denied') {
  localStorage.setItem(KEY, JSON.stringify({ decision: old }));
}
```

---

## Success Metrics (Post-Launch)

Track via Cloudflare Web Analytics (cookieless):

- **Banner impression rate:** % of visits where banner was shown
- **Opt-in rate:** % of banner impressions → "Setuju" clicked
- **Dismissal rate:** % of banner impressions → [×] clicked
- **Toggle usage:** Track page views to `/privacy-policy` (proxy for toggle visibility)

**Target after 3 months:**
- Opt-in rate ≥ 40% (vs. ~20% typical for hard consent)
- Dismissal rate < 50% (if higher, banner copy may be too pushy)
- No user complaints or regulatory inquiries

If targets not met, iterate on:
- Banner copy (too long? not compelling?)
- Visual design (is [×] too prominent? "Setuju" not prominent enough?)
- Cycle frequency (30 days too long/short?)
