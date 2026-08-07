# better-starter

A production-oriented [Turborepo](https://turborepo.dev/) starter for multi-tenant SaaS apps.

Ship a Next.js dashboard with auth, organizations, Postgres, and S3 uploads already wired — then grow into mobile or extension apps from the same packages.

**[Use this template](https://github.com/hamidrezakz/better-starter/generate)** on GitHub to start a new repo.

## What's inside?

This Turborepo includes the following apps and packages:

### Apps and Packages

- `web` — [Next.js](https://nextjs.org/) 16 app (`cacheComponents`) with a mobile-first org dashboard, auth screens, and admin views
- `auth` — [Better Auth](https://www.better-auth.com/) server/client with email/password, `admin`, and `organization` plugins
- `db` — [PostgreSQL](https://www.postgresql.org/) + [Drizzle ORM](https://orm.drizzle.team/) schema, client, and migrations
- `storage` — S3-compatible uploads via [dimah-s3](https://dimah-s3.vercel.app) (`@better-starter/storage`)
- `i18n` — shared [next-intl](https://next-intl.dev/) messages (`@better-starter/i18n`)
- `ui` — shared [shadcn/ui](https://ui.shadcn.com/) / Base UI primitives (`@workspace/ui`)
- `@workspace/eslint-config` — shared ESLint configs
- `@workspace/typescript-config` — shared `tsconfig` bases

Each package/app is 100% [TypeScript](https://www.typescript.org/).

`apps/mobile` and `apps/extension` are reserved for later — share logic through packages, not cross-app imports.

```
apps/
  web/                 # Next.js dashboard + auth
packages/
  auth/                # Better Auth
  db/                  # Drizzle + Postgres
  storage/             # S3 ownership + key helpers
  i18n/                # Shared messages
  ui/                  # Shared UI primitives
  eslint-config/
  typescript-config/
```

### Features

- Multi-tenant organizations (switcher, members, manage)
- Platform admin (users & organizations)
- Account settings (profile, avatar, password, sessions)
- Avatar / org logo uploads to S3-compatible storage (e.g. Cloudflare R2)
- Locale-ready UI with `next-intl`
- Agent-friendly docs under [`AGENTS.md`](./AGENTS.md) and [`docs/agents/`](./docs/agents/)

### Utilities

This starter also includes:

- [Turborepo](https://turborepo.dev/) for monorepo task orchestration
- [pnpm](https://pnpm.io/) workspaces + catalog
- [Tailwind CSS](https://tailwindcss.com/) v4
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)
- React Compiler enabled for `web`

## Quick start

**Requirements:** Node ≥ 22, pnpm 11, PostgreSQL, S3-compatible storage (e.g. Cloudflare R2).

```bash
# 1. Create from the GitHub template, then:
pnpm install

# 2. Environment
cp .env.example .env
# fill DATABASE_URL, BETTER_AUTH_*, S3_*

# 3. Database
pnpm --filter @better-starter/db db:migrate

# 4. Dev
pnpm --filter web dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command                                       | Description           |
| --------------------------------------------- | --------------------- |
| `pnpm dev`                                    | Dev all packages/apps |
| `pnpm --filter web dev`                       | Web only              |
| `pnpm build`                                  | Production build      |
| `pnpm lint` / `pnpm typecheck`                | Quality gates         |
| `pnpm --filter @better-starter/db db:migrate` | Run migrations        |
| `pnpm --filter @better-starter/db db:studio`  | Open Drizzle Studio   |

## UI components

Add shadcn primitives into the shared UI package:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

```tsx
import { Button } from "@workspace/ui/components/button"
```

App-specific UI stays in `apps/web` — do not put feature chrome in `packages/ui`.

## Docs for contributors / agents

Conventions and checklists live in [`AGENTS.md`](./AGENTS.md) and [`docs/agents/`](./docs/agents/).

## License

MIT — see [LICENSE](./LICENSE).
