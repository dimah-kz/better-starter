import type { Translations } from "@dimah-s3/react"

/**
 * Persian strings for dimah-s3 UI/API messages.
 * Keys match English source + context note — see `Translations` in `@dimah-s3/react`.
 */
export const fa = {
  '"{name}" deleted(status)': "«{name}» حذف شد",
  "Access denied(API error)": "دسترسی غیرمجاز",
  "All {count} file(s) uploaded(status)": "هر {count} فایل آپلود شد",
  'Are you sure you want to delete "{name}"? This action cannot be undone.(dialog description)':
    "آیا مطمئن هستید که می‌خواهید «{name}» را حذف کنید؟ این عمل قابل بازگشت نیست.",
  "Bucket is not allowed(API error)": "باکت مجاز نیست",
  "Cancel download(tooltip)": "لغو دانلود",
  "Cancel(dialog button)": "لغو",
  "Cancel(toast action)": "لغو",
  "Cancel(upload control)": "لغو",
  "Conflict(API error)": "تداخل",
  "Could not reach storage ({code})(API error)":
    "اتصال به ذخیره‌سازی برقرار نشد ({code})",
  "Delete failed(status)": "حذف ناموفق بود",
  "Delete failed(toast)": "حذف ناموفق بود",
  "Delete file(tooltip)": "حذف فایل",
  "Delete file?(dialog title)": "فایل حذف شود؟",
  "Delete(button)": "حذف",
  "Delete(dialog confirm)": "حذف",
  "Download cancelled(toast)": "دانلود لغو شد",
  "Download complete(toast)": "دانلود کامل شد",
  "Download failed(status)": "دانلود ناموفق بود",
  "Download failed(toast)": "دانلود ناموفق بود",
  "Download file(tooltip)": "دانلود فایل",
  "Download started(toast)": "دانلود آغاز شد",
  "Download(button)": "دانلود",
  "Drag and drop files here(dropzone)": "فایل‌ها را اینجا بکشید و رها کنید",
  "File deleted(toast)": "فایل حذف شد",
  "File is empty(file validation)": "فایل خالی است",
  "File not accepted(toast)": "فایل پذیرفته نشد",
  "File not found(API error)": "فایل یافت نشد",
  "File size exceeds {size} limit(file validation)":
    "حجم فایل از حد {size} بیشتر است",
  "File size is required(multipart)": "حجم فایل الزامی است",
  "File size is required(upload)": "حجم فایل الزامی است",
  'File type "{type}" is not allowed(file validation)':
    "نوع فایل «{type}» مجاز نیست",
  "Invalid request(API error)": "درخواست نامعتبر",
  "Not found(API error)": "یافت نشد",
  "Object key is invalid(API error)": "کلید شیء نامعتبر است",
  "Pause(upload control)": "مکث",
  "Preparing…(upload status)": "در حال آماده‌سازی…",
  "Something went wrong(API error)": "خطای داخلی سرور",
  "Unauthorized(API error)": "احراز هویت نشده",
  "Unknown error(fallback)": "خطای ناشناخته",
  "Upload complete(toast)": "آپلود کامل شد",
  "Upload failed(status)": "آپلود ناموفق بود",
  "Upload failed(toast)": "آپلود ناموفق بود",
  "Upload file(button)": "آپلود فایل",
  "Upload files(button)": "آپلود فایل‌ها",
  "Upload finished with errors(toast)": "آپلود با خطا پایان یافت",
  "Uploading {done}/{total}(toast)": "در حال آپلود {done}/{total}",
  "Uploading(toast)": "در حال آپلود",
  "Validating…(upload status)": "در حال اعتبارسنجی…",
  "{count} file(s) uploaded(toast)": "{count} فایل آپلود شد",
  "{done}/{total} files(upload progress)": "{done}/{total} فایل",
  "{feature} is disabled(API error)": "{feature} غیرفعال است",
  "{succeeded} succeeded, {failed} failed(toast)":
    "{succeeded} موفق، {failed} ناموفق",
} satisfies Partial<Translations>
