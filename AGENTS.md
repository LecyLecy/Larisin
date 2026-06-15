# AGENTS.md

This file is the operating guide for AI coding agents working on Larisin.

## Project

- Name: Larisin.
- Product: UMKM/Koperasi intelligence platform for Indonesian small businesses.
- Stack: Next.js frontend, FastAPI backend, PostgreSQL direction.
- Deployment direction: Vercel frontend, Railway backend/database.

## Solo Developer Workflow

- Treat this as a solo-developer project.
- Keep changes small, practical, and easy to review.
- Prefer working software over broad scaffolding.
- Do not add complex auth, ML, ETL, payment, or export systems until requested.
- Preserve Indonesian UI labels unless a file is clearly internal/technical.

## Branch Policy

- `main` is deploy-ready only.
- `dev` is the active development branch.
- Work on `dev` unless the user explicitly says otherwise.
- Do not merge `dev` into `main` without explicit approval.
- Do not push without explicit approval.
- Do not force push.
- Do not delete local or remote branches without explicit approval.
- Do not rewrite remote history.

## Startup Protocol

1. Check `git status --short --branch`.
2. Confirm current branch.
3. Read `README.md`.
4. Read `docs/02-active-context.md` and `docs/03-latest-handoff.md`.
5. Inspect relevant source files before editing.
6. If a request mentions a bug, reproduce or inspect before changing code.

## Memory Docs Rule

Keep exactly these 10 docs in `docs/`:

1. `01-project-overview.md`
2. `02-active-context.md`
3. `03-latest-handoff.md`
4. `04-progress-and-decisions.md`
5. `05-system-architecture.md`
6. `06-folder-and-file-map.md`
7. `07-api-and-data-contract.md`
8. `08-ui-routes-and-components.md`
9. `09-commands-tests-and-debugging.md`
10. `10-known-issues-and-bug-triage.md`

Do not add extra memory docs unless the user asks.

## Documentation Update Protocol

- Update docs when architecture, commands, data contracts, routes, setup, or assumptions change.
- Update `docs/02-active-context.md` after meaningful work.
- Update `docs/03-latest-handoff.md` before ending a large task or when context may be lost.
- Mark unknowns as **Assumption**.
- Keep docs concise enough for future LLM handoff.

## Token-Limit Handoff Protocol

Before a long session ends or context is likely to compact:

- Summarize current branch and git status.
- List changed files.
- Record what works and what failed.
- Record commands already run.
- Put the handoff in `docs/03-latest-handoff.md`.

## Debugging Protocol

- Start from the smallest reproducible failure.
- Check environment variables before changing code.
- For frontend issues, inspect browser console, terminal output, and affected route/component.
- For backend issues, inspect FastAPI terminal logs and endpoint response.
- For deployment issues, compare local env names with Vercel/Railway settings.
- Avoid speculative rewrites.

## Testing Protocol

- Frontend: run `npm run lint` and `npm run build` when dependencies are installed.
- Backend: run `python -m pytest` when tests exist and dependencies are installed.
- For API changes, verify `/health` and changed endpoints.
- If checks cannot run, state why and document the exact command to rerun.

## Safety

- Never commit secrets.
- Never put real credentials in `.env.example`.
- Do not claim something works unless it was run or inspected.
- Respect user changes in the working tree.
- Do not revert unrelated files.

## Final Response Requirements

When finishing substantial work, report:

- Current branch.
- Files/folders changed.
- Dependencies installed.
- Commands run.
- Test/build results.
- Docs updated.
- Known issues and assumptions.
- Whether a commit was created.
- Whether a push was performed.
- What needs user approval next.
