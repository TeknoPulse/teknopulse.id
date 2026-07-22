# Specification: Migrate to Warm & Bold Visual Identity and Update Site Branding

## Overview

Migrate TeknoPulse's visual identity from the current Tech Blue palette to a **Warm & Bold** editorial palette, and update site branding (tagline, description) to reflect the platform's evolved focus on tool reviews, comparisons, and opinionated analysis.

## Background

TeknoPulse was originally conceived as a daily tech news site ("Berita harian teknologi dan AI: cepat, ringkas, kontekstual"). The product vision has evolved to emphasize **tool reviews and comparisons** with **strong editorial perspective**. The visual identity and branding should reflect this shift.

### Current State

- **Color palette:** Tech Blue (`hsl(210, 95%, *)`) with cyan secondary and purple accent
- **Tagline:** "Berita harian teknologi dan AI: cepat, ringkas, kontekstual."
- **Dark mode:** Supported via Tailwind `class` strategy with blue-tinted dark backgrounds

### Target State

- **Color palette:** Warm & Bold editorial palette (warm orange primary, amber secondary, terracotta accent)
- **Tagline:** "Review dan analisis teknologi untuk pengguna Indonesia."
- **Dark mode:** Warm charcoal/gray dark backgrounds instead of blue-tinted

## Scope

### In Scope

1. **Tailwind config color update** — Replace primary/secondary/accent/background/surface/text color scales in `tailwind.config.cjs`
2. **Site config branding** — Update `description` in `src/config.ts` to reflect new tagline
3. **Dark mode tokens** — Update dark mode background and surface colors to warm tones
4. **Gradient updates** — Update `backgroundImage` gradients to use new warm palette
5. **Shadow/glow updates** — Update glow shadow color from blue to warm orange
6. **OG image styling** — Update OG image template colors in `src/pages/og/[slug].png.ts` if they reference hardcoded colors
7. **Global styles** — Update any hardcoded color references in `src/styles/`

### Out of Scope

- Category colors (remain as-is per `src/utils/categories.ts`)
- Tag-based taxonomy migration (separate track)
- Content changes
- Component structural changes
- New feature development

## Acceptance Criteria

1. `pnpm build` succeeds with no errors
2. `pnpm lint` passes with no new warnings
3. All pages render correctly in both light and dark mode with the new palette
4. No hardcoded blue color references remain (except in category colors which are intentionally kept)
5. OG images use the updated brand colors
6. Site description/tagline reflects the new positioning

## Technical Constraints

- **Static output is mandatory** — no SSR changes
- **Category colors are preserved** — they have their own independent color system in `src/utils/categories.ts`
- Color token names in Tailwind config must remain the same (e.g., `primary`, `secondary`) to avoid breaking existing utility class usage across components
