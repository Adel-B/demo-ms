import { test, expect } from '@playwright/test';
import { EcommerceHomePage } from '../../pages/ecommerce/EcommerceHomePage';

test.describe('Product Browsing', () => {
  test('should display product listing with images', async ({ page }) => {
    test.skip(test.info().project.name === 'samsung-mobile', 'Mobile nav uses hamburger menu');
    const home = new EcommerceHomePage(page);

    await test.step('Navigate to Men category', async () => {
      await home.goto();
      await home.clickNavCategory('Men');
    });

    await test.step('Verify product images are visible', async () => {
      const images = page.getByRole('img');
      await expect(images.first()).toBeVisible({ timeout: 30000 });
      const count = await images.count();
      expect(count).toBeGreaterThan(1);
    });
  });

  test('should display Women category products', async ({ page }) => {
    test.skip(test.info().project.name === 'samsung-mobile', 'Mobile nav uses hamburger menu');
    const home = new EcommerceHomePage(page);

    await test.step('Navigate to Women category', async () => {
      await home.goto();
      await home.clickNavCategory('Women');
    });

    await test.step('Verify Women category page loaded', async () => {
      await expect(page.locator('main h1').filter({ hasText: "Women's Fashion" })).toBeVisible({ timeout: 30000 });
    });

    await test.step('Verify products are visible', async () => {
      await expect(page.getByRole('img').first()).toBeVisible({ timeout: 30000 });
    });
  });

  // INTENTIONAL FAILURE — for RCA AI Agent demo
  // This test uses a wrong selector to demonstrate BrowserStack's RCA feature
  test('should display featured products section [RCA DEMO]', async ({ page }) => {
    const home = new EcommerceHomePage(page);

    await test.step('Navigate to homepage', async () => {
      await home.goto();
    });

    await test.step('Verify featured products heading is visible', async () => {
      // INTENTIONAL: wrong text to trigger failure for RCA demo
      await expect(page.locator('h2').filter({ hasText: 'Best Sellers' })).toBeVisible({ timeout: 10000 });
    });
  });
});