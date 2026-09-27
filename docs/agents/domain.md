# Domain Docs: Single-Context

This is a **single-context** repository — one `CONTEXT.md` and `docs/adr/` at the repo root.

## Files

| File              | Purpose                                          |
| ----------------- | ------------------------------------------------ |
| `CONTEXT.md`      | Domain model: terms, rules, and architecture     |
| `docs/adr/`       | Architecture Decision Records (ADRs)             |
| `AGENTS.md`       | Workspace instructions for ZCode agents          |
| `README.md`       | Feature list, content workflow, post frontmatter |

## How to Use

- **New agent sessions** start with `AGENTS.md` loaded as workspace instructions
- **Read `CONTEXT.md`** before making domain-level changes (terminology, rules, architecture)
- **Check `docs/adr/`** for past architecture decisions before proposing changes
- **Add new ADRs** to `docs/adr/` for significant architectural choices
