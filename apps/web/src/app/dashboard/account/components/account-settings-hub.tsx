"use client"

import { useState } from "react"
import { ChevronRightIcon } from "lucide-react"
import { AccountSettingsPanel } from "@/app/dashboard/account/components/account-settings-panel"
import { AccountSettingsNavItem } from "@/app/dashboard/account/components/account-settings-nav-item"
import { useTranslations } from "next-intl"
import { accountHubSections } from "@/app/dashboard/account/lib/account-settings-items"
import type { AccountPanel } from "@/app/dashboard/account/lib/account-panel"
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/avatar"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@repo/ui/components/item"

type AccountSettingsHubProps = {
  profile: {
    id: string
    name: string
    email: string
    image: string | null
  }
}

export function AccountSettingsHub({ profile }: AccountSettingsHubProps) {
  const t = useTranslations("dashboard")
  const [openSection, setOpenSection] = useState<AccountPanel | null>(null)
  const previewImage = profile.image ?? ""

  return (
    <>
      <div className="flex w-full max-w-xl flex-col gap-4">
        <Item
          variant="outline"
          className="hover:bg-muted/50"
          render={
            <button
              type="button"
              className="flex w-full min-w-0 items-center gap-2.5 text-start"
              onClick={() => setOpenSection("profile")}
            />
          }
        >
          <ItemMedia>
            <Avatar className="size-11">
              <AvatarImage src={previewImage} alt={profile.name} />
              <AvatarFallback>
                {profile.name[0]?.toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent className="min-w-0">
            <ItemTitle className="truncate text-sm">{profile.name}</ItemTitle>
            <ItemDescription className="truncate">
              {profile.email}
            </ItemDescription>
          </ItemContent>
          <ItemActions className="shrink-0 text-muted-foreground">
            <ChevronRightIcon className="size-4 rtl:rotate-180" aria-hidden />
          </ItemActions>
        </Item>

        <ItemGroup className="gap-2" role="list">
          {accountHubSections.map((item) => (
            <AccountSettingsNavItem
              key={item.key}
              title={t(item.labelKey)}
              description={t(item.descriptionKey)}
              icon={item.icon}
              href={item.href}
            />
          ))}
        </ItemGroup>
      </div>

      <AccountSettingsPanel
        section={openSection}
        onClose={() => setOpenSection(null)}
        profile={profile}
      />
    </>
  )
}
