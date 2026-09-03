"use client"

import { Fragment, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  LaptopIcon,
  MonitorIcon,
  SmartphoneIcon,
  TabletIcon,
} from "lucide-react"
import { revokeSessionAction } from "@/app/action/dashboard/account/revoke-session-action"
import type {
  AccountSession,
  AccountSessionDeviceKind,
} from "@/app/dashboard/account/lib/get-account-sessions"
import { toast } from "@repo/ui/components/toast"
import { Badge } from "@repo/ui/components/badge"
import { Button } from "@repo/ui/components/button"
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@repo/ui/components/item"
import { IconTile } from "@repo/ui/components/reui/icon-tile"
import { useTranslations } from "next-intl"

type AccountSessionsContentProps = {
  sessions: AccountSession[]
  disabled?: boolean
}

export function AccountSessionsContent({
  sessions,
  disabled = false,
}: AccountSessionsContentProps) {
  const t = useTranslations("account.sessions")
  const router = useRouter()
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null)
  const [isRevoking, startRevoke] = useTransition()

  const handleRevoke = (sessionId: string) => {
    setPendingSessionId(sessionId)
    startRevoke(async () => {
      const result = await revokeSessionAction(sessionId)
      setPendingSessionId(null)
      if (!result.success) {
        toast.add({
          title: result.error ?? t("revokeFailed"),
          type: "error",
        })
        return
      }
      toast.add({ title: t("revoked"), type: "success" })
      router.refresh()
    })
  }

  if (!sessions.length) {
    return <p className="text-sm text-muted-foreground">{t("empty")}</p>
  }

  const onlyCurrentDevice =
    sessions.length === 1 && sessions[0]?.isCurrent === true

  return (
    <div className="flex flex-col gap-3">
      <ItemGroup className="gap-0">
        {sessions.map((session, index) => {
          const isPending = pendingSessionId === session.id && isRevoking

          return (
            <Fragment key={session.id}>
              {index > 0 ? <ItemSeparator /> : null}
              <Item className="items-start py-3" role="listitem">
                <ItemMedia>
                  <SessionDeviceIcon kind={session.kind} />
                </ItemMedia>
                <ItemContent className="min-w-0 gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <ItemTitle className="text-sm">{session.title}</ItemTitle>
                    {session.isCurrent ? (
                      <Badge variant="secondary" className="font-normal">
                        {t("currentDevice")}
                      </Badge>
                    ) : (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={disabled || isPending}
                        onClick={() => handleRevoke(session.id)}
                      >
                        {isPending ? t("revoking") : t("revoke")}
                      </Button>
                    )}
                  </div>
                  <SessionMetaList session={session} />
                </ItemContent>
              </Item>
            </Fragment>
          )
        })}
      </ItemGroup>
      {onlyCurrentDevice ? (
        <p className="text-sm text-muted-foreground">{t("onlyThisDevice")}</p>
      ) : null}
    </div>
  )
}

function SessionMetaList({ session }: { session: AccountSession }) {
  const t = useTranslations("account.sessions")
  const rows: { label: string; value: string; title?: string }[] = [
    {
      label: t("signedIn"),
      value: session.signedInLabel,
      title: session.signedInTitle,
    },
    { label: t("expires"), value: session.expiresLabel },
  ]

  if (session.ipLabel) {
    rows.push({ label: t("ip"), value: session.ipLabel })
  }

  return (
    <dl className="grid w-full grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-xs">
      {rows.map((row) => (
        <Fragment key={row.label}>
          <dt className="text-muted-foreground">{row.label}</dt>
          <dd
            className="min-w-0 truncate text-end text-foreground tabular-nums"
            title={row.title ?? row.value}
          >
            {row.value}
          </dd>
        </Fragment>
      ))}
    </dl>
  )
}

function SessionDeviceIcon({ kind }: { kind: AccountSessionDeviceKind }) {
  const Icon =
    kind === "mobile"
      ? SmartphoneIcon
      : kind === "tablet"
        ? TabletIcon
        : kind === "desktop"
          ? MonitorIcon
          : LaptopIcon

  return (
    <IconTile variant="outline" size="sm">
      <Icon aria-hidden />
    </IconTile>
  )
}
