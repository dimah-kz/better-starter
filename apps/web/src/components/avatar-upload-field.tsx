"use client"

import { useEffect, useRef, useState, type DragEvent } from "react"
import { useRouter } from "next/navigation"
import { CameraIcon, ImagePlusIcon, Trash2Icon, UserIcon } from "lucide-react"
import { AVATAR_ACCEPT, AVATAR_MAX_BYTES } from "@/lib/avatar-storage"
import { useUpload } from "@dimah-s3/react"
import { toast } from "@repo/ui/components/toast"
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/avatar"
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
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState(image)
  const [removing, setRemoving] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

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

  const openFileDialog = () => {
    if (pending) return
    inputRef.current?.click()
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

  const onDragEnter = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (!pending) setIsDragging(true)
  }

  const onDragLeave = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
  }

  const onDragOver = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
    if (!pending) onPick(event.dataTransfer.files)
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
        role={preview ? undefined : "button"}
        tabIndex={preview || pending ? undefined : 0}
        aria-label={preview ? undefined : labels.upload}
        aria-busy={pending}
        className={cn(
          "relative size-full overflow-hidden rounded-full border border-dashed transition-colors",
          !preview && "cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          pending && "pointer-events-none opacity-70"
        )}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={preview ? undefined : openFileDialog}
        onKeyDown={
          preview
            ? undefined
            : (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  openFileDialog()
                }
              }
        }
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
      </div>

      {preview ? (
        <div className="absolute end-0.5 top-0.5 z-10">
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
              {pending ? <Spinner data-icon /> : <CameraIcon data-icon />}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom" sideOffset={6}>
              <DropdownMenuGroup>
                <DropdownMenuItem disabled={pending} onClick={openFileDialog}>
                  <ImagePlusIcon />
                  {labels.upload}
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  disabled={pending}
                  onClick={() => void onRemove()}
                >
                  <Trash2Icon />
                  {labels.remove}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : null}

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
