# Implementation

> Rule: `.cursor/rules/implementation.mdc`.

## Defaults

- Server Components; `"use client"` only for interactivity.
- Mutations: `app/action/<segment>/` mirrors routes — validate → `auth.api` → `updateTag` if needed.
- Suspense: only around slices that call request APIs (`headers`, `cookies`, …). Cached/static shells stay outside.
- Next.js APIs/patterns: read `apps/web` → `node_modules/next/dist/docs/` first ([nextjs.md](./nextjs.md)); never web-search.

## Session {#auth--session}

| Helper                 | When                                                   |
| ---------------------- | ------------------------------------------------------ |
| `auth.api.getSession`  | Read session / route gate — `headers: await headers()` |
| `auth.api` + `headers` | Mutations and permission checks                        |

Core auth from `@better-starter/auth`. Do not gate before `auth.api`. Never cache session.

## Storage uploads {#storage-uploads}

`@better-starter/storage` owns keys and public URLs; app actions wire auth + cache.

1. Validate session → build `StorageOwner` (`user` / `org`) — see `packages/storage/src/owner/`.
2. Verify the object key matches the owner before persisting (e.g. `isAvatarKey`).
3. Persist via **`auth.api`** (user image, org logo, …) — not direct DB writes on auth tables.
4. Clean up replaced objects (`deleteOwnedAvatarObject` pattern in app `lib/`).
5. **`updateTag`** / `invalidateUserCache` so the actor sees fresh UI — [caching.md](./caching.md).

**Reference:** `set-account-avatar-action.ts`, `organization-logo` sibling actions.

## Definition of done {#definition-of-done}

- [Placement](./architecture.md#placement) respected — right app vs package.
- SSOT updated (routes, tags, labels).
- Writes via `auth.api`; `updateTag` when same user must see the change.
- No custom access modules.
- New work in `apps/web` + core packages only.
