// eslint.config.mjs
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';
import eslintRecommended from '@eslint/js';
import tsParser from '@typescript-eslint/parser'; // <-- import parser

const compat = new FlatCompat({
  baseDirectory: process.cwd(),
  recommendedConfig: eslintRecommended.configs.recommended,
});

export default [
  ...compat.extends('eslint:recommended'),
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  ...compat.extends('plugin:prettier/recommended'),

  {
    ignores: ['eslint.config.mjs', 'dist/**/*'],
    languageOptions: {
      parser: tsParser, // <-- use imported parser object
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
        ecmaVersion: 2020,
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
];
