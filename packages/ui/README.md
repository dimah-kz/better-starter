# @repo/ui

Shared [shadcn/ui](https://ui.shadcn.com/) primitives (Base UI under the hood), [ReUI](https://reui.io) components under `components/reui/`, and global styles for every app.

**Do not hand-edit** generated components for durable changes. Use the sync scripts; put ReUI overrides in `scripts/reui/patches/`:

```bash
# From repo root — runs shadcn sync, then ReUI sync (+ patches):
pnpm ui:sync

# Individually:
pnpm --filter @repo/ui sync:shadcn
pnpm --filter @repo/ui sync:reui
pnpm --filter @repo/ui sync:reui:patches

# Add a single primitive:
pnpm dlx shadcn@latest add button -c packages/ui

# Add a ReUI item, then register it in scripts/reui/components.mjs:
pnpm dlx shadcn@latest add @reui/<name> -c packages/ui
```

Import from `@repo/ui/components/…` or `@repo/ui/components/reui/…`. App-specific chrome and feature UI stay in each app, not here.
