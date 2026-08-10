# UI styling

> Rule: `.cursor/rules/ui-design.mdc`.

**Shared UI package:** shadcn/Base UI primitives live in `@repo/ui` (`packages/ui`). App-composed components stay in each app.

## Per-app rules

- `lang` / `dir`: root layout only (`apps/<app>/src/app/layout.tsx`).
- Logical Tailwind (`ms`/`me`, `start`/`end`) — not physical left/right for layout.
- `@repo/ui/components/*`: shadcn preset (**base-mira**) — **never hand-edit**; regen via shadcn CLI scoped to `packages/ui`.
- App behavior components: `apps/<app>/src/components/` (outside package UI) or route-scoped `components/`.
- Link + Button: `render={<Link … />}`; `nativeButton={false}` when not a button.
- Dashboard chrome copy: `@repo/i18n` messages — see [i18n.md](./i18n.md).

## Default component styles

Use `@repo/ui` components **with their built-in styles** for ordinary usage. That keeps screens consistent and lets shadcn/UI package updates apply without chasing redundant overrides in app code.

- **Prefer defaults** — `variant`, `size`, and component props over `className` when they already express what you need.
- **`className` only when needed** — add Tailwind classes at a call site only when that placement genuinely requires customization (layout in a parent, one-off spacing, a contextual exception).
- **Do not re-specify what the component already sets** — e.g. avoid passing `rounded-lg` on `DropdownMenuContent` or overriding button radius when the default look is fine.
- **Document intentional exceptions** — when you override defaults for a real design reason (sidebar avatars with square corners, full-width submit buttons), keep the override minimal and scoped to that element.

## shadcn CLI (monorepo)

Add primitives to the shared UI package:

```bash
pnpm dlx shadcn@latest add button -c packages/ui
```

Apps import via `@repo/ui/components/<name>`. Each app's `components.json` aliases `ui` → `@repo/ui/components`.

Match existing patterns in the subtree you edit — [architecture § Placement](./architecture.md#placement).

## Client-safe auth imports

Client components must **not** import `@repo/auth` (pulls in db/pg). Use app-local auth helpers under `apps/web/src/app/(auth)/lib/` instead.
