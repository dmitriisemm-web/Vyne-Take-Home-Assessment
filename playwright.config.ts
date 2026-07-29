import type { PlaywrightTestConfig } from '@playwright/test';
import path from 'node:path';
import { TIMEOUT } from './playwright/common/constants';

/**
 * Shared base config every app under playwright/apps/ spreads into its own
 * playwright.config.ts (e.g. { ...baseConfig, testDir: ..., use: {...} }).
 * outputDir/reporter point at the repo root so all apps' results land in
 * one place, not nested inside each app's own folder.
 */
const baseConfig: PlaywrightTestConfig = {
  name: 'Base config',
  timeout: TIMEOUT.THIRTY_SECONDS,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  outputDir: path.resolve(__dirname, 'test-results'),
  reporter: [['html', { outputFolder: path.resolve(__dirname, 'playwright-report'), open: 'never' }]],
  use: {
    actionTimeout: TIMEOUT.FIFTEEN_SECONDS,
    trace: 'on',
    screenshot: 'on',
    video: 'on'
  }
};

export default baseConfig;
