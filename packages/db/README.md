# @better-starter/db

PostgreSQL via [Drizzle](https://orm.drizzle.team/) — schema, client, and migrations.

The shared database layer for auth, dimah-s3 storage metadata, and anything else that needs durable data. Apps import the client and schema; they don’t own DB setup.

```bash
pnpm --filter @better-starter/db db:migrate   # apply migrations
pnpm --filter @better-starter/db db:studio    # browse data
pnpm --filter @better-starter/db auth:generate  # after Better Auth config changes
```
