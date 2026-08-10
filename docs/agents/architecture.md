# Architecture & layout

> Rule: `.cursor/rules/architecture.mdc`.

**Monorepo scope:** core in `packages/` (auth tables, db client). Product features live in **apps** as removable subtrees (`route` + matching `action/` + SSOT keys).

## Placement {#placement}

**Default:** inline in the file you edit.

**New file only when:** reused in 2+ places, or segment SSOT (`*-routes.ts`, `cache-tags.ts`, …).

**~10–20 lines at one call site:** do not extract to a new module.

### Search-up (before creating a file)

**In an app** (e.g. `apps/web/src/…`):

1. Beside `page.tsx` → parent route `components/` → segment `lib/` or `components/` → `src/components/` → `@repo/ui/components/*`

**In a package:**

1. Beside the caller → package `src/` root → sibling module already exported from `index.ts`

### Dependencies

**Within an app:** sub-feature → segment `lib/` → `src/lib` | `src/components`. **No** cross-sibling feature imports — share via segment SSOT only.

**Across layers:** app code imports `@repo/auth`, `@repo/db`, etc. Packages never import from apps.

`src/lib/<feature>/` mirrors `src/components/<feature>/` when both exist (inside the app).

## Conventions (app segments)

| Concern            | Pattern                                                                               |
| ------------------ | ------------------------------------------------------------------------------------- |
| URLs               | `*-routes.ts` per segment                                                             |
| Cache tags         | `cache-tags.ts` per segment                                                           |
| Dashboard nav copy | `@repo/i18n` `dashboard.json` namespace                                     |
| Writes             | `app/action/<segment>/` mirrors `app/<segment>/` — one mutation per file → `auth.api` |
| Reads              | `get-*.ts` + `'use cache'`                                                            |

**Forbidden:** `dashboard-access.ts`, custom RBAC modules, mutation Route Handlers.

## Package boundaries

Explore each package’s public exports (`package.json` / `index`). Auth schema: Better Auth tables only in the db package — no product tables in auth core. Product tables = app or future product package.

## Do not over-extract {#do-not-over-extract}

One importer ≠ reuse. No thin wrappers (e.g. toast helpers). Extract at true reuse or SSOT only.

Do not create a package for code used by a single app unless it is clearly core (auth, db) or will be shared with `mobile` / `extension` later.
