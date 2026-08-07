"use client"

import type { AdminOrganizationItem } from "@/app/dashboard/admin/organizations/lib/get-admin-organizations-page"
import { adminOrganizationsTablePath } from "@/app/dashboard/admin/organizations/lib/admin-organizations-table-params"
import { List, useList } from "@/components/list"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { formatDate } from "@/lib/format-date"
import { useLocale, useTranslations } from "next-intl"

type AdminOrganizationsTableProps = {
  organizations: AdminOrganizationItem[]
  page: number
  pageSize: number
  totalCount: number
  q?: string
}

function organizationInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function AdminOrganizationsTable({
  organizations,
  page,
  pageSize,
  totalCount,
  q,
}: AdminOrganizationsTableProps) {
  const locale = useLocale()
  const t = useTranslations()

  const list = useList({
    buildPath: adminOrganizationsTablePath,
    page,
    pageSize,
    totalCount,
    q,
    countLabel: "organization",
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("dashboard.adminTabs.organizations")}</CardTitle>
        <CardAction className="w-full sm:w-auto">
          <List.Search
            value={q}
            placeholder={t("tables.search.organizations")}
            buildPath={list.buildSearchPath}
          />
        </CardAction>
      </CardHeader>

      <CardContent className="min-w-0">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-0 whitespace-normal">
                Organization
              </TableHead>
              <TableHead className="hidden min-w-0 whitespace-normal sm:table-cell">
                Slug
              </TableHead>
              <TableHead className="whitespace-normal">Members</TableHead>
              <TableHead className="hidden whitespace-normal lg:table-cell">
                Created
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.length ? (
              organizations.map((organization) => (
                <TableRow key={organization.id}>
                  <TableCell className="min-w-0 whitespace-normal">
                    <div className="flex min-w-0 items-center gap-2">
                      <Avatar size="sm" className="shrink-0">
                        {organization.logo ? (
                          <AvatarImage src={organization.logo} alt="" />
                        ) : null}
                        <AvatarFallback>
                          {organizationInitials(organization.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className="block truncate font-medium"
                        title={organization.name}
                      >
                        {organization.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden min-w-0 whitespace-normal text-muted-foreground sm:table-cell">
                    <span className="block truncate" title={organization.slug}>
                      {organization.slug}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    {organization.memberCount}
                  </TableCell>
                  <TableCell className="hidden whitespace-normal lg:table-cell">
                    {formatDate(organization.createdAt, locale)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <List.Empty colSpan={4}>No organizations found.</List.Empty>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="justify-between gap-2">
        <List.Footer pagination={list.pagination} />
      </CardFooter>
    </Card>
  )
}
