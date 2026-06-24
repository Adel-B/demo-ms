import { test, expect } from '@playwright/test';
import percySnapshot from '@percy/playwright';
import { EcommerceHomePage } from '../../pages/ecommerce/EcommerceHomePage';

test.describe('Checkout Flow', () => {
  test('should add a product to cart and reach checkout', async ({ page }) => {
    test.skip(test.info().project.name === 'samsung-mobile', 'Mobile nav uses hamburger menu');

    const home = new EcommerceHomePage(page);

    await test.step('Navigate to homepage', async () => {
      await home.goto();
    });

    await test.step('Navigate to Men category', async () => {
      await home.clickNavCategory('Men');
    });

    await test.step('Click Polo Shirt product image', async () => {
      // Observed: img[alt="Polo Shirt"] on the Men category listing page
      await page.getByRole('img', { name: 'Polo Shirt' }).first().click();
      await page.waitForLoadState('load');
    });

    await test.step('Verify product detail page loaded', async () => {
      // Observed: h1 "Polo Shirt" on PDP
      await expect(page.locator('main h1').filter({ hasText: 'Polo Shirt' })).toBeVisible({ timeout: 30000 });
    });

    await percySnapshot(page, 'Ecommerce Product Detail Page');

    await test.step('Add product to cart', async () => {
      // Observed: button "Add to Cart - $59.99" — below fold, scroll into view first
      const addToCartBtn = page.getByRole('button', { name: /Add to Cart/i });
      await addToCartBtn.scrollIntoViewIfNeeded();
      await expect(addToCartBtn).toBeVisible({ timeout: 30000 });
      await addToCartBtn.click();
      // Wait for "Adding..." state to resolve
      await expect(addToCartBtn).not.toHaveText('Adding...', { timeout: 10000 });
    });

    await test.step('Navigate to cart', async () => {
      // Observed: button "View Cart" on PDP after add to cart
      await page.getByRole('button', { name: 'View Cart' }).click();
      await page.waitForLoadState('load');
    });

    await test.step('Verify cart page loaded with item', async () => {
      // Observed: h1 "Shopping Cart" and h3 "Polo Shirt" on cart page
      await expect(page.locator('main h1').filter({ hasText: 'Shopping Cart' })).toBeVisible({ timeout: 30000 });
      await expect(page.getByRole('heading', { name: 'Polo Shirt', level: 3 })).toBeVisible({ timeout: 30000 });
    });

    await percySnapshot(page, 'Ecommerce Shopping Cart');

    await test.step('Proceed to checkout', async () => {
      // Observed: button "Proceed to Checkout" in Order Summary section
      await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
      await page.waitForLoadState('load');
    });

    await test.step('Verify checkout page loaded', async () => {
      // Observed: h1 "Checkout" on checkout page
      await expect(page.locator('main h1').filter({ hasText: 'Checkout' })).toBeVisible({ timeout: 30000 });
    });

    await percySnapshot(page, 'Ecommerce Checkout Page');
  });
});