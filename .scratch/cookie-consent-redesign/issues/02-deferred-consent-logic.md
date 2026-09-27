# 02: Implement deferred consent localStorage schema and cycle logic

**What to build:** Wire up the banner buttons and implement the cyclical re-prompt logic. Analytics consent state (from CONTEXT.md) is now one of `granted`, `denied`, or `deferred`, stored as a JSON object in `localStorage` under `teknopulse-consent-ga4`:

```json
{
  "decision": "granted" | "denied" | "deferred",
  "dismissCount": 0,
  "lastDismissed": "YYYY-MM-DD",
  "cycleStarted": "YYYY-MM-DD"
}
```

Cycle rules:
- "Setuju" click → `decision: granted`, GA4 loads immediately, banner never shows again
- [×] click → `decision: deferred`, `dismissCount` increments, `lastDismissed` = today
- Banner shows once per calendar day while `dismissCount < 3`
- After 3 dismissals, banner is hidden for 30 days, then cycle resets
- Cycle repeats indefinitely until user clicks "Setuju"
- Date comparison uses ISO date strings ("YYYY-MM-DD") — no time math, no timezone handling
- Migrate old bare-string localStorage values (`"granted"` / `"denied"`) to new JSON schema on first read

**Blocked by:** 01 (CookieConsent banner UI update)

**Status:** ready-for-agent

- [ ] "Setuju" click stores `{ decision: "granted" }`, loads GA4 immediately, banner never reappears
- [ ] [×] click stores deferred state with correct `dismissCount` and `lastDismissed`
- [ ] Banner does not show again on the same calendar day after a dismissal
- [ ] Banner shows on the next calendar day if `dismissCount < 3`
- [ ] After 3 dismissals, banner is hidden for 30 days
- [ ] After 30 days, cycle resets and banner shows again
- [ ] Old bare-string localStorage values are migrated to JSON schema without errors
- [ ] `pnpm build` and `pnpm lint` pass
