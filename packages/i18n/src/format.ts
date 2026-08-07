import type { Locale } from "./config"

export const dateOnlyOptions: Intl.DateTimeFormatOptions = {
  dateStyle: "medium",
}

export const dateTimeOptions: Intl.DateTimeFormatOptions = {
  dateStyle: "medium",
  timeStyle: "short",
}

export function formatDate(
  value: string | number | Date,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = dateOnlyOptions
) {
  return new Intl.DateTimeFormat(locale, options).format(new Date(value))
}

export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
) {
  return new Intl.NumberFormat(locale, options).format(value)
}
