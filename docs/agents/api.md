# Product API (`@repo/api`)

oRPC v2 for **product** domain only. Auth stays on `auth.api`. Live router: [`packages/api/src`](../../packages/api/src).

Add the procedure in `@repo/api` (import from `base.ts`). Do not compose `pub` / `authed` in an app. Do not wrap Better Auth.

| Builder  | When                                               |
| -------- | -------------------------------------------------- |
| `pub`    | No session (`health.ping`)                         |
| `authed` | Needs `context.session` from `auth.api.getSession` |

Permissions stay on `auth.api`.

| Caller                  | How                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| Web Server Action / RSC | `createRouterClient(router, { context: { headers: await headers() } })` — in-process              |
| Mobile / HTTP           | `createORPCClient({ origin })` from `@repo/api/client` — never import `@repo/api` (pulls auth/db) |
| `'use cache'`           | Do not call `headers()` inside the cache function. Pass ids, or query the db in the app           |

Web mutations stay in `app/action/<segment>/`. Next cache APIs never belong in `@repo/api`.

The only product HTTP surface is `apps/web/src/app/api/rpc/[[...rest]]/route.ts`. Do not export `GET` (cookie CSRF). Client components import `@repo/api/client` only.
