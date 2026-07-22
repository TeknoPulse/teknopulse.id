# Implementation Plan: Migrate to Warm & Bold Visual Identity

## Phase 1: Core Design Token Migration

- [x] Task: Update primary color scale in `tailwind.config.cjs`
  - [x] Replace `hsl(210, 95%, *)` primary scale with warm orange `hsl(24, 90%, *)`
  - [x] Update `primary-hover` to `hsl(24, 90%, 45%)`
  - [x] Update `primary-light` to `hsl(24, 90%, 95%)`
- [x] Task: Update secondary and accent color scales in `tailwind.config.cjs`
  - [x] Replace secondary `hsl(195, 80%, *)` with warm amber `hsl(38, 85%, *)`
  - [x] Replace accent `hsl(270, 80%, *)` with terracotta `hsl(12, 75%, *)`
- [x] Task: Update background and surface colors in `tailwind.config.cjs`
  - [x] Update `background` to warm off-white `hsl(30, 20%, 97%)`
  - [x] Update `background-dark` to warm gray `hsl(25, 15%, 10%)`
  - [x] Update `surface-dark` to warm charcoal `hsl(25, 12%, 14%)`
- [x] Task: Update text and gray colors in `tailwind.config.cjs`
  - [x] Update `text-primary` to `hsl(25, 10%, 15%)`
  - [x] Update `text-secondary` to `hsl(25, 8%, 40%)`
  - [x] Update `text-muted` to `hsl(25, 6%, 55%)`
  - [x] Update gray scale from blue-tinted `hsl(210, *)` to warm `hsl(25, *)`
- [x] Task: Update gradients and shadows in `tailwind.config.cjs`
  - [x] Update `gradient-primary` to warm orange → amber gradient
  - [x] Update `gradient-hero` to warm orange with transparency
  - [x] Update `gradient-accent` to terracotta → warm orange
  - [x] Update `glow` shadow from blue to warm orange
- [x] Task: Conductor - User Manual Verification 'Core Design Token Migration' (Protocol in workflow.md)

## Phase 2: Site Branding Updates

- [x] Task: Update site description in `src/config.ts`
  - [x] Change `description` to: "Review dan analisis teknologi untuk pengguna Indonesia."
- [x] Task: Scan and update hardcoded color references in `src/styles/`
  - [x] Search all CSS files for hardcoded blue HSL values (`hsl(210,`)
  - [x] Replace with corresponding warm palette values
  - [x] Verify no color references bypass Tailwind tokens
- [x] Task: Update OG image template colors in `src/pages/og/[slug].png.ts`
  - [x] Check for hardcoded color values in the Satori template
  - [x] Update to use warm brand palette colors
- [x] Task: Conductor - User Manual Verification 'Site Branding Updates' (Protocol in workflow.md)

## Phase 3: Verification & Polish

- [ ] Task: Run `pnpm build` and verify successful build
  - [ ] Confirm no TypeScript errors
  - [ ] Confirm all pages generate correctly
  - [ ] Confirm OG images generate with new colors
- [ ] Task: Run `pnpm lint` and fix any formatting issues
  - [ ] Run `pnpm lint:fix` to auto-fix Prettier issues
  - [ ] Verify no ESLint errors remain
- [ ] Task: Visual verification of light and dark mode
  - [ ] Check homepage in light mode
  - [ ] Check homepage in dark mode
  - [ ] Check article page in both modes
  - [ ] Check category listing pages in both modes
  - [ ] Verify category colors remain unchanged
- [ ] Task: Search for remaining blue color references
  - [ ] Grep codebase for `hsl(210,` excluding category colors
  - [ ] Grep for `hsl(195,` and `hsl(270,` in non-category files
  - [ ] Address any remaining hardcoded references
- [ ] Task: Conductor - User Manual Verification 'Verification & Polish' (Protocol in workflow.md)
