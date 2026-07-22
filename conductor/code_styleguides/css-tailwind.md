# CSS & Tailwind Style Guide: TeknoPulse

## Configuration

- **Tailwind v3** with `@tailwindcss/typography` plugin
- **Dark mode:** `class` strategy (toggled via class on `<html>`)
- **Content paths:** `./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}`
- **Class sorting:** Enforced by `prettier-plugin-tailwindcss`

## Design Tokens

### Colors
Brand palette and dark-mode tokens are defined in `tailwind.config.cjs`:
- **Primary:** Tech Blue HSL scale (`hsl(210, 95%, *)`)
- **Secondary:** Cyan blue accent (`hsl(195, 80%, *)`)
- **Accent:** Purple (`hsl(270, 80%, *)`)
- **Category colors:** Defined in `src/utils/categories.ts` (HSL values)

> **Guideline:** Prefer existing tokens over one-off colors. If a new color is needed, add it to `tailwind.config.cjs` first.

### Gradients
Pre-defined in config:
- `bg-gradient-primary` — Blue to cyan (135deg)
- `bg-gradient-hero` — Subtle blue with transparency
- `bg-gradient-accent` — Purple to blue

## Usage Rules

### Prefer Utility Classes
```astro
<!-- ✅ Good: Tailwind utilities -->
<div class="rounded-lg bg-surface p-4 shadow-md dark:bg-surface-dark">

<!-- ❌ Bad: Custom CSS for what Tailwind handles -->
<div style="border-radius: 1rem; padding: 1rem;">
```

### Component-Specific Styles
When Tailwind utilities become unwieldy (5+ classes for the same element across breakpoints), extract to a CSS class in `src/styles/`:
```css
.post-card {
  @apply rounded-lg bg-surface p-4 shadow-md transition-shadow hover:shadow-lg dark:bg-surface-dark;
}
```

### Responsive Design
- Mobile-first: start with no prefix, add `sm:`, `md:`, `lg:`, `xl:` for larger screens
- Use container queries where appropriate for component-level responsiveness

### Dark Mode
```astro
<div class="bg-background text-text-primary dark:bg-background-dark dark:text-gray-100">
```
- Every color must have a dark-mode counterpart
- Test both modes during development

## Typography (Prose)

- Use `prose` class from `@tailwindcss/typography` for Markdown-rendered content
- Customize prose styles in `tailwind.config.cjs` if needed
- Article body max-width: `max-w-prose` (~65ch)

## Animation Guidelines

- Use Tailwind's `transition-*` utilities for simple state changes
- `duration-200` or `duration-300` for UI interactions
- `transform` and `opacity` only — no layout-triggering properties
- Always include `motion-reduce:transition-none` for accessibility

## Category Colors

Category colors are managed in `src/utils/categories.ts`, not in Tailwind config. Use the utility functions:
```typescript
import { getCategoryByName } from '../utils/categories';
const cat = getCategoryByName('AI');
// Use cat.color, cat.bgColor, cat.hoverColor as inline styles
```

Do NOT hardcode category HSL values in components — always reference the categories utility.
