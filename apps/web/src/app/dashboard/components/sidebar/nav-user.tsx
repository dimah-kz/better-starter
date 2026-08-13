"use client"

import * as React from "react"
import Link from "next/link"
import { logoutAction } from "@/app/action/dashboard/components/logout-action"
import { NavUserLocaleMenu } from "@/components/locale-switcher"
import { useSidebarFlyoutSide } from "@/app/dashboard/lib/sidebar-side"
import {
  Identity,
  IdentityAvatar,
  IdentityContent,
  IdentityDescription,
  IdentityTitle,
} from "@repo/ui/components/dimah/identity"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@repo/ui/components/sidebar"
import { Switch } from "@repo/ui/components/switch"
import {
  ChevronsUpDownIcon,
  HomeIcon,
  LogOutIcon,
  MoonIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"

export type NavUserProfile = {
  name: string
  email: string
  avatar: string
}

function NavUserThemeItem() {
  const t = useTranslations("common")
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"
  const label = t("darkTheme")

  return (
    <div
      role="group"
      aria-label={label}
      className="relative flex min-h-7 items-center justify-between gap-2 rounded-md px-2 py-1 text-xs/relaxed select-none [&_svg]:size-3.5 [&_svg]:shrink-0"
    >
      <MoonIcon className="pointer-events-none" />
      <span className="flex-1">{label}</span>
      <Switch
        size="sm"
        checked={isDark}
        disabled={!mounted}
        aria-label={label}
        onCheckedChange={(checked) => {
          setTheme(checked ? "dark" : "light")
        }}
      />
    </div>
  )
}

export function NavUser({ user }: { user: NavUserProfile }) {
  const t = useTranslations()
  const { isMobile } = useSidebar()
  const flyoutSide = useSidebarFlyoutSide(isMobile)
  const [isPending, startTransition] = React.useTransition()
  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction()
    })
  }

  const userSummary = (
    <Identity className="w-auto flex-1">
      <IdentityAvatar src={user.avatar} name={user.name} />
      <IdentityContent>
        <IdentityTitle>{user.name}</IdentityTitle>
        <IdentityDescription>{user.email}</IdentityDescription>
      </IdentityContent>
    </Identity>
  )

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            {userSummary}
            <ChevronsUpDownIcon className="ms-auto size-4 opacity-55" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56"
            side={flyoutSide}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="px-1 py-1.5">{userSummary}</div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href="/" />}>
                <HomeIcon />
                {t("common.goHome")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <NavUserThemeItem />
            <DropdownMenuGroup>
              <NavUserLocaleMenu />
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              disabled={isPending}
              onClick={handleLogout}
            >
              <LogOutIcon />
              {isPending ? t("common.signingOut") : t("common.signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
