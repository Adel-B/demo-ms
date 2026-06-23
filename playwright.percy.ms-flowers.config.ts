import { defineConfig } from '@playwright/test';

// Percy-specific config for M&S Flowers — uses system Chrome (no browser download needed)
export default defineConfig({
  testDir: './tests/ms-flowers',
  timeout: 120000,
  retries: 0,
  reporter: [['list']],
  use: {
    channel: 'chrome',
    screenshot: 'only-on-failure',
    navigationTimeout: 90000,
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'windows-chrome',
    },
  ],
});