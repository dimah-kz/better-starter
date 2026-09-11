import pluginReact from "eslint-plugin-react"
import pluginReactHooks from "eslint-plugin-react-hooks"
import globals from "globals"

import { baseConfig, prettierConfig } from "./base.js"

/** @type {import("eslint").Linter.Config[]} */
export const reactConfig = [
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    name: "repo/react-overrides",
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    // Pin version — `detect` still uses ESLint APIs removed in v10.
    settings: { react: { version: "19" } },
    rules: {
      "react/prop-types": "off",
    },
  },
  pluginReactHooks.configs.flat.recommended,
  {
    name: "repo/react-hooks-overrides",
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    name: "repo/node-scripts",
    files: ["scripts/**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.node,
    },
  },
]

/** @type {import("eslint").Linter.Config[]} */
export const config = [...baseConfig, ...reactConfig, prettierConfig]
