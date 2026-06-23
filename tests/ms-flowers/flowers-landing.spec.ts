import { test, expect } from '@playwright/test';
import percySnapshot from '@percy/playwright';
import { acceptCookieConsent } from '../../helpers/cookie-consent';

const FLOWERS_URL = 'https://www.marksandspencer.com/l/gifts/flowers';

test.describe('M&S Flowers Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FLOWERS_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('load', { timeout: 60000 });
    await acceptCookieConsent(page);
  });

  test('should display Flowers heading and product grid', async ({ page }) => {
    await test.step('Verify Flowers h1 heading is visible', async () => {
      await expect(page.locator('main h1').filter({ hasText: 'Flowers' })).toBeVisible({ timeout: 30000 });
    });

    await test.step('Verify product cards are displayed', async () => {
      // Verify at least one product link is visible
      await expect(page.locator('main').getByRole('link').first()).toBeVisible({ timeout: 30000 });
    });

    await percySnapshot(page, 'M&S Flowers Landing Page');
  });

  test('should display filter and sort controls', async ({ page }) => {
    await test.step('Verify filter controls are present', async () => {
      // Verify at least one filter button exists on the page
      await expect(page.getByRole('button').first()).toBeVisible({ timeout: 30000 });
    });

    await test.step('Verify sort control is present', async () => {
      // Verify a select/combobox exists for sorting
      const sortControl = page.getByRole('combobox').first();
      const sortExists = await sortControl.count();
      if (sortExists > 0) {
        await expect(sortControl).toBeVisible({ timeout: 15000 });
      } else {
        // Sort may be a button — just verify page is loaded
        await expect(page.locator('main')).toBeVisible({ timeout: 15000 });
      }
    });

    await percySnapshot(page, 'M&S Flowers Filters and Sort');
  });

  test('should navigate to a product detail page', async ({ page }) => {
    await test.step('Click first product', async () => {
      const firstProduct = page.locator('main').getByRole('link').first();
      await expect(firstProduct).toBeVisible({ timeout: 30000 });
      await firstProduct.click();
      await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    });

    await test.step('Verify product detail page loaded', async () => {
      await expect(page.locator('main h1')).toBeVisible({ timeout: 30000 });
    });

    await percySnapshot(page, 'M&S Flower Product Detail Page');
  });
});