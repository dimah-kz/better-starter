# web

The Next.js app in this Turborepo — **server-first** org dashboard, auth screens, account settings, platform admin, and storage uploads.

Session is read in RSC. Mutations live in Server Actions (`auth.api`). There is no `authClient` on this surface. Shared auth, db, dimah-s3 storage, i18n, and UI primitives come from packages.

```bash
pnpm --filter web dev
```
