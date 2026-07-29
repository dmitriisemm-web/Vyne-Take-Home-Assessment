import type { PlaywrightTestConfig } from '@playwright/test';
import path from 'node:path';
import baseConfig from '../../../playwright.config';

const jsonplaceholderConfig: PlaywrightTestConfig = {
  ...baseConfig,
  name: 'JSONPlaceholder config',
  testDir: path.resolve(__dirname, 'tests'),

  use: {
    ...baseConfig.use,
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
};

export default jsonplaceholderConfig;
