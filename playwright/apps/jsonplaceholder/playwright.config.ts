import { defineConfig } from '@playwright/test';
import baseConfig from '../../base.config';

export default defineConfig(baseConfig, {
  testDir: './tests',
  reporter: [['html', { outputFolder: '../../../playwright-report/jsonplaceholder', open: 'never' }]],
  outputDir: '../../../test-results/jsonplaceholder',

  use: {
    baseURL: 'https://jsonplaceholder.typicode.com'
  },

  /*
   * A single project with no `devices`/`browserName` in `use`. These are
   * pure API tests driven by the `request` fixture (APIRequestContext), so
   * there is nothing here for Playwright to launch a browser for - as long
   * as tests only consume `request` and never `page`/`context`, no browser
   * ever starts.
   */
  projects: [{ name: 'api' }]
});
