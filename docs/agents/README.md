# Agent documentation

Procedural guides — **not** a map of the repo. Explore code for what exists; read these when **adding or changing** a feature.

| File                                     | Read when                                              |
| ---------------------------------------- | ------------------------------------------------------ |
| [monorepo.md](./monorepo.md)             | Workspace roles, deps, new package                     |
| [architecture.md](./architecture.md)     | Placement, SSOT, over-extract                          |
| [better-auth.md](./better-auth.md)       | Auth package, mutations, permissions                   |
| [dashboard.md](./dashboard.md)           | Dashboard route/feature (in an app)                    |
| [implementation.md](./implementation.md) | RSC, Suspense, session, storage uploads                |
| [caching.md](./caching.md)               | Tagged cache reads/writes (after Next in-repo docs)    |
| [nextjs.md](./nextjs.md)                 | **Always** use `node_modules/next/dist/docs/` — no web |
| [ui-design.md](./ui-design.md)           | Styling constraints (`@workspace/ui`)                  |
| [i18n.md](./i18n.md)                     | Messages, locale, `next-intl`                          |

## When **not** to read

- **One-line bugfix** — the matching `.mdc` rule is enough.
- **"Where is X?"** — grep / explore the codebase, not these guides.
- **Refactor or rename only** — [architecture.md § Placement](./architecture.md#placement).

## Canonical examples (web)

Copy patterns from these — do not invent parallel structure.

| Task           | Reference                                                                |
| -------------- | ------------------------------------------------------------------------ |
| Mutation       | `apps/web/src/app/action/dashboard/account/set-account-avatar-action.ts` |
| Cached read    | `apps/web/src/app/dashboard/account/lib/get-account-profile.ts`          |
| Route SSOT     | `apps/web/src/app/dashboard/lib/dashboard-routes.ts`                     |
| Cache tags     | `apps/web/src/app/dashboard/lib/cache-tags.ts`                           |
| UI copy (i18n) | `packages/i18n/src/messages/en/dashboard.json`                           |

**Entry:** [AGENTS.md](../../AGENTS.md). **Next managed block:** [apps/web/AGENTS.md](../../apps/web/AGENTS.md).
