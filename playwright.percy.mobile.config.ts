import { defineConfig } from '@playwright/test';

// Percy mobile viewport config — 375px width triggers visual diffs vs 1280px desktop baseline
// Only runs homepage and product-browsing tests (nav-category tests skip on mobile)
export default defineConfig({
  testDir: './tests/ecommerce',
  testMatch: ['**/homepage.spec.ts', '**/product-browsing.spec.ts'],
  timeout: 60000,
  retries: 0,
  reporter: [['list']],
  use: {
    channel: 'chrome',
    screenshot: 'only-on-failure',
    navigationTimeout: 60000,
    viewport: { width: 375, height: 812 },
  },
  projects: [
    {
      name: 'samsung-mobile',
    },
  ],
});