# @repo/ui

Shared [shadcn/ui](https://ui.shadcn.com/) primitives (Base UI under the hood) and global styles for every app.

**Do not hand-edit** generated components — refresh or add them with the CLI scoped to this package:

```bash
pnpm dlx shadcn@latest add button -c packages/ui
# or refresh everything from the repo root:
pnpm ui:sync
```

Import from `@repo/ui/components/…`. App-specific chrome and feature UI stay in each app, not here.
