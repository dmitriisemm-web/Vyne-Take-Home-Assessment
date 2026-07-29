import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import eslintConfigPrettier from 'eslint-config-prettier';
import local from './eslint-rules/index.mjs';

export default tseslint.config(
  {
    ignores: ['node_modules/**', 'playwright-report/**', 'test-results/**', '.yarn/**']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      playwright,
      local
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-expressions': 'off',

      // Playwright rules
      'playwright/missing-playwright-await': 'error',
      'playwright/no-commented-out-tests': 'error',
      'playwright/no-duplicate-hooks': 'error',
      'playwright/no-element-handle': 'error',
      'playwright/no-eval': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/no-force-option': 'error',
      'playwright/no-page-pause': 'error',
      'playwright/no-skipped-test': 'error',
      'playwright/no-standalone-expect': 'error',
      'playwright/no-useless-await': 'error',
      'playwright/no-wait-for-timeout': 'error',
      'playwright/prefer-web-first-assertions': 'error',
      'playwright/valid-expect': 'error',
      'playwright/valid-title': [
        'error',
        {
          mustMatch: {
            test: ['^(Verify|Check)', 'Test title must start with "Verify" or "Check"']
          }
        }
      ],
      'playwright/no-useless-not': 'warn',
      'playwright/prefer-to-contain': 'warn',
      'playwright/prefer-to-have-length': 'warn',
      'playwright/prefer-to-have-count': 'warn',
      'playwright/prefer-comparison-matcher': 'warn',
      'playwright/prefer-equality-matcher': 'warn',

      // Local rules
      'local/no-selectors-outside-file': 'error',
      'local/no-xpath-selectors': 'error',

      // Regular rules
      'no-unused-vars': 'off',
      'no-empty-function': 'off',
      'no-undef': 'off',
      'quotes': ['error', 'single', { avoidEscape: true }],
      'linebreak-style': ['error', 'unix'],
      'no-case-declarations': 'off',
      'no-useless-escape': 'off',
      'no-console': ['error', { allow: ['info', 'warn', 'error'] }]
    }
  },
  eslintConfigPrettier
);
