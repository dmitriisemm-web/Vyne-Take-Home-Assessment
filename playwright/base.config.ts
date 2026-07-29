import { defineConfig } from '@playwright/test';

/**
 * Shared Playwright settings for every app. Each app under playwright/apps/
 * has its own playwright.config.ts that extends this via
 * defineConfig(baseConfig, { ...app-specific overrides }).
 */
export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    trace: 'on-first-retry'
  }
});
