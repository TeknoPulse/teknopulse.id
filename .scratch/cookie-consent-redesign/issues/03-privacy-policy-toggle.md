# 03: Add GA4 analytics toggle to privacy policy page

**What to build:** Add a GA4 toggle at the top of the `/privacy-policy` page so users can change their analytics consent state at any time without waiting for the banner. This is the only path to a permanent `denied` state now that the "Tolak" button has been removed from the banner.

The toggle settings card should appear above the main page heading. It should reflect the current analytics consent state (ON if `granted`, OFF if `denied` or `deferred`). Switching ON stores `{ decision: "granted" }` and loads the GA4 script immediately without a page reload. Switching OFF stores `{ decision: "denied" }` and prompts the user to reload for full cleanup (GA4 cookies cannot be deleted client-side without a reload). The toggle uses `role="switch"` and `aria-checked` for accessibility.

**Blocked by:** 02 (Deferred consent localStorage schema and cycle logic)

**Status:** ready-for-agent

- [ ] Settings card is visible at the top of `/privacy-policy` before the main heading
- [ ] Toggle shows ON when `decision === "granted"`, OFF for any other state
- [ ] Switching ON stores `granted`, loads GA4 script without page reload
- [ ] Switching OFF stores `denied`, shows reload prompt
- [ ] After page reload, toggle reflects the updated state
- [ ] Toggle uses `role="switch"` and correct `aria-checked` value
- [ ] Keyboard-operable (Tab to focus, Space/Enter to toggle)
- [ ] `pnpm build` and `pnpm lint` pass
