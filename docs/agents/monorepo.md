# Monorepo

> Rule: `.cursor/rules/monorepo.mdc`.

## Layout (target)

Three app slots under `apps/` + shared core under `packages/`:

| Slot          | Path             | Role                                                                                          |
| ------------- | ---------------- | --------------------------------------------------------------------------------------------- |
| **Web**       | `apps/web`       | Next.js — primary target (has [AGENTS.md](../../apps/web/AGENTS.md) for Next’s managed block) |
| **Mobile**    | `apps/mobile`    | Future client; stack TBD — share via `@repo/*`                                                |
| **Extension** | `apps/extension` | Placeholder — own UI shell; same core packages                                                |

Explore `apps/` and `packages/` for what exists today. Do not import across apps; share through packages.

**pnpm workspaces:** `apps/*`, `packages/*`, `tooling/*`. **Turbo:** `turbo.json` for `build` / `dev` / `lint` / `typecheck`.

## Package vs app responsibilities

| Layer         | Owns                                                                                                        | Does not own                                            |
| ------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **packages/** | Auth config, Drizzle schema/client/migrations, S3 storage (`@repo/storage`), shadcn primitives (`@repo/ui`) | Routes, pages, app UI, Server Actions, dashboard chrome |
| **tooling/**  | Shared eslint/tsconfig presets (`@repo/eslint-config`, `@repo/typescript-config`)                           | Product/runtime code                                    |
| **apps/**     | Routes, layouts, Server Actions, feature UI, SSOT (`cache-tags`, `*-routes`), Next session helpers          | Duplicating auth/db logic that belongs in a package     |

**UI split:** `@repo/ui` = shadcn primitives (+ ReUI under `components/reui/`) shared across apps. App-composed UI (`badge/`, `list/`, dashboard chrome) lives in `apps/<app>/src/components/` or route-scoped `components/`.

**Lists (server pages):** URL state via app `list/` (`useList`, `ListSearch`, `ListPagination`, params helpers) — do **not** put search/filter/pagination in the grid, and do **not** use ReUI `DataGridPagination` for these lists. Render with ReUI `DataGrid` + `DataGridTable` inline (copy `members-table.tsx`). Filter chips: inline shadcn `ToggleGroup`. Columns: `createDataGridColumnHelper`. Detail: [dashboard.md § Server lists](./dashboard.md#server-lists).

## Naming

Explore `packages/*/package.json` and `tooling/*/package.json` for live names. Shared scope is `@repo/*`. Apps import via `workspace:*` until publish.

## Dependency rules

1. **apps → packages** — OK.
2. **packages → packages** — OK when acyclic (e.g. `auth` may depend on `db`).
3. **packages → apps** — **forbidden**.
4. **app → app** — **forbidden** — share via packages, not cross-imports.

## Commands (from repo root)

```bash
pnpm dev          # turbo dev — all apps
pnpm build        # turbo build
pnpm lint         # turbo lint
pnpm typecheck    # turbo typecheck
```

Filter to one app/package when needed:

```bash
pnpm --filter web dev
pnpm --filter @repo/db db:migrate
```

## Adding a new core package

1. Create `packages/<name>/` with `package.json` (`name: "@repo/<name>"`, `"private": true` until publish).
2. Extend `tooling/typescript-config` if needed; wire eslint from `@repo/eslint-config`.
3. Export a minimal public surface — apps import from package root or documented subpaths only.
4. Document exports in package `README.md` (one paragraph, not agent docs).
