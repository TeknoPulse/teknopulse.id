# TypeScript Style Guide: TeknoPulse

## Configuration
- Extends `astro/tsconfigs/strict` — treat strict errors as real
- `@typescript-eslint/no-explicit-any` is `warn` (allowed but discouraged)
- Unused vars/args must be prefixed with `_` (ESLint rule)

## Naming Conventions

| Construct | Convention | Example |
|-----------|-----------|---------|
| Variables / functions | camelCase | `getPostsByTag`, `formatDate` |
| Constants | UPPER_SNAKE_CASE | `MAX_POSTS_PER_PAGE`, `DEFAULT_LOCALE` |
| Types / Interfaces | PascalCase | `Category`, `PostFrontmatter` |
| Enums | PascalCase (members: PascalCase) | `PostFormat.Berita` |
| Files (utilities) | camelCase | `readingTime.ts`, `categories.ts` |
| Files (components) | PascalCase | `PostCard.astro`, `Header.astro` |

## Type Practices

- **Prefer interfaces** for object shapes that may be extended
- **Use type aliases** for unions, intersections, and utility types
- **Avoid `any`** — use `unknown` when the type is truly unknown, then narrow
- **Use Zod schemas** for runtime validation (content collections, API responses)
- **Export types** from their source module; avoid re-export barrels unless necessary

## Import Organization

```typescript
// 1. Framework / library imports
import { defineCollection, z } from 'astro:content';

// 2. Internal utilities
import { getCategoryByName } from '../utils/categories';

// 3. Types (type-only imports)
import type { Category } from '../utils/categories';
```

## Function Patterns

- **Prefer named exports** over default exports
- **Use explicit return types** on exported functions
- **Keep functions pure** where possible — no side effects
- **Use optional chaining** (`?.`) and nullish coalescing (`??`) over manual checks

## Error Handling

- Use early returns for guard clauses
- Prefer returning `undefined` over throwing for "not found" scenarios
- Reserve `throw` for truly exceptional/unrecoverable cases

## Formatting (Prettier)

- Single quotes
- Semicolons
- 2-space indent
- `printWidth: 100`
- ES5 trailing commas
- Run `pnpm lint:fix` before committing
