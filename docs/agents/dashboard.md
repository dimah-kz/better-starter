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

1. Route under `apps/<app>/src/app/dashboard/…` — mirror folder structure of a similar feature.
2. Register URL, labels, tags (above).
3. Lists: `get-*.ts` with `'use cache'` + tags from `cache-tags.ts`.
4. Writes: `app/action/dashboard/…` → `auth.api` — [better-auth.md](./better-auth.md).
5. Optional UI gate: `hasPermission` / `userHasPermission` — follow existing layout or loader in that subtree.
6. Server lists: copy [§ Server lists](#server-lists) / `members-table.tsx` — `list/` + ReUI DataGrid inline; no app wrapper components. Also `responsive-form-overlay.tsx`, segment shells — [architecture.md § Placement](./architecture.md#placement).

## Server lists {#server-lists}

Split responsibilities — do not invent wrappers like `ListDataGrid` / `DataGridCard`:

| Layer                                                    | Owns                                          | Does not own    |
| -------------------------------------------------------- | --------------------------------------------- | --------------- |
| `list/` (`useList`, `List.Search` / `Filter` / `Footer`) | URL `page` / `pageSize` / `filter` / `q`      | Row rendering   |
| ReUI `@repo/ui/.../reui/data-grid/*`                     | Table chrome (`DataGrid`, `DataGridTable`, …) | URL / RSC fetch |
| Feature `*-columns.tsx`                                  | Column defs                                   | Pagination      |

**Columns** — use the typed helper (ReUI `dataGridFeatures`):

```ts
import { createDataGridColumnHelper } from "@/components/data-grid"

const columnHelper = createDataGridColumnHelper<Row>()

export function createThingColumns(...) {
  return columnHelper.columns([
    columnHelper.accessor("name", {
      header: t("columns.name"),
      meta: {
        headerTitle: t("columns.name"),
        cellClassName: "min-w-0",
      },
      enableSorting: false,
    }),
  ])
}
```

Meta keys are ReUI’s: `headerTitle`, `headerClassName`, `cellClassName` (not a generic `className`).

**Table client component** — inline Card + `useTable` + DataGrid (canonical: `apps/web/src/app/dashboard/(organization)/manage/members/components/members-table.tsx`):

```tsx
const list = useList({ buildPath, page, pageSize, totalCount, filter, q })
const columns = useMemo(() => createThingColumns(...), [...])
const table = useTable({
  features: dataGridFeatures,
  data: rows,
  columns,
  getRowId: (row) => row.id,
  manualPagination: true,
  rowCount: totalCount,
})

return (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardAction className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
        <List.Search value={q} buildPath={list.buildSearchPath} ... />
        {/* optional List.Filter */}
      </CardAction>
    </CardHeader>
    <CardContent className="min-w-0">
      <DataGrid
        table={table}
        recordCount={totalCount}
        emptyMessage={...}
        className="min-w-0"
        tableLayout={{ width: "fixed", headerBackground: true, rowBorder: true }}
      >
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
      </DataGrid>
    </CardContent>
    <CardFooter className="justify-between gap-2">
      <List.Footer pagination={list.pagination} />
    </CardFooter>
  </Card>
)
```

Imports: `dataGridFeatures` / `DataGrid` / `DataGridContainer` from `@repo/ui/components/reui/data-grid/data-grid`; `DataGridTable` from `.../data-grid-table`; Card from `@repo/ui/components/card`; list from `@/components/list`.

Do **not** wrap this in a shared app component unless a third distinct call site needs a real behavioral difference.

## Removing a slice

Delete route tree + matching `action/dashboard/…` + unused keys in routes, labels, tags.

## Multiple apps

Web dashboard (`apps/web`) is the primary target. If `apps/mobile` or `apps/extension` get surfaces later, reuse `@repo/auth` permissions — do not duplicate RBAC. UI and navigation SSOT stay per app.
