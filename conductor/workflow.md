# Conductor Workflow: TeknoPulse

## Development Methodology

### Test-Driven Development (TDD)
All feature development follows TDD principles:
1. **Write Tests First** — Define expected behavior before implementation
2. **Implement Feature** — Write the minimum code to pass tests
3. **Refactor** — Clean up while keeping tests green

> **Note:** TeknoPulse currently has no test framework configured. When tests are added, `pnpm build` (which runs `astro build`) serves as the canonical correctness gate. Type errors surface via the build process.

### Build Verification
- **Canonical gate:** `pnpm build` must succeed before any task is considered complete
- **Lint check:** `pnpm lint` must pass (ESLint + Prettier)
- **Fix lint:** `pnpm lint:fix` to auto-fix issues before committing

## Code Coverage

- **Target:** >80% test coverage for all new code
- **Measurement:** When a test framework is added, coverage reports should be integrated into the CI pipeline
- **Current state:** No test framework — `pnpm build` is the primary validation

## Commit Strategy

### Per-Task Commits
- Commit after **every completed task** in a plan
- Each commit should be atomic and self-contained
- Use conventional commit format: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`

### Commit Message Format
```
<type>(<scope>): <description>

[optional body with context]
```

Example:
```
feat(search): add Pagefind integration for client-side search

Integrates Pagefind as a postbuild step. The search index is generated
into dist/pagefind/ after astro build completes.
```

### Branch Strategy
- Default branch: `main`
- Feature work: branch before committing (`feature/<name>`, `fix/<name>`)

## Task Summary Storage

- Task summaries are stored in **commit messages** (body section)
- Each task commit includes a brief summary of what was accomplished and any decisions made

## Phase Completion Verification and Checkpointing Protocol

At the end of each **Phase** in a plan, the following verification steps MUST be performed:

1. **Build Verification:** Run `pnpm build` and confirm it succeeds
2. **Lint Verification:** Run `pnpm lint` and confirm no errors
3. **Manual Review:** The user reviews the changes and confirms the phase is complete
4. **Checkpoint Commit:** Create a checkpoint commit with message: `chore(conductor): complete phase '<Phase Name>'`

This protocol ensures that each phase produces a stable, buildable state before proceeding.

## File Resolution Protocol

### Tracks Directory
All track artifacts are stored under `conductor/tracks/`. Each track has its own subdirectory:
```
conductor/tracks/<track_id>/
├── spec.md         # Track specification
├── plan.md         # Implementation plan with tasks
├── metadata.json   # Track metadata (status, timestamps)
└── index.md        # Context links
```
