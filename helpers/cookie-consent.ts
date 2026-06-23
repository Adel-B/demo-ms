import { Page } from '@playwright/test';

/**
 * Dismisses the M&S cookie consent banner if it appears.
 * Cookie button has id="onetrust-accept-btn-handler" (confirmed via DOM snapshot).
 */
export async function acceptCookieConsent(page: Page): Promise<void> {
  try {
    // DOM snapshot confirmed: button id="onetrust-accept-btn-handler"
    const acceptBtn = page.locator('#onetrust-accept-btn-handler');
    if (await acceptBtn.isVisible({ timeout: 8000 })) {
      await acceptBtn.click();
      await page.waitForLoadState('load');
    }
  } catch {
    // Banner not present — continue
  }
}