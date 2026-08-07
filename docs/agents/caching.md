# Caching

> Rule: `.cursor/rules/caching.mdc`.

Caching applies to **Next.js apps** (`apps/web`, etc.) — not to core packages unless a package explicitly documents cache helpers for apps.

1. **Read:** `'use cache'` + `cacheTag` from segment `cache-tags.ts` + `cacheLife("minutes")`.
2. **Write:** after successful `auth.api` in the **same** action → **`updateTag(tag)`** (same tag builder as the read).
3. Never cache session.

| Situation                   | API                         |
| --------------------------- | --------------------------- |
| Actor must see fresh UI now | `updateTag`                 |
| Elsewhere / staleness OK    | `revalidateTag(tag, "max")` |

No bare `revalidateTag(tag)`. Next.js API semantics: read `node_modules/next/dist/docs/` first ([nextjs.md](./nextjs.md)) — do not web-search.
