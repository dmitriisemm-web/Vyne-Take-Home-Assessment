import type { PlaywrightTestConfig } from '@playwright/test';

/**
 * Shared Playwright settings for every app. Each app under playwright/apps/
 * has its own playwright.config.ts that extends this via
 * defineConfig(createBaseConfig('<appName>'), { ...app-specific overrides }).
 *
 * testDir/reporter/outputDir are common in shape but need the app's own
 * name, so this is a function rather than a plain config object.
 */
export function createBaseConfig(appName: string): PlaywrightTestConfig {
  return {
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [['html', { outputFolder: `../../../playwright-report/${appName}`, open: 'never' }]],
    outputDir: `../../../test-results/${appName}`,
    use: {
      trace: 'on-first-retry'
    }
  };
}
