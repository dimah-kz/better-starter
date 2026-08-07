# better-starter

A Turborepo starter for **multi-tenant SaaS** — Next.js dashboard, Better Auth, Postgres, and [dimah-s3](https://dimah-s3.vercel.app) storage, with shared packages ready for mobile or extension later.

Closest mental model: a production-shaped Turborepo / create-t3-app, opinionated for org-based products from day one.

**[Use this template](https://github.com/hamidrezakz/better-starter/generate)**

## Structure

```
better-starter/
├── apps/
│   └── web/                 # Next.js product (dashboard, auth, admin)
├── packages/
│   ├── auth/                # Better Auth server & access helpers
│   ├── db/                  # Drizzle schema, client, migrations
│   ├── storage/             # dimah-s3 storage
│   ├── i18n/                # Shared UI messages & locale config
│   ├── ui/                  # Shared shadcn primitives
│   ├── eslint-config/
│   └── typescript-config/
└── docs/agents/             # Contributor / agent guides
```

`apps/mobile` and `apps/extension` are reserved slots — share through packages, not across apps.

## Quick start

Node ≥ 22 · pnpm 11 · PostgreSQL · dimah-s3 storage (S3-compatible bucket, e.g. R2)

```bash
pnpm install
cp .env.example .env          # DATABASE_URL, BETTER_AUTH_*, S3_*
pnpm --filter @better-starter/db db:migrate
pnpm dev # runs both web and db
```

→ [http://localhost:3000](http://localhost:3000)

| Command                                       | What it does     |
| --------------------------------------------- | ---------------- |
| `pnpm --filter web dev`                       | Run the web app  |
| `pnpm build` / `lint` / `typecheck`           | Quality gates    |
| `pnpm --filter @better-starter/db db:migrate` | Apply migrations |

Conventions live in [`AGENTS.md`](./AGENTS.md). MIT — see [LICENSE](./LICENSE).
