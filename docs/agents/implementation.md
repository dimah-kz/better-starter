# Implementation

> Rule: `.cursor/rules/implementation.mdc`.

## Defaults

- Server Components; `"use client"` only for interactivity.
- Mutations: `app/action/<segment>/` mirrors routes — validate → `auth.api` (auth) or `createCaller` (product) → `updateTag` if needed. See [api.md](./api.md).
- Suspense: only around slices that call request APIs (`headers`, `cookies`, …). Cached/static shells stay outside.
- Next.js APIs/patterns: read `apps/web` → `node_modules/next/dist/docs/` first ([nextjs.md](./nextjs.md)); never web-search.

## Session {#auth--session}

| Helper                 | When                                                   |
| ---------------------- | ------------------------------------------------------ |
| `auth.api.getSession`  | Read session / route gate — `headers: await headers()` |
| `auth.api` + `headers` | Mutations and permission checks                        |

Core auth from `@repo/auth`. Do not gate before `auth.api`. Never cache session.

## Storage uploads {#storage-uploads}

`@repo/storage` owns keys and public URLs; app actions wire auth + cache.

Canonical object key: `{kind}/{id}/{purpose}/{fileName}`. Layout SSOT: `packages/storage/src/keys/object-key.ts` (`toObjectKey` / `parseObjectKey`). Names: [architecture.md § Naming](./architecture.md#naming).

1. Client calls `toObjectKey(kind, purpose, fileName)` — kind only, never an id. The server inserts `{id}` from the session (`toObjectKey(owner, purpose, fileName)`). Download/delete **assert** the stored key — they do not rewrite.
2. Validate session → build `Owner` (`user` / `org`) — see `packages/storage/src/owner/`.
3. Verify the object key matches the owner **and purpose** before persisting (`objectKeyMatches(key, owner, "avatars")`). Use `toPublicUrl(key)` when linking the file.
4. Persist via **`auth.api`** (user image, org logo, …) — not direct DB writes on auth tables.
5. Clean up replaced objects (`deleteOwnedAvatar` pattern in app `lib/`).
6. **`updateTag`** / `invalidateUserCache` so the actor sees fresh UI — [caching.md](./caching.md).

**Reference:** `set-account-avatar-action.ts`, `organization-logo` sibling actions.

## Definition of done {#definition-of-done}

- [Placement](./architecture.md#placement) respected — right app vs package.
- SSOT updated (routes, tags, labels).
- Writes via `auth.api` or `@repo/api` `createCaller`; `updateTag` when same user must see the change.
- No custom access modules.
- New work in `apps/web` + core packages only.
