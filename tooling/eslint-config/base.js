import js from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import turboPlugin from "eslint-plugin-turbo"
import tseslint from "typescript-eslint"

import { globalIgnores } from "./ignores.js"

/** @type {import("eslint").Linter.Config[]} */
export const baseConfig = [
  globalIgnores,
  js.configs.recommended,
  ...tseslint.configs.recommended,
  turboPlugin.configs["flat/recommended"],
  {
    name: "repo/overrides",
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
]

/** @type {import("eslint").Linter.Config} */
export const prettierConfig = eslintConfigPrettier

/** @type {import("eslint").Linter.Config[]} */
export const config = [...baseConfig, prettierConfig]
