/**
 * Admin plugin access control (Better Auth defaults).
 *
 * Extend like organization: spread `adminStatements`, `createAccessControl`, new
 * roles, pass `ac` / `roles` in `admin()`.
 *
 * @see docs/agents/better-auth.md
 */
import { defaultRoles as adminPluginRoles } from "better-auth/plugins/admin/access"

export {
  defaultAc as adminPluginAc,
  defaultRoles as adminPluginRoles,
  defaultStatements as adminStatements,
} from "better-auth/plugins/admin/access"

export type PlatformRole = keyof typeof adminPluginRoles
