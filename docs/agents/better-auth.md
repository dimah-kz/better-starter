# Better Auth

> Rule: `.cursor/rules/better-auth.mdc`. **Explore** `@better-starter/auth` and sibling actions in `apps/web` for live patterns.

## Where auth lives

| Concern                 | Location                                                                         |
| ----------------------- | -------------------------------------------------------------------------------- |
| Auth instance + plugins | `packages/auth/src/auth.ts`                                                      |
| Org / admin permissions | `packages/auth/src/*-access.ts`                                                  |
| Auth API error messages | `@better-auth/i18n` in `auth.ts` (cookie `BS_LOCALE`) + `getAuthApiErrorMessage` |
| Auth redirect helpers   | `apps/web/src/app/(auth)/lib/auth-redirect.ts`                                   |
| Auth DB schema          | `packages/db` — generated from Better Auth CLI                                   |
| App wiring              | `apps/web/` — import auth, env in `.env.local`                                   |

## When changing auth config

1. Edit `auth.ts` and/or `*-access.ts` in the auth package.
2. From the db package: `pnpm --filter @better-starter/db auth:generate` → `db:generate` → `db:migrate`.
3. Do not hand-edit generated auth schema or add product tables there.

**Teams:** off by default — enable in `organization()` only when you add team features.

**Last login method:** `lastLoginMethod({ storeInDatabase: true })` — cookie for login UI (read in RSC); `session.user.lastLoginMethod` from DB. No auth client in core.

## When adding a mutation (in an app)

1. Server Action under `app/action/…` mirroring the route (one mutation per file).
2. Import `auth` from `@better-starter/auth`. Call **`auth.api.<method>`** with `headers: await headers()` (needed for session + `@better-auth/i18n` locale cookie). Sign-in/up still pass `body`; `nextCookies()` sets the session cookie.
3. Surface errors with `getAuthApiErrorMessage` — Better Auth error codes are already translated by the i18n plugin.
4. `updateTag` after success when the actor's UI must refresh — [caching.md](./caching.md).

**Never:** direct deletes on auth member/invite tables, `dashboard-access.ts`, duplicate permission matrices, write Route Handlers.

## When adding a permission / resource

1. Extend statements + roles in `organization-access.ts` or `admin-access.ts` (see file comments).
2. Regenerate schema if the CLI requires it.
3. **UI / route gate (optional):** `auth.api.hasPermission` (org) or `userHasPermission` (platform) — copy an existing gate in the same app area.
4. **Mutations:** no extra pre-check — `auth.api` enforces.

## Session rules

- `auth.api.getSession({ headers: await headers() })` for reads and route gates (e.g. dashboard layout).
- Never `'use cache'` on session.
- Client components: never import `@better-starter/auth` (pulls in db/pg).

## Mobile & extension (future)

Auth client config and secure storage live in `apps/mobile` or `apps/extension` — not in core packages. Server-side auth stays in `@better-starter/auth`; share types and permission statements from the package, not Next-specific session helpers.
