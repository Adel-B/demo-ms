import { defineConfig, devices } from '@playwright/test';

// Environment-aware timeout tiers — playwright.dev/docs/test-timeouts
// Local: fast feedback | Cloud (BrowserStack): headroom for VM provisioning + network latency
const isCloud = !!process.env.BROWSERSTACK_USERNAME;

export default defineConfig({
  testDir: './tests/ecommerce',
  // Overall per-test safety net — catches infinite loops / hung tests
  timeout: isCloud ? 90_000 : 30_000,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    // Per-action timeout (click, fill, etc.) — playwright.dev/docs/actionability
    actionTimeout: isCloud ? 15_000 : 5_000,
    // Per-navigation timeout (page.goto, page.goBack, etc.)
    navigationTimeout: isCloud ? 30_000 : 15_000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  expect: {
    // Per-assertion timeout (toBeVisible, toHaveText, etc.)
    timeout: isCloud ? 20_000 : 10_000,
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