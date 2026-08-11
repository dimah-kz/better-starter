export type AccountPanel = "profile" | "password" | "sessions"

export type AccountSecurityPanel = Exclude<AccountPanel, "profile">
