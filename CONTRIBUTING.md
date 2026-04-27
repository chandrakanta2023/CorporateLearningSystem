# Contributing Guide

## Commit Message Guidelines

Use clear, scoped commit messages so changes are easy to review and revert.

### Format

`<type>(<scope>): <summary>`

Examples:
- `feat(frontend): add dashboard status cards`
- `fix(backend): handle missing DB_PORT env var`
- `docs(api): update health endpoint contract`

### Allowed Types

- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation only
- `refactor`: code change with no behavior change
- `test`: add or update tests
- `chore`: tooling, config, or maintenance

### Rules

- Keep summary under 72 characters.
- Use imperative mood ("add", "fix", "update").
- One logical change per commit.
- Do not include secrets, credentials, or .env files.
- Reference ticket IDs when available, e.g. `feat(auth): add login endpoint [CLS-42]`.

## Pull Request Checklist

- Confirm local build passes for backend and frontend.
- Update docs for behavior or API changes.
- Include test evidence (commands run and key outputs).
- Keep PRs focused and reviewable.
