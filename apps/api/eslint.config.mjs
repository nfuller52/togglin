import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import eslintPluginPromise from "eslint-plugin-promise";
import eslintPluginSecurity from "eslint-plugin-security";
import tsdoc from "eslint-plugin-tsdoc";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      promise: eslintPluginPromise,
      security: eslintPluginSecurity,
      tsdoc,
      "unused-imports": unusedImports,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...eslintPluginPromise.configs.recommended.rules,
      ...eslintPluginSecurity.configs.recommended.rules,
      "tsdoc/syntax": "warn",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  prettier,
];
