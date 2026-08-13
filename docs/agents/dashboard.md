# Dashboard segment

> Rule: `.cursor/rules/dashboard.mdc`. **Explore** a sibling feature in `apps/web/src/app/dashboard/`.

Dashboard UI and routes live **inside the app**, not in core packages.

## SSOT — update when adding a route

| What                          | Where (inside app)                                                                                        |
| ----------------------------- | --------------------------------------------------------------------------------------------------------- |
| URLs                          | `dashboard/lib/dashboard-routes.ts`                                                                       |
| Breadcrumb segments           | `dashboardRouteSegments` in `dashboard-routes.ts` + `dashboard.breadcrumbSegments` in i18n                |
| Nav / tab copy                | `@repo/i18n` → `messages/en/dashboard.json`                                                               |
| Cache tags                    | `dashboard/lib/cache-tags.ts`                                                                             |
| Tab registry (if tabbed area) | `*-slices.ts` or `*-tabs.ts` beside that area's `lib/` (include `icon`, `labelKey`, `pathSuffix`, `href`) |

No hardcoded paths or chrome strings in components.

Breadcrumb: add segment to `dashboardRouteSegments` + matching key in `dashboard.breadcrumbSegments` i18n — labels resolve in `dashboard-breadcrumbs.tsx` from pathname.

Sidebar drill-down items for admin/manage are derived from slice/tab registries in `sidebar-nav-sections.ts` — add one row to the registry when adding a tabbed route.

## New dashboard feature checklist

1. Route under `apps/<app>/src/app/dashboard/…` — mirror a similar feature.
2. Register URL, labels, tags (above).
3. Lists: `get-*.ts` with `'use cache'` + tags from `cache-tags.ts`.
4. Writes: `app/action/dashboard/…` → `auth.api` — [better-auth.md](./better-auth.md).
5. Optional UI gate: `hasPermission` / `userHasPermission` — follow existing layout or loader in that subtree.
6. Server lists: copy the canonical files below — [architecture.md § Placement](./architecture.md#placement).

## Server lists {#server-lists}

**Canonical:** copy  
`apps/web/src/app/dashboard/(organization)/manage/members/components/members-table.tsx`  
(+ `members-columns.tsx`, page `get-*.ts`, `*-table-params.ts`).

| Layer                | Owns                                   | Does not own |
| -------------------- | -------------------------------------- | ------------ |
| `list/` URL          | `page` / `pageSize` / `filter` / `q`   | Cells        |
| `ListTable`          | thead / tbody / empty                  | Fetch / URL  |
| Feature `*-columns`  | `ListColumn<T>[]`                      | Pagination   |
| shadcn `ToggleGroup` | Enum chips → `list.setFilter` (inline) | —            |

**New list checklist**

1. `get-*.ts` — tagged cache page from the database (`page` / `pageSize` / `filter` / `q`). Use `LIST_SEARCH_MIN_LENGTH` from `list/` for `q`.
2. `*-table-params.ts` — `listPath` + parse helpers.
3. `*-columns.tsx` — `ListColumn<T>[]` (`id`, `header`, `cell`, optional class names).
4. `*-table.tsx` — Card + `ListSearch` + optional chips + `ListTable` (`caption`, `busy={list.isPending}`, empty vs results) + `ListPagination` (`list.pagination`, pass `countLabel` into `useList`).
5. `page.tsx` — parse search params, fetch, pass the server page into the table. Suspense fallback: `ListSkeleton`.

**Required**

- Show every column at every breakpoint — no `hidden sm:table-cell` / `lg:table-cell`. The table scrolls horizontally when space is tight.
- `ListSearch` + `ListPagination` from `list/` — never client row-model pagination for these lists.
- `caption` (same copy as the card title), `countLabel`, and `busy={list.isPending}`.
- Empty copy: `tables.empty.results` when `q` or a non-default filter is active; otherwise `tables.empty.<noun>`.

**Do not**

- Use TanStack Table or ReUI DataGrid on URL / RSC lists. A client ops grid can be added later with `pnpm dlx shadcn add @reui/data-grid -c packages/ui` — do not keep a dead grid stack in the template.
- Invent `ListDataGrid` / `DataGridCard` / `ListFilter` / `ListFooter` wrappers.
- Use or revive `legacy-data-table` / app `data-table` (removed).

## Removing a slice

Delete route tree + matching `action/dashboard/…` + unused keys in routes, labels, tags.

## Multiple apps

Web dashboard (`apps/web`) is the primary target. If `apps/mobile` or `apps/extension` get surfaces later, reuse `@repo/auth` permissions — do not duplicate RBAC. UI and navigation SSOT stay per app.
