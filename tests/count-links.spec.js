// tests/count-links.spec.js
const { test, expect } = require('@playwright/test');

test('Print total number of clickable links on the home page', async ({ page }) => {
  // 1. Navigate to the Kapruka homepage
  await page.goto('https://www.kapruka.com/', { waitUntil: 'domcontentloaded' });

  // 2. Wait for the main body to be attached and visible to ensure the page has started rendering
  await page.locator('body').waitFor({ state: 'visible' });
  
  // 3. Give the site a brief moment (2 seconds) to load the dynamic links (React/Vue rendering)
  await page.waitForTimeout(2000);

  // 4. Locate all clickable links (<a> tags) on the page
  const allLinks = page.locator('a');
  
  // 5. Get the total count
  const totalLinks = await allLinks.count();

  // 6. Print the result to the console
  console.log(`\n=========================================`);
  console.log(`🔗 TOTAL CLICKABLE LINKS ON HOME PAGE: ${totalLinks}`);
  console.log(`=========================================\n`);

  // 7. Assertion: We expect there to be more than 0 links
  expect(totalLinks).toBeGreaterThan(0);
});