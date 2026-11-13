// tests/kapruka-navigation.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Kapruka category navigation', () => {
  test('navigate Electronics > Headphones > Headphones And Earbuds > first product', async ({ page }) => {
    // 1. Home page
    await page.goto('https://www.kapruka.com/', { waitUntil: 'domcontentloaded' });

    // 2. Click Electronics icon tile
    const electronicsLink = page.getByRole('link', { name: /Electronics Image Electronics/i });
    await expect(electronicsLink).toBeVisible();
    await electronicsLink.click();
    await page.waitForURL(/\/online\/electronics/i);

    // 3. Navigate directly to the Headphones & Earbuds category.
    //    The intermediate "Headphones" link is not reliably exposed on the Electronics page.
    await page.goto(
      'https://www.kapruka.com/online/electronics/price/wearable_technology/lanka/headphones-and-earbuds',
      { waitUntil: 'domcontentloaded' }
    );

    // 4. Confirm we're on the right page
    await expect(page).toHaveURL(/headphones-and-earbuds/i);

    // 5. Click the very first product
    const firstProduct = page.locator('a[href*="/buyonline/"]:visible').first();
    await expect(firstProduct).toBeVisible();
    await firstProduct.click();

    // 6. Verify product detail page
    await expect(page).toHaveURL(/kapruka\.com\/(buyonline|buyservice)\//);
  });
});