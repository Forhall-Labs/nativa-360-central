// @ts-check
import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintPluginSecurity from "eslint-plugin-security";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["eslint.config.mjs", "src/prisma/contract.d.ts", "src/prisma/contract.json"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintPluginSecurity.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: "module",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
      // NestJS modules/controllers are legitimately decorator-only classes.
      "@typescript-eslint/no-extraneous-class": "off",
      "security/detect-object-injection": "off",
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  {
    // Nest's testing utilities (getHttpServer(), supertest's App type) have a
    // known typing gap upstream — relax unsafe-* checks for test glue code only.
    files: ["test/**/*.ts", "**/*.spec.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-argument": "off",
    },
  },
);
