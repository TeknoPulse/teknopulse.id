# Issue Tracker: GitHub

This repository uses **GitHub Issues** for tracking work.

## Workflow

- Create issues via GitHub's web interface or `gh issue create`
- Link PRs to issues using `Fixes #123` or `Closes #123` in the description
- Use conventional commit prefixes in PR titles (`feat:`, `fix:`, etc.`)

## CLI Tool

The `gh` CLI is used for GitHub operations:

```bash
# Create an issue
gh issue create --title "Issue title" --body "Description"

# List issues
gh issue list

# View issue details
gh issue view <number>

# Create a PR
gh pr create --title "PR title" --body "Description"
```
