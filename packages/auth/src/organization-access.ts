/**
 * Organization plugin access control (Better Auth defaults).
 *
 * To add an app resource later (e.g. `project`), spread `orgStatements`, call
 * `createAccessControl` from `better-auth/plugins/access`, rebuild roles with
 * `orgAc.newRole(...)`, and keep passing `ac` / `roles` in `organization()`.
 *
 * @see docs/agents/better-auth.md
 */
import { defaultRoles as orgRoles } from "better-auth/plugins/organization/access"

export {
  defaultAc as orgAc,
  defaultRoles as orgRoles,
  defaultStatements as orgStatements,
} from "better-auth/plugins/organization/access"

export type MembershipRole = keyof typeof orgRoles
