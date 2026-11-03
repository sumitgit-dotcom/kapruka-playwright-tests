// tests/register-account.spec.js
const { test, expect } = require('@playwright/test');

test('Register a new Kapruka account', async ({ page }) => {
  // Set a generous timeout since Kapruka can be slow
  test.setTimeout(90000);

  console.log('Navigating to Kapruka...');
  await page.goto('https://www.kapruka.com/', { waitUntil: 'domcontentloaded' });

  // 1. Click the account/user icon in the header
  console.log('Looking for the account icon...');
  
  // Strategy A: Look for a link containing "my_account" or "login"
  let accountIcon = page.locator('header a[href*="my_account"], header a[href*="login"], a[href*="my_account"]').first();
  
  // Strategy B: If not found, look for the 2nd to last SVG icon in the header (Cart is usually last)
  if (!(await accountIcon.isVisible({ timeout: 5000 }).catch(() => false))) {
    console.log('Using fallback locator for icon...');
    const headerIcons = page.locator('header a svg, header .icon, header i');
    const count = await headerIcons.count();
    if (count >= 2) {
      // Click the icon before the cart
      accountIcon = headerIcons.nth(count - 2); 
    } else {
      // Absolute fallback: click the last link in the header
      accountIcon = page.locator('header a').last();
    }
  }

  await accountIcon.click({ force: true });
  console.log('Clicked icon. Waiting for page to load...');

  // Wait for navigation or page update
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000); // Give it a moment to render JS

  // 2. Look for the Create Account link/button
  console.log('Looking for Create Account button...');
  const createAccountBtn = page.locator('a, button, div[role="button"]')
    .filter({ hasText: /create account|register|sign up|new customer/i })
    .first();
  
  if (await createAccountBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await createAccountBtn.click();
    await page.waitForTimeout(2000);
  } else {
    console.log('Create Account button not explicitly found, assuming form is already visible.');
  }

  // 3. Fill the Form
  console.log('Filling out the form...');
  
  // First Name - usually the first visible text input in the form
  const textInputs = page.locator('form input[type="text"]');
  await textInputs.nth(0).waitFor({ state: 'visible', timeout: 15000 });
  await textInputs.nth(0).fill('jacob');
  
  // Last Name - usually the second visible text input
  await textInputs.nth(1).fill('oram');
  
  // Email - look for input specifically typed as email, or containing "email" in the name
  const emailInput = page.locator('input[type="email"], input[name*="email" i], input[id*="email" i]').first();
  await emailInput.fill('jacob@yopmail.com');
  
  // Passwords - using input[type="password"] is the most reliable
  const passwordInputs = page.locator('input[type="password"]');
  await passwordInputs.nth(0).fill('Jacob@12345');
  if (await passwordInputs.count() > 1) {
    await passwordInputs.nth(1).fill('Jacob@12345');
  }

  // 4. Click Submit
  console.log('Submitting form...');
  // Find the submit button inside the form
  const submitBtn = page.locator('form button[type="submit"], form input[type="submit"], button:has-text("Create"), button:has-text("Register")').first();
  await submitBtn.click();

  // 5. Verification
  console.log('Waiting for registration to complete...');
  await page.waitForTimeout(5000); // Wait to see if we get redirected or an error shows
  
  // Verify we are no longer on the register page
  await expect(page).not.toHaveURL(/register|signup|create/i);
});