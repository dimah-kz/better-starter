# Dashboard segment

> Rule: `.cursor/rules/dashboard.mdc`. **Explore** a sibling feature in `apps/web/src/app/dashboard/`.

Dashboard UI and routes live **inside the app**, not in core packages.

## SSOT — update when adding a route

| What                          | Where (inside app)                                                                                        |
| ----------------------------- | --------------------------------------------------------------------------------------------------------- |
| URLs                          | `dashboard/lib/dashboard-routes.ts`                                                                       |
| Breadcrumb segments           | `dashboardRouteSegments` in `dashboard-routes.ts` + `dashboard.breadcrumbSegments` in i18n                |
| Nav / tab copy                | `@better-starter/i18n` → `messages/en/dashboard.json`                                                     |
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
6. Reuse app `components/data-table/`, `responsive-form-overlay.tsx`, segment shells — [architecture.md § Placement](./architecture.md#placement).

## Removing a slice

Delete route tree + matching `action/dashboard/…` + unused keys in routes, labels, tags.

## Multiple apps

Web dashboard (`apps/web`) is the primary target. If `apps/mobile` or `apps/extension` get surfaces later, reuse `@better-starter/auth` permissions — do not duplicate RBAC. UI and navigation SSOT stay per app.
