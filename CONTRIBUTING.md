# Contributing to Zuri

1. Read `docs/RULES.md` and `docs/COMPONENT_RULES.md`. If they conflict, `RULES.md` wins.
2. `pnpm install`, then before every PR: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
3. Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`). One concern per PR, with screenshots for UI changes.
4. Add a changeset (`pnpm changeset`) for user-visible changes.
5. Third-party code needs its licence recorded in `THIRD_PARTY_NOTICES.md`.
6. A bug fix needs a regression test.
