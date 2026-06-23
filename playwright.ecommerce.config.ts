import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/ecommerce',
  timeout: 60000,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    navigationTimeout: 60000,
  },
  projects: [
    {
      name: 'windows-chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'osx-chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'samsung-mobile',
      use: { ...devices['Galaxy S9+'] },
    },
  ],
});