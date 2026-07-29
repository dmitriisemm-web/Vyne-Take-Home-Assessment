import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import path from 'node:path';
import baseConfig from '../../../playwright.config';

const saucedemoConfig: PlaywrightTestConfig = {
  ...baseConfig,
  testDir: path.resolve(__dirname, 'tests'),

  use: {
    ...baseConfig.use,
    baseURL: 'https://www.saucedemo.com',

    /* Matches this app's data-test attributes, so page.getByTestId() works out of the box. */
    testIdAttribute: 'data-test'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
};

export default saucedemoConfig;
