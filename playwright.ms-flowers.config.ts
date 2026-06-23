import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/ms-flowers',
  timeout: 120000,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    navigationTimeout: 90000,
  },
  projects: [
    {
      name: 'windows-chrome',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});