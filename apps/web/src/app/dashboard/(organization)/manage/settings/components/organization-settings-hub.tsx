"use client"

import { useId, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Trash2Icon } from "lucide-react"
import { deleteOrganizationAction } from "@/app/action/dashboard/(organization)/manage/delete-organization-action"
import { updateOrganizationNameAction } from "@/app/action/dashboard/(organization)/manage/update-organization-name-action"
import { OrganizationProfileFormFields } from "@/app/dashboard/(organization)/manage/settings/components/organization-profile-form-fields"
import type { OrganizationBranding } from "@/app/dashboard/(organization)/manage/lib/get-active-organization-branding"
import { dashboardRoutes } from "@/app/dashboard/lib/dashboard-routes"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/alert-dialog"
import { Button } from "@repo/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card"
import { toast } from "@repo/ui/components/toast"
import { useTranslations } from "next-intl"

type OrganizationSettingsHubProps = {
  organization: OrganizationBranding
  canEdit: boolean
  canDelete: boolean
}

export function OrganizationSettingsHub({
  organization,
  canEdit,
  canDelete,
}: OrganizationSettingsHubProps) {
  const t = useTranslations("dashboard.organizationSettings")
  const tCommon = useTranslations("common")
  const router = useRouter()
  const formId = useId()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isSaving, startSaveTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()

  const handleSave = (formData: FormData) => {
    if (!canEdit) {
      return
    }

    const name = String(formData.get("name") ?? "").trim()
    if (!name) {
      return
    }

    startSaveTransition(async () => {
      const result = await updateOrganizationNameAction({
        organizationId: organization.id,
        name,
      })

      if (!result.success) {
        toast.add({
          title: result.error ?? t("profile.saveFailed"),
          type: "error",
        })
        return
      }

      toast.add({ title: t("profile.saved"), type: "success" })
      router.refresh()
    })
  }

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteOrganizationAction({
        organizationId: organization.id,
      })

      if (!result.success) {
        toast.add({
          title: result.error ?? t("delete.failed"),
          type: "error",
        })
        return
      }

      toast.add({ title: t("delete.deleted"), type: "success" })
      setDeleteOpen(false)
      router.push(result.redirectTo ?? dashboardRoutes.home())
      router.refresh()
    })
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>{t("profile.title")}</CardTitle>
          <CardDescription>{t("profile.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id={formId}
            noValidate
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              handleSave(new FormData(event.currentTarget))
            }}
          >
            <OrganizationProfileFormFields
              formId={formId}
              organization={organization}
              canEdit={canEdit}
            />
          </form>
        </CardContent>
        {canEdit ? (
          <CardFooter>
            <Button type="submit" form={formId} disabled={isSaving}>
              {isSaving ? t("profile.saving") : t("profile.save")}
            </Button>
          </CardFooter>
        ) : null}
      </Card>

      {canDelete ? (
        <div className="flex flex-col gap-3 border-t pt-6">
          <p className="text-sm text-muted-foreground">
            {t("delete.description")}
          </p>
          <Button
            type="button"
            variant="destructive"
            size="lg"
            className="w-full sm:w-fit"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2Icon data-icon="inline-start" />
            {t("delete.title")}
          </Button>

          <AlertDialog
            open={deleteOpen}
            onOpenChange={(open) => {
              if (!open && !isDeleting) {
                setDeleteOpen(false)
              }
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("delete.confirmTitle")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("delete.confirmDescription", { name: organization.name })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  {tCommon("cancel")}
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={handleDelete}
                >
                  {isDeleting ? t("delete.deleting") : t("delete.confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : null}
    </div>
  )
}
