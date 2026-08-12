"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { UserIcon, XIcon } from "lucide-react"
import { AVATAR_ACCEPT, AVATAR_MAX_BYTES } from "@/lib/avatar-storage"
import { useUpload } from "@dimah-s3/react"
import { toast } from "@repo/ui/components/toast"
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/avatar"
import { Button } from "@repo/ui/components/button"
import { Spinner } from "@repo/ui/components/spinner"
import { cn } from "@repo/ui/lib/utils"

export type AvatarUploadLabels = {
  upload: string
  remove: string
  updated: string
  removed: string
  uploadFailed: string
}

type SetAvatarResult = { error: string } | { imageUrl: string }
type RemoveAvatarResult = { error: string } | { success: true }

type AvatarUploadFieldProps = {
  name: string
  image: string | null
  toKey: (fileName: string) => string
  setAction: (key: string) => Promise<SetAvatarResult>
  removeAction: () => Promise<RemoveAvatarResult>
  labels: AvatarUploadLabels
  className?: string
  compact?: boolean
}

export function AvatarUploadField({
  name,
  image,
  toKey,
  setAction,
  removeAction,
  labels,
  className,
  compact = false,
}: AvatarUploadFieldProps) {
  const router = useRouter()
  const [preview, setPreview] = useState(image)
  const [removing, setRemoving] = useState(false)

  useEffect(() => {
    setPreview(image)
  }, [image])

  const { phase, getRootProps, getInputProps, isDragActive } = useUpload({
    accept: [...AVATAR_ACCEPT],
    maxFileSize: AVATAR_MAX_BYTES,
    objectKey: (file) => toKey(file.name),
    uploadOptions: { acl: "public-read" },
    disabled: Boolean(preview) || removing,
    onSuccess: async (_file, result) => {
      const outcome = await setAction(result.key)
      if ("error" in outcome) {
        toast.add({ title: outcome.error, type: "error" })
        return
      }
      setPreview(outcome.imageUrl)
      router.refresh()
      toast.add({ title: labels.updated, type: "success" })
    },
    onError: (_file, error) => {
      toast.add({
        title: error instanceof Error ? error.message : labels.uploadFailed,
        type: "error",
      })
    },
    onFileReject: () => {
      toast.add({ title: labels.uploadFailed, type: "error" })
    },
  })

  const pending =
    (phase !== "idle" && phase !== "success" && phase !== "error") || removing
  const canUpload = !preview && !pending

  const onRemove = async () => {
    setRemoving(true)
    try {
      const outcome = await removeAction()
      if ("error" in outcome) {
        toast.add({ title: outcome.error, type: "error" })
        return
      }
      setPreview(null)
      router.refresh()
      toast.add({ title: labels.removed, type: "success" })
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div
      className={cn(
        "relative shrink-0",
        compact ? "size-16" : "size-24",
        className
      )}
    >
      <div
        {...getRootProps({
          role: canUpload ? "button" : undefined,
          "aria-label": canUpload ? labels.upload : undefined,
          "aria-busy": pending,
          className: cn(
            "relative size-full overflow-hidden rounded-full border border-dashed transition-colors",
            canUpload && "cursor-pointer",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
            pending && "pointer-events-none opacity-70"
          ),
        })}
      >
        <Avatar className="size-full after:hidden">
          {preview ? <AvatarImage src={preview} alt={name} /> : null}
          <AvatarFallback className="bg-transparent">
            <UserIcon className="size-6 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>

        {pending ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <Spinner className="size-5" />
          </div>
        ) : null}

        <input {...getInputProps()} />
      </div>

      {preview && !pending ? (
        <Button
          type="button"
          size="icon-xs"
          variant="secondary"
          onClick={() => void onRemove()}
          className="absolute end-0.5 top-0.5 z-10 rounded-full"
          aria-label={labels.remove}
        >
          <XIcon className="size-3.5" />
        </Button>
      ) : null}
    </div>
  )
}
