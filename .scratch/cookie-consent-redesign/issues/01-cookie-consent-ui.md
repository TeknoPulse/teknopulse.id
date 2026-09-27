# 01: Update CookieConsent banner UI to soft consent pattern

**What to build:** Replace the current two-button cookie consent banner ("Setuju" / "Tolak") with a soft consent pattern. Remove the "Tolak" button. Add a small [×] close button at the top-right of the banner card (keyboard-accessible, `aria-label="Tutup banner"`). Keep a single primary "Setuju" button with its existing styling. Update banner copy to an informational tone — "Kami memakai Google Analytics untuk memahami konten yang berguna. Anda dapat mengubah preferensi ini kapan saja di Kebijakan Privasi." — shorter, less legalistic, linking to `/privacy-policy`. The [×] button should be visually de-emphasized (small, gray) relative to "Setuju". This ticket is UI-only; buttons do not need to be wired up. The component must render correctly in light and dark mode.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] "Tolak" button is removed
- [ ] [×] close button is present at top-right of banner card, with `aria-label` and keyboard focus
- [ ] Single "Setuju" button remains as the primary action
- [ ] Banner copy matches the informational tone described above
- [ ] Privacy policy link in copy points to `/privacy-policy`
- [ ] Layout renders correctly in both light and dark mode
- [ ] `pnpm lint` passes
