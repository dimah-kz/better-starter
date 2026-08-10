# Monorepo

> Rule: `.cursor/rules/monorepo.mdc`.

## Layout (target)

Three app slots under `apps/` + shared core under `packages/`:

| Slot          | Path             | Role                                                                                          |
| ------------- | ---------------- | --------------------------------------------------------------------------------------------- |
| **Web**       | `apps/web`       | Next.js — primary target (has [AGENTS.md](../../apps/web/AGENTS.md) for Next’s managed block) |
| **Mobile**    | `apps/mobile`    | Future client; stack TBD — share via `@better-starter/*`                                      |
| **Extension** | `apps/extension` | Placeholder — own UI shell; same core packages                                                |

Explore `apps/` and `packages/` for what exists today. Do not import across apps; share through packages.

**pnpm workspaces:** `apps/*`, `packages/*`, `tooling/*`. **Turbo:** `turbo.json` for `build` / `dev` / `lint` / `typecheck`.

## Package vs app responsibilities

| Layer         | Owns                                                                                                                       | Does not own                                            |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **packages/** | Auth config, Drizzle schema/client/migrations, S3 storage (`@better-starter/storage`), shadcn primitives (`@workspace/ui`) | Routes, pages, app UI, Server Actions, dashboard chrome |
| **tooling/**  | Shared eslint/tsconfig presets (`@workspace/eslint-config`, `@workspace/typescript-config`)                                | Product/runtime code                                    |
| **apps/**     | Routes, layouts, Server Actions, feature UI, SSOT (`cache-tags`, `*-routes`), Next session helpers                         | Duplicating auth/db logic that belongs in a package     |

**UI split:** `@workspace/ui` = shadcn primitives shared across apps. App-composed components (`badge/`, `data-table/` + `list/`, dashboard chrome) live in `apps/<app>/src/components/` or route-scoped `components/`.

**Lists:** `data-table/` = TanStack Table + shadcn `Table` (columns, render). `list/` = URL-driven search / filter / pagination for server lists. Compose with `DataTableCard`.

## Naming

Explore `packages/*/package.json` for live names. Target publish scope is `@better-starter/*` (`@workspace/*` configs/UI may rename later). Apps import via `workspace:*` until publish.

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
pnpm --filter @better-starter/db db:migrate
```

## Adding a new core package

1. Create `packages/<name>/` with `package.json` (`name: "@better-starter/<name>"`, `"private": true` until publish).
2. Extend `tooling/typescript-config` if needed; wire eslint from `@workspace/eslint-config`.
3. Export a minimal public surface — apps import from package root or documented subpaths only.
4. Document exports in package `README.md` (one paragraph, not agent docs).
