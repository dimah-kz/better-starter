# Product API (`@repo/api`)

> oRPC v2 procedures for **product** domain only. Auth stays on `auth.api`. Names follow the [oRPC docs](https://orpc.dev): `os`, `router`, `createRouterClient`, `RPCHandler` / `handleRequest`, `RPCLink` / `createORPCClient`.

**Explore** [`packages/api/src`](../../packages/api/src) for the live router and builders.

## When to add a procedure

Add the procedure in `@repo/api` (relative import from `base.ts`). Do not compose `pub` / `authed` in an app.

| Builder  | Use when                                           |
| -------- | -------------------------------------------------- |
| `pub`    | No session required (`health.ping`)                |
| `authed` | Needs `context.session` from `auth.api.getSession` |

Permissions stay on `auth.api` — no custom RBAC modules.

Do not wrap Better Auth endpoints in oRPC.

## Call sites

| Client                  | How                                                                                                                                       |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Web Server Action / RSC | `createRouterClient(router, { context: { headers: await headers() } })` — in-process, no HTTP                                             |
| Mobile / other HTTP     | `createORPCClient({ origin })` from `@repo/api/client` — never import `@repo/api` (pulls auth/db).                                        |
| Next cache (`get-*.ts`) | Do **not** call `headers()` inside `'use cache'`. Pass explicit ids into the procedure, or keep the cached read as a db query in the app. |

Web mutations stay in `app/action/<segment>/` — parse input → `createRouterClient` → `updateTag`. Next cache APIs never belong in `@repo/api`.

The only product HTTP surface is [`apps/web/src/app/api/rpc/[[...rest]]/route.ts`](../../apps/web/src/app/api/rpc/[[...rest]]/route.ts) (`handleRequest`). Do not add ad-hoc mutation Route Handlers. Do not export `GET` (oRPC default; cookie CSRF).

## Client components

Never import `@repo/api` in a client component (pulls auth/db). HTTP clients import `@repo/api/client` only.
