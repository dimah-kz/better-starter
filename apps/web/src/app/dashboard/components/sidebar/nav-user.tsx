"use client"

import * as React from "react"
import Link from "next/link"
import { logoutAction } from "@/app/action/dashboard/components/logout-action"
import { NavUserLocaleMenu } from "@/components/locale-switcher"
import { useSidebarFlyoutSide } from "@/app/dashboard/lib/sidebar-side"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import { Switch } from "@workspace/ui/components/switch"
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
    <>
      <Avatar>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.name[0]?.toUpperCase() ?? "?"}</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-start text-sm leading-tight">
        <span className="truncate font-medium">{user.name}</span>
        <span className="truncate text-xs">{user.email}</span>
      </div>
    </>
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
                <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                  {userSummary}
                </div>
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
