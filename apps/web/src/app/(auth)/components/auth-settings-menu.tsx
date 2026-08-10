"use client"

import * as React from "react"
import Link from "next/link"
import { NavUserLocaleMenu } from "@/components/locale-switcher"
import { Button } from "@repo/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu"
import { Switch } from "@repo/ui/components/switch"
import { HomeIcon, MoonIcon, SettingsIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"

function AuthThemeItem() {
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

export function AuthSettingsMenu() {
  const t = useTranslations("common")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="border-0 bg-card/60 shadow-none ring-0 backdrop-blur-xl"
            aria-label={t("settings")}
          />
        }
      >
        <SettingsIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={4} className="min-w-56">
        <AuthThemeItem />
        <DropdownMenuGroup>
          <NavUserLocaleMenu />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/" />}>
          <HomeIcon />
          {t("goHome")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
