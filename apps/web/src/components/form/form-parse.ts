export function getFormString(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === "string" ? value.trim() : ""
}
