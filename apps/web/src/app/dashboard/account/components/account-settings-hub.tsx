"use client"

import { Fragment, useState } from "react"
import { ChevronRightIcon } from "lucide-react"
import { AccountSettingsPanel } from "@/app/dashboard/account/components/account-settings-panel"
import type { AccountSessionDisplay } from "@/app/dashboard/account/components/account-sessions-content"
import { useTranslations } from "next-intl"
import { accountListSettingsItems } from "@/app/dashboard/account/lib/account-settings-items"
import type { AccountPanel } from "@/app/dashboard/account/lib/account-panel"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@repo/ui/components/item"
type AccountSettingsHubProps = {
  profile: {
    id: string
    name: string
    email: string
    image: string | null
  }
  hasPasswordCredential: boolean
  sessions: AccountSessionDisplay[]
  currentSessionToken: string
}

export function AccountSettingsHub({
  profile,
  hasPasswordCredential,
  sessions,
  currentSessionToken,
}: AccountSettingsHubProps) {
  const t = useTranslations("dashboard")
  const [openSection, setOpenSection] = useState<AccountPanel | null>(null)
  const previewImage = profile.image ?? ""

  return (
    <>
      <ItemGroup className="w-full max-w-xl gap-0" role="list">
        <Item
          size="sm"
          render={
            <button
              type="button"
              className="flex w-full min-w-0 items-center gap-2 text-start"
              onClick={() => setOpenSection("profile")}
            />
          }
        >
          <ItemMedia variant="image">
            <Avatar className="size-full">
              <AvatarImage src={previewImage} alt={profile.name} />
              <AvatarFallback>
                {profile.name[0]?.toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent className="min-w-0">
            <ItemTitle className="truncate text-sm">{profile.name}</ItemTitle>
            <p className="truncate text-xs text-muted-foreground">
              {profile.email}
            </p>
          </ItemContent>
          <ItemActions className="shrink-0 text-muted-foreground">
            <ChevronRightIcon className="size-3.5 rtl:rotate-180" aria-hidden />
          </ItemActions>
        </Item>

        {accountListSettingsItems.map((item) => (
          <Fragment key={item.key}>
            <ItemSeparator className="my-0" />
            <Item
              size="sm"
              render={
                <button
                  type="button"
                  className="flex w-full min-w-0 items-center gap-2 text-start"
                  onClick={() => setOpenSection(item.key)}
                />
              }
            >
              <ItemContent className="min-w-0">
                <ItemTitle className="text-sm">{t(item.labelKey)}</ItemTitle>
              </ItemContent>
              <ItemActions className="shrink-0 text-muted-foreground">
                <ChevronRightIcon
                  className="size-3.5 rtl:rotate-180"
                  aria-hidden
                />
              </ItemActions>
            </Item>
          </Fragment>
        ))}
      </ItemGroup>

      <AccountSettingsPanel
        section={openSection}
        onClose={() => setOpenSection(null)}
        profile={profile}
        hasPasswordCredential={hasPasswordCredential}
        sessions={sessions}
        currentSessionToken={currentSessionToken}
      />
    </>
  )
}
