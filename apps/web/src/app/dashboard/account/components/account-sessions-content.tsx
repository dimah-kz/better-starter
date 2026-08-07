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
import type { SessionDeviceDisplay } from "@/app/dashboard/account/lib/format-session-device"
import { toast } from "@workspace/ui/components/toast"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@workspace/ui/components/item"
import { useTranslations } from "next-intl"

export type AccountSessionDisplay = {
  id: string
  token: string
  device: SessionDeviceDisplay
  signedInLabel: string
  signedInTitle: string
  expiresLabel: string
  ipLabel: string | null
}

type AccountSessionsContentProps = {
  sessions: AccountSessionDisplay[]
  currentSessionToken: string
  disabled?: boolean
}

export function AccountSessionsContent({
  sessions,
  currentSessionToken,
  disabled = false,
}: AccountSessionsContentProps) {
  const t = useTranslations("account.sessions")
  const router = useRouter()
  const [pendingToken, setPendingToken] = useState<string | null>(null)
  const [isRevoking, startRevoke] = useTransition()

  const handleRevoke = (token: string) => {
    setPendingToken(token)
    startRevoke(async () => {
      const result = await revokeSessionAction({ token })
      setPendingToken(null)
      if (!result.success) {
        toast.add({
          title: result.error ?? "Could not revoke session.",
          type: "error",
        })
        return
      }
      toast.add({ title: "Session revoked.", type: "success" })
      router.refresh()
    })
  }

  if (!sessions.length) {
    return <p className="text-sm text-muted-foreground">{t("empty")}</p>
  }

  const onlyCurrentDevice =
    sessions.length === 1 && sessions[0]?.token === currentSessionToken

  return (
    <div className="space-y-3">
      <ItemGroup className="gap-0" role="list">
        {sessions.map((session, index) => {
          const isCurrent = session.token === currentSessionToken
          const isPending = pendingToken === session.token && isRevoking

          return (
            <Fragment key={session.id}>
              {index > 0 ? <ItemSeparator /> : null}
              <article
                role="listitem"
                className="flex w-full items-start gap-2.5 py-3"
              >
                <SessionDeviceIcon kind={session.device.kind} />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <ItemTitle className="text-sm">
                        {session.device.title}
                      </ItemTitle>
                      {session.device.subtitle ? (
                        <ItemDescription className="text-sm">
                          {session.device.subtitle}
                        </ItemDescription>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 items-center justify-end">
                      {isCurrent ? (
                        <Badge variant="secondary" className="font-normal">
                          {t("currentDevice")}
                        </Badge>
                      ) : (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          disabled={disabled || isPending}
                          onClick={() => handleRevoke(session.token)}
                        >
                          {isPending ? t("revoking") : t("revoke")}
                        </Button>
                      )}
                    </div>
                  </div>
                  <SessionMetaList session={session} />
                </div>
              </article>
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

function SessionMetaList({ session }: { session: AccountSessionDisplay }) {
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

function SessionDeviceIcon({ kind }: { kind: SessionDeviceDisplay["kind"] }) {
  const className = "mt-0.5 size-4 shrink-0 text-muted-foreground"

  switch (kind) {
    case "mobile":
      return <SmartphoneIcon className={className} aria-hidden />
    case "tablet":
      return <TabletIcon className={className} aria-hidden />
    case "desktop":
      return <MonitorIcon className={className} aria-hidden />
    default:
      return <LaptopIcon className={className} aria-hidden />
  }
}
