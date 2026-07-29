import { defineConfig, devices } from '@playwright/test';
import baseConfig from '../../base.config';

export default defineConfig(baseConfig, {
  testDir: './tests',
  reporter: [['html', { outputFolder: '../../../playwright-report/saucedemo', open: 'never' }]],
  outputDir: '../../../test-results/saucedemo',

  use: {
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
});
