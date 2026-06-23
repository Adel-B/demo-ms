import { test, expect } from '@playwright/test';
import { EcommerceHomePage } from '../../pages/ecommerce/EcommerceHomePage';

test.describe('Homepage & Navigation', () => {
  test('should display homepage with header and navigation', async ({ page }) => {
    const home = new EcommerceHomePage(page);

    await test.step('Navigate to homepage', async () => {
      await home.goto();
    });

    await test.step('Verify header is visible', async () => {
      await expect(home.logo).toBeVisible({ timeout: 30000 });
    });

    await test.step('Verify navigation is visible', async () => {
      await expect(home.nav).toBeVisible({ timeout: 30000 });
    });
  });

  test('should navigate to Men category', async ({ page }) => {
    test.skip(test.info().project.name === 'samsung-mobile', 'Mobile nav uses hamburger menu');
    const home = new EcommerceHomePage(page);

    await test.step('Navigate to homepage', async () => {
      await home.goto();
    });

    await test.step('Click Men category', async () => {
      await home.clickNavCategory('Men');
    });

    await test.step('Verify Men category page loaded', async () => {
      await expect(page.locator('main h1').filter({ hasText: "Men's Fashion" })).toBeVisible({ timeout: 30000 });
    });
  });

  test('should navigate to Women category', async ({ page }) => {
    test.skip(test.info().project.name === 'samsung-mobile', 'Mobile nav uses hamburger menu');
    const home = new EcommerceHomePage(page);

    await test.step('Navigate to homepage', async () => {
      await home.goto();
    });

    await test.step('Click Women category', async () => {
      await home.clickNavCategory('Women');
    });

    await test.step('Verify Women category page loaded', async () => {
      await expect(page.locator('main h1').filter({ hasText: "Women's Fashion" })).toBeVisible({ timeout: 30000 });
    });
  });
});