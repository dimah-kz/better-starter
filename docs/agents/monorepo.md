# Monorepo

> Rule: `.cursor/rules/monorepo.mdc`

| Slot      | Path             | Role                                                    |
| --------- | ---------------- | ------------------------------------------------------- |
| Web       | `apps/web`       | Next.js product — [AGENTS.md](../../apps/web/AGENTS.md) |
| Mobile    | `apps/mobile`    | Future; share via `@repo/*`                             |
| Extension | `apps/extension` | Future; own UI shell, same core                         |

Do not import across apps. Workspaces: `apps/*`, `packages/*`, `tooling/*`. Turbo: `build` / `dev` / `lint` / `typecheck`.

| Layer       | Owns                                       | Does not                                        |
| ----------- | ------------------------------------------ | ----------------------------------------------- |
| `packages/` | Auth, Drizzle, oRPC, storage, i18n, shadcn | Routes, pages, Server Actions, dashboard chrome |
| `tooling/`  | eslint / tsconfig presets                  | Product code                                    |
| `apps/`     | Routes, layouts, actions, feature UI, SSOT | Auth/db logic that belongs in a package         |

`@repo/ui` = shadcn + ReUI + Dimah. App-composed UI (`list/`, dashboard chrome) stays in the app.

Server lists: [dashboard.md § Server lists](./dashboard.md#server-lists).

**Deps:** apps → packages OK. packages → packages OK if acyclic. packages → apps forbidden. app → app forbidden.

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm --filter web dev
pnpm --filter @repo/db db:migrate
```

New package: `packages/<name>/` with `"name": "@repo/<name>"`, `"private": true`. Minimal public exports. One-paragraph `README.md` (not agent docs).
