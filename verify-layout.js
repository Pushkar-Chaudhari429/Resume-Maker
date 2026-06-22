const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
  console.log("Starting browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  console.log("Navigating to http://localhost:3000/app ...");
  await page.goto('http://localhost:3000/app');
  await page.waitForTimeout(3000); // Wait for page hydration

  // If onboarding step 'choice' is open, click "Create Blank Resume"
  const onboardingBtn = await page.$('button:has-text("Create Blank Resume")');
  if (onboardingBtn) {
    console.log("Onboarding active, skipping...");
    await onboardingBtn.click();
    await page.waitForTimeout(2000);
  }

  // Click Education tab
  console.log("Navigating to Education tab...");
  await page.click('button:has-text("Education")');
  await page.waitForTimeout(1000);

  // Take screenshot of single entry (flat layout)
  console.log("Taking screenshot of single-entry Education...");
  await page.screenshot({ path: 'screenshot-education-flat.png' });

  // Click Add Education
  console.log("Clicking Add Education...");
  await page.click('button:has-text("Add Education")');
  await page.waitForTimeout(1000);

  // Take screenshot of multiple entries (card layout)
  console.log("Taking screenshot of multi-entry Education...");
  await page.screenshot({ path: 'screenshot-education-cards.png' });

  // Type in the fields to ensure they are editable
  console.log("Typing in fields...");
  await page.fill('input[name="education.0.institution"]', 'Massachusetts Institute of Technology');
  await page.fill('input[name="education.1.institution"]', 'Harvard University');
  await page.waitForTimeout(500);

  // Take screenshot of filled fields
  console.log("Taking screenshot of filled fields...");
  await page.screenshot({ path: 'screenshot-education-filled.png' });

  await browser.close();
  console.log("Verification finished successfully!");

  // Copy screenshots to artifacts
  const artDir = 'C:/Users/meetp/.gemini/antigravity/brain/ad6b5e60-f8ee-43d0-bcc7-a79ae992815b';
  fs.mkdirSync(artDir, { recursive: true });
  fs.copyFileSync('screenshot-education-flat.png', path.join(artDir, 'screenshot-education-flat.png'));
  fs.copyFileSync('screenshot-education-cards.png', path.join(artDir, 'screenshot-education-cards.png'));
  fs.copyFileSync('screenshot-education-filled.png', path.join(artDir, 'screenshot-education-filled.png'));
}

run().catch(console.error);
