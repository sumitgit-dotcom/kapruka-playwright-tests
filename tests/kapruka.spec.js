const { test, expect } = require('@playwright/test');
test('Verify Kapruka homepage loads and displays title', async ({ page }) => {
  // 1. Navigate to Kapruka
  await page.goto('https://www.kapruka.com/');

   await expect(page).toHaveTitle(/Kapruka/i);
    await expect(page.locator('body')).toBeVisible();
});