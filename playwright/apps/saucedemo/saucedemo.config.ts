import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import path from 'node:path';
import baseConfig from '../../../playwright.config';

const saucedemoConfig: PlaywrightTestConfig = {
  ...baseConfig,
  name: 'SauceDemo config',
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
      use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], viewport: { width: 1920, height: 1080 } }
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 15 Pro'] }
    }
  ]
};

export default saucedemoConfig;
