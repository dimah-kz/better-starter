import {
  dateOnlyOptions,
  dateTimeOptions,
  formatDate as formatDateBase,
  type Locale,
} from "@repo/i18n"

export { dateOnlyOptions, dateTimeOptions }

export function formatDate(
  value: string,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = dateOnlyOptions
) {
  return formatDateBase(value, locale, options)
}
