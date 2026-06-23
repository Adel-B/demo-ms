import { defineConfig } from '@playwright/test';

// Percy-specific config — uses system Chrome (no browser download needed)
export default defineConfig({
  testDir: './tests/ecommerce',
  timeout: 60000,
  retries: 0,
  reporter: [['list']],
  use: {
    channel: 'chrome',
    screenshot: 'only-on-failure',
    navigationTimeout: 60000,
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'windows-chrome',
    },
  ],
});