# Implementation

> Rule: `.cursor/rules/implementation.mdc`

Server Components by default. `"use client"` only for interactivity.

Mutations: `app/action/<segment>/` mirrors the route — validate → `auth.api` or `createRouterClient` → `updateTag` if the actor must see the change. [api.md](./api.md)

Suspense only around slices that call request APIs (`headers`, `cookies`). Cached shells stay outside.

Next.js APIs: read `apps/web/node_modules/next/dist/docs/` first — [nextjs.md](./nextjs.md). Never web-search.

## Session {#auth--session}

| Helper                 | When                                           |
| ---------------------- | ---------------------------------------------- |
| `auth.api.getSession`  | Read / route gate — `headers: await headers()` |
| `auth.api` + `headers` | Mutations and permission checks                |

Never cache session. Do not gate before `auth.api`. Client components must not import `@repo/auth`.

Cookie cache (5 min) can lag ban/role changes — [better-auth.md](./better-auth.md).

## Storage uploads {#storage-uploads}

`@repo/storage` owns keys and public URLs. App actions wire auth + cache.

Key layout: `{kind}/{id}/{purpose}/{fileName}` — `toObjectKey` / `parseObjectKey` in `packages/storage/src/keys/object-key.ts`.

1. Client: `toObjectKey(kind, purpose, fileName)` — no id. Server inserts `{id}` from the session.
2. Build `Owner` (`user` / `org`) from the session.
3. Assert `objectKeyMatches(key, owner, purpose)` before persist. `toPublicUrl(key)` for the stored URL.
4. Persist via **`auth.api`** — not a direct auth-table write.
5. Delete the replaced object (`deleteOwnedAvatar`).
6. `updateTag` / `invalidateUserCache` — [caching.md](./caching.md).

Reference: `set-account-avatar-action.ts`, organization-logo siblings.

## Definition of done {#definition-of-done}

- [Placement](./architecture.md#placement) — right app vs package
- SSOT updated (routes, tags, labels)
- Writes via `auth.api` or `createRouterClient`; `updateTag` when the actor must see the change
- No custom access modules
- New work only in `apps/web` + core packages
