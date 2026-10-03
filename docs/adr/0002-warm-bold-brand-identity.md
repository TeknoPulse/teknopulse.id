# ADR 0002: Warm & Bold Brand Identity

**Status:** Accepted (implemented 2026-07-23; recorded retroactively on 2026-10-02)  
**Date:** 2026-07-23  
**Deciders:** TeknoPulse Team  
**Context:** Site repositioning from daily news feed to opinionated tool reviews & analysis

> Distilled from the original track artifacts (`spec.md` + `plan.md` of the
> `warm_bold_branding_20260723` track, preserved in git history under
> `conductor/archive/` — that workspace has since been removed).

## Context

TeknoPulse was originally conceived as a daily tech news site — "Berita harian teknologi dan AI: cepat, ringkas, kontekstual" — and its first visual identity reflected that: a **Tech Blue** palette (`hsl(210, 95%, *)` primary, cyan secondary, purple accent) with blue-tinted dark mode.

The product vision has since evolved (see [product.md](../product.md)) to emphasize **tool reviews and comparisons** with **strong editorial perspective**. A generic tech-blue palette did not differentiate the brand or signal the shift from aggregator to opinionated publication.

## Decision

Migrate the visual identity to a **Warm & Bold editorial palette** and update site branding:

| Token             | Old (Tech Blue)           | New (Warm & Bold)                  |
| ----------------- | ------------------------- | ---------------------------------- |
| `primary`         | `hsl(210, 95%, *)`        | Warm orange `hsl(24, 90%, *)`      |
| `primary-hover`   | darker blue               | `hsl(24, 90%, 45%)`                |
| `secondary`       | cyan `hsl(195, 80%, *)`   | Warm amber `hsl(38, 85%, *)`       |
| `accent`          | purple `hsl(270, 80%, *)` | Terracotta `hsl(12, 75%, *)`       |
| `background`      | cool off-white            | Warm off-white `hsl(30, 20%, 97%)` |
| `background-dark` | blue-tinted dark          | Warm gray `hsl(25, 15%, 10%)`      |
| `surface-dark`    | blue-tinted               | Warm charcoal `hsl(25, 12%, 14%)`  |
| gray/text scales  | blue-tinted `hsl(210, *)` | Warm `hsl(25, *)`                  |
| gradients         | blue/cyan/purple          | warm orange ↔ amber ↔ terracotta |
| `glow` shadow     | blue                      | warm orange `hsl(24, 90%, 55%)`    |

- **Tagline** changed to: "Review dan analisis teknologi untuk pengguna Indonesia."
- **Category colors excluded** — they have their own independent system in `src/utils/categories.ts` and were intentionally preserved.
- **Tailwind token names preserved** (`primary`, `secondary`, `accent`, …) so existing utility classes across components kept working without a rename migration.

## Rationale

- **Brand–positioning fit**: warm hues read as editorial/opinionated; tech blue is the default visual language of every aggregator and developer tool — the opposite of a differentiated stance.
- **Dark mode cohesion**: warm charcoal backgrounds avoid the blue-cast that made the old dark mode feel like a different brand.
- **Low-risk migration surface**: keeping token names stable confined the change to `tailwind.config.cjs` values, `src/config.ts` description, OG image template colors, and stray hardcoded blues in `src/styles/`.

## Consequences

### Positive

- Distinctive identity aligned with the editorial voice
- Single consistent warm token system across light/dark mode, gradients, and shadows
- Migration completed in full on 2026-07-23 (verified: no stray `hsl(210,`/`hsl(195,`/`hsl(270,` references outside category colors)

### Negative

- **Historical posts' screenshots** (if any) show the old identity
- `secondary`/`accent` hues are close in temperature; designs must keep enough contrast between amber badges and terracotta callouts

## Alternatives Considered

- **Keep Tech Blue** — rejected: invisible in the market and contradicted the repositioning toward opinionated analysis
- **Partial rebrand (new tagline only)** — rejected: the palette was the primary carrier of brand perception; a tagline change alone would be incoherent

## References

- Live palette: `tailwind.config.cjs`
- Branding usage rules: [docs/product-guidelines.md](../product-guidelines.md), [docs/styleguide/css-tailwind.md](../styleguide/css-tailwind.md)
- Site config: `src/config.ts` (tagline/description), `src/pages/og/[slug].png.ts` (OG card colors)
