# better-starter

A **server-first Turborepo starter** for multi-tenant SaaS — Next.js dashboard, Better Auth, Postgres, and [dimah-s3](https://dimah-s3.vercel.app) storage. Shared packages are ready for a mobile or extension app later.

The product surface is server-first, not just login: session in RSC, lists from tagged cache, writes (auth, orgs, uploads) as Server Actions. No `authClient` and no client data layer in the UI.

**[Use this template](https://github.com/hamidrezakz/better-starter/generate)**

## Why server-first

| Typical SaaS kit                     | This starter                              |
| ------------------------------------ | ------------------------------------------ |
| Client SDK + React Query / providers   | RSC session via `auth.api.getSession`      |
| Client mutations, then refetch       | Server Actions → `auth.api` → `updateTag` |
| Drop-in widgets for auth, storage, menus | Your chrome: sidebar, org switcher, menus |
| Copy and locale owned by the kit     | `@repo/i18n` + RTL from day one             |

## Cache Components

`apps/web` runs with Next.js **Cache Components enabled** (`cacheComponents: true` in `next.config.ts`). That is a Next.js 16 setting, not an extra library.

- Cached reads: `'use cache'` + `cacheTag` + `cacheLife` in `get-*.ts`
- Same-user writes: `updateTag` in the mutating Server Action
- Session is never cached

See [`docs/agents/caching.md`](docs/agents/caching.md). Next.js APIs for this version live in `apps/web/node_modules/next/dist/docs/` — not training data or the public web.

## Structure

```
better-starter/
├── apps/
│   └── web/                 # Next.js product (dashboard, auth, admin)
├── packages/
│   ├── api/                 # Product oRPC (caller + /api/rpc)
│   ├── auth/                # Better Auth server & access helpers
│   ├── db/                  # Drizzle schema, client, migrations
│   ├── storage/             # dimah-s3 storage
│   ├── i18n/                # Shared UI messages & locale config
│   └── ui/                  # Shared shadcn primitives
├── tooling/
│   ├── eslint-config/
│   └── typescript-config/
└── docs/agents/             # Contributor / agent guides
```

`apps/mobile` and `apps/extension` are reserved slots — share through packages, not across apps.

## Quick start

Node ≥ 22 · pnpm 12 · PostgreSQL · dimah-s3 storage (S3-compatible bucket, e.g. R2)

```bash
pnpm install
cp .env.example .env          # DATABASE_URL, BETTER_AUTH_*, S3_*
pnpm --filter @repo/db db:migrate
pnpm dev                     # web + db
```

→ [http://localhost:3000](http://localhost:3000)

| Command                             | What it does     |
| ----------------------------------- | ---------------- |
| `pnpm --filter web dev`             | Run the web app  |
| `pnpm build` / `lint` / `typecheck` | Quality gates    |
| `pnpm --filter @repo/db db:migrate` | Apply migrations |

## Production

- **Trusted origins** — `http://localhost:3000` is trusted only outside production. Set `BETTER_AUTH_URL` to the public origin.
- **Auth rate limit** — stored in Postgres (`rateLimit.storage: "database"`) so counters survive serverless cold starts. Better Auth only rate-limits **HTTP** auth routes. This starter’s UI calls `auth.api` from Server Actions, which are not limited by that table. If you later mount `/api/auth`, the table is already there.
- **Session cookie cache** — `getSession` may use a cookie for up to **5 minutes**. After a ban or role change, the affected user can still look signed-in until that cache expires.
- **Postgres on serverless** — `pg.Pool` is for a long-lived Node process. On Vercel (or similar), use a **pooled** connection string (Neon pooler, PgBouncer, Supabase pooler). Direct `5432` will exhaust connections under bursty functions.

Conventions: [`AGENTS.md`](./AGENTS.md). MIT — see [LICENSE](./LICENSE).
