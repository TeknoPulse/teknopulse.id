# Implementation Plan: Migrate to Warm & Bold Visual Identity

## Phase 1: Core Design Token Migration

- [x] Task: Update primary color scale in `tailwind.config.cjs`
    - [x] Replace `hsl(210, 95%, *)` primary scale with warm orange `hsl(24, 90%, *)`
    - [x] Update `primary-hover` to `hsl(24, 90%, 45%)`
    - [x] Update `primary-light` to `hsl(24, 90%, 95%)`
- [x] Task: Update secondary and accent color scales in `tailwind.config.cjs`
    - [x] Replace secondary `hsl(195, 80%, *)` with warm amber `hsl(38, 85%, *)`
    - [x] Replace accent `hsl(270, 80%, *)` with terracotta `hsl(12, 75%, *)`
- [ ] Task: Update background and surface colors in `tailwind.config.cjs`
    - [ ] Update `background` to warm off-white `hsl(30, 20%, 97%)`
    - [ ] Update `background-dark` to warm gray `hsl(25, 15%, 10%)`
    - [ ] Update `surface-dark` to warm charcoal `hsl(25, 12%, 14%)`
- [ ] Task: Update text and gray colors in `tailwind.config.cjs`
    - [ ] Update `text-primary` to `hsl(25, 10%, 15%)`
    - [ ] Update `text-secondary` to `hsl(25, 8%, 40%)`
    - [ ] Update `text-muted` to `hsl(25, 6%, 55%)`
    - [ ] Update gray scale from blue-tinted `hsl(210, *)` to warm `hsl(25, *)`
- [ ] Task: Update gradients and shadows in `tailwind.config.cjs`
    - [ ] Update `gradient-primary` to warm orange → amber gradient
    - [ ] Update `gradient-hero` to warm orange with transparency
    - [ ] Update `gradient-accent` to terracotta → warm orange
    - [ ] Update `glow` shadow from blue to warm orange
- [ ] Task: Conductor - User Manual Verification 'Core Design Token Migration' (Protocol in workflow.md)

## Phase 2: Site Branding Updates

- [ ] Task: Update site description in `src/config.ts`
    - [ ] Change `description` to: "Review dan analisis teknologi untuk pengguna Indonesia."
- [ ] Task: Scan and update hardcoded color references in `src/styles/`
    - [ ] Search all CSS files for hardcoded blue HSL values (`hsl(210,`)
    - [ ] Replace with corresponding warm palette values
    - [ ] Verify no color references bypass Tailwind tokens
- [ ] Task: Update OG image template colors in `src/pages/og/[slug].png.ts`
    - [ ] Check for hardcoded color values in the Satori template
    - [ ] Update to use warm brand palette colors
- [ ] Task: Conductor - User Manual Verification 'Site Branding Updates' (Protocol in workflow.md)

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
