# Next.js 16+ (in-repo docs)

> Rule: `.cursor/rules/nextjs.mdc`. Managed warning: [apps/web/AGENTS.md](../../apps/web/AGENTS.md).

## Rule

1. **Always** open the matching guide under `apps/web` → `node_modules/next/dist/docs/` **before** writing or changing Next.js code.
2. **Never** web-search Next.js APIs, caching, Server Actions, or config — training data and the public web lag this version.
3. Then apply **this repo’s** choices (e.g. [caching.md](./caching.md)).

If a path below is missing, list/search that `docs/` tree — do not fall back to the web.

## Doc index

Paths are relative to `node_modules/next/dist/docs/` (resolve from `apps/web`).

| Topic                                  | Path                                                                             |
| -------------------------------------- | -------------------------------------------------------------------------------- |
| Caching + PPR                          | `01-app/01-getting-started/08-caching.md`                                        |
| Revalidating                           | `01-app/01-getting-started/09-revalidating.md`                                   |
| Server Actions                         | `01-app/01-getting-started/07-mutating-data.md`                                  |
| Suspense                               | `01-app/02-guides/streaming.md`                                                  |
| `cacheComponents`                      | `01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md`         |
| `use cache` / `cacheTag` / `updateTag` | `01-app/03-api-reference/01-directives/use-cache.md`, `04-functions/cacheTag.md` |

**Commands:** from the app or `pnpm --filter web <script>`. Turbo resolves workspace deps before build.
