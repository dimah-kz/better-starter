export type AccountPanel = "profile" | "security" | "sessions"

export type AccountListPanel = Exclude<AccountPanel, "profile">
