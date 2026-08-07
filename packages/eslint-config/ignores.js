/** Build artifacts and generated files — shared by all ESLint configs. */
export const ignorePatterns = [
  "**/node_modules/**",
  "**/dist/**",
  "**/.next/**",
  "**/out/**",
  "**/build/**",
  "**/.turbo/**",
  "**/coverage/**",
  "**/next-env.d.ts",
]

/** @type {import("eslint").Linter.Config} */
export const globalIgnores = {
  ignores: ignorePatterns,
}
