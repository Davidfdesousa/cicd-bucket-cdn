import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import lit from 'eslint-plugin-lit';
import wc from 'eslint-plugin-wc';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import type { Linter } from 'eslint';

// Both plugins type `configs` loosely (legacy + flat); narrow to the flat presets we use.
const wcRecommended = wc.configs!['flat/recommended'] as Linter.Config;
const litRecommended = lit.configs!['flat/recommended'] as Linter.Config;

export default defineConfig(
  globalIgnores(['dist', 'coverage', 'node_modules', 'CHANGELOG.md']),
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      wcRecommended,
      litRecommended,
    ],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      // Lit binds `this` to the host for listeners declared in templates (@click=${this.handler}).
      '@typescript-eslint/unbound-method': 'off',
      'wc/guard-super-call': 'off',
    },
  },
  {
    files: ['*.config.ts'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['**/*.test.ts', 'src/test/**'],
    rules: {
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
  prettier,
);
