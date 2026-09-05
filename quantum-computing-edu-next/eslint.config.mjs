import nextPlugin from "@next/eslint-plugin-next";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import tseslint from "typescript-eslint";

export default [
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {},
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "public/**",
      "next-env.d.ts",
    ],
  },
];
