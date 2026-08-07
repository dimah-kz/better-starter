import type { AccountListPanel } from "@/app/dashboard/account/lib/account-panel"

export const accountListSettingsItems = [
  {
    key: "security",
    labelKey: "accountSettings.security",
  },
  {
    key: "sessions",
    labelKey: "accountSettings.sessions",
  },
] as const satisfies ReadonlyArray<{
  key: AccountListPanel
  labelKey: string
}>
