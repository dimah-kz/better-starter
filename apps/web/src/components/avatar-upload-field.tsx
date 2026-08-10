"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { CameraIcon, ImagePlusIcon, Trash2Icon } from "lucide-react"
import { AVATAR_ACCEPT, AVATAR_MAX_BYTES } from "@/lib/avatar-storage"
import { useUpload } from "@dimah-s3/react"
import { toast } from "@repo/ui/components/toast"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar"
import { Button } from "@repo/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu"
import { Spinner } from "@repo/ui/components/spinner"
import { cn } from "@repo/ui/lib/utils"

export type AvatarUploadLabels = {
  change: string
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
  fallbackClassName?: string
  size?: "default" | "sm" | "lg"
}

export function AvatarUploadField({
  name,
  image,
  toKey,
  setAction,
  removeAction,
  labels,
  className,
  fallbackClassName,
  size,
}: AvatarUploadFieldProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState(image)
  const [removing, setRemoving] = useState(false)

  useEffect(() => {
    setPreview(image)
  }, [image])

  const { upload, phase } = useUpload({
    accept: [...AVATAR_ACCEPT],
    maxFileSize: AVATAR_MAX_BYTES,
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
  })

  const busy = phase !== "idle" && phase !== "success" && phase !== "error"
  const pending = busy || removing

  const onPick = (fileList: FileList | null) => {
    const file = fileList?.[0]
    if (!file) return
    void upload(file, toKey(file.name), { acl: "public-read" })
    if (inputRef.current) inputRef.current.value = ""
  }

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
    <div className={cn("relative shrink-0", className ?? "size-16")}>
      <Avatar className="size-full" size={size}>
        {preview ? <AvatarImage src={preview} alt={name} /> : null}
        <AvatarFallback className={cn(fallbackClassName)}>
          {name[0]?.toUpperCase() ?? "?"}
        </AvatarFallback>
      </Avatar>

      <div className="absolute inset-e-0 bottom-0 z-10 translate-x-1/4 translate-y-1/4">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                size="icon-xs"
                variant="secondary"
                disabled={pending}
                className="rounded-full border border-background shadow-sm"
                aria-label={labels.change}
              />
            }
          >
            {pending ? (
              <Spinner data-icon />
            ) : preview ? (
              <CameraIcon data-icon />
            ) : (
              <ImagePlusIcon data-icon />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom" sideOffset={6}>
            <DropdownMenuGroup>
              <DropdownMenuItem
                disabled={pending}
                onClick={() => inputRef.current?.click()}
              >
                <ImagePlusIcon />
                {labels.upload}
              </DropdownMenuItem>
              {preview ? (
                <DropdownMenuItem
                  variant="destructive"
                  disabled={pending}
                  onClick={() => void onRemove()}
                >
                  <Trash2Icon />
                  {labels.remove}
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={AVATAR_ACCEPT.join(",")}
        className="sr-only"
        onChange={(event) => onPick(event.target.files)}
      />
    </div>
  )
}
