# 04: End-to-end verification and accessibility audit

**What to build:** End-to-end verification of the full cookie consent redesign across all user scenarios, with accessibility audit and documentation cleanup.

Scenarios to verify manually:
1. First visit (no localStorage) → banner shows → "Setuju" → GA4 loads, banner gone permanently
2. First visit → [×] dismiss → same day reload → banner hidden → next day → banner shows again
3. Three consecutive daily dismissals → 30-day wait → new cycle begins
4. Visit `/privacy-policy` → toggle shows OFF (deferred state) → switch ON → GA4 loads without reload
5. Toggle ON → switch OFF → reload → GA4 does not load, banner does not show (denied state)
6. Legacy localStorage format (bare string `"granted"`) → migrated cleanly on first load

Documentation updates:
- Add a comment in `src/components/Analytics.astro` referencing ADR 0001 explaining why GA4 loads via `CookieConsent.astro` and not here
- Check `README.md` for any stale cookie consent references and update if needed

**Blocked by:** 03 (GA4 toggle on privacy policy page)

**Status:** ready-for-agent

- [ ] All 6 manual scenarios above pass in Chrome, Firefox, and Safari
- [ ] All interactive elements (banner close, Setuju button, toggle) are keyboard-navigable
- [ ] No console errors in browser devtools across all scenarios
- [ ] `pnpm build` and `pnpm lint` pass clean
- [ ] `Analytics.astro` has a comment referencing ADR 0001
- [ ] `README.md` cookie consent references (if any) are accurate
