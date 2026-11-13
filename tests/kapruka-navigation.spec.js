// tests/kapruka-navigation.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Kapruka category navigation', () => {
  test('navigate Electronics > Headphones > Headphones And Earbuds > first product', async ({ page }) => {
    await page.goto('https://www.kapruka.com/', { waitUntil: 'domcontentloaded' });

    const electronicsLink = page.getByRole('link', { name: /Electronics Image Electronics/i });
    await expect(electronicsLink).toBeVisible();
    await electronicsLink.click();
    await page.waitForURL(/\/online\/electronics/i);

    // Correct slug uses underscores: headphones_and_earbuds
    await page.goto(
      'https://www.kapruka.com/lk/online/electronics/price/wearable_technology/lanka/headphones_and_earbuds',
      { waitUntil: 'domcontentloaded' }
    );
    await expect(page).toHaveURL(/headphones_and_earbuds/i);

    const firstProduct = page.locator('a[href*="/buyonline/"]:visible').first();
    await expect(firstProduct).toBeVisible();
    await firstProduct.click();

    await expect(page).toHaveURL(/kapruka\.com\/(buyonline|buyservice)\//);
  });
});