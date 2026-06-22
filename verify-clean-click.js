const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Clearing server data file to simulate fresh start...');
  const dataDir = path.join(__dirname, '.data');
  const dataFile = path.join(dataDir, 'resume-data.json');
  
  // Create blank resume data structure
  const blankData = {
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      portfolio: '',
      summary: ''
    },
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    achievements: [],
    additionalContent: ''
  };
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(dataFile, JSON.stringify(blankData, null, 2), 'utf8');
  console.log(`Server data file at ${dataFile} cleared.`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const consoleLogs = [];
  const pageErrors = [];

  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push(text);
    console.log('BROWSER LOG:', text);
  });
  page.on('pageerror', err => {
    pageErrors.push(err.message);
    console.error('BROWSER ERROR:', err.message);
  });

  console.log('Navigating to app workspace...');
  await page.goto('http://localhost:3001/app');
  
  // Clear localStorage to be absolutely sure
  await page.evaluate(() => {
    localStorage.clear();
  });
  
  // Reload to apply cleared localStorage
  await page.reload();
  await page.waitForTimeout(2000);

  // We should be on onboarding now since localStorage is empty and server data is blank
  console.log('Checking if onboarding choice screen is visible...');
  const createBlankButton = page.locator('text=Create Blank Resume');
  const isChoiceVisible = await createBlankButton.isVisible();
  console.log(`Onboarding choice visible: ${isChoiceVisible}`);
  
  if (isChoiceVisible) {
    console.log('Clicking "Create Blank Resume"...');
    await createBlankButton.click();
    await page.waitForTimeout(1000);
  }

  // Verify we are in the workspace and "No entries yet" is shown under Personal/Experience/Projects
  console.log('Navigating to Projects section...');
  await page.click('button:has-text("Projects")');
  await page.waitForTimeout(500);

  console.log('Checking for "No entries yet" label...');
  const emptyStateText = page.locator('text=No entries yet');
  const isEmptyStateVisible = await emptyStateText.isVisible();
  console.log(`"No entries yet" visible: ${isEmptyStateVisible}`);

  console.log('Clicking "Add Project" button inside Empty State...');
  const addProjectButton = page.locator('button:has-text("Add Project")').first();
  await addProjectButton.click();
  await page.waitForTimeout(2000);

  console.log('Checking if Project Title input is visible...');
  const projectTitleInput = page.locator('label:has-text("Project Title")').first();
  const isInputVisible = await projectTitleInput.isVisible();
  console.log(`Project Title input visible: ${isInputVisible}`);

  // Take screenshot
  await page.screenshot({ path: 'screenshot-blank-test.png' });
  console.log('Screenshot saved to screenshot-blank-test.png');

  await browser.close();

  if (!isInputVisible) {
    console.error('FAIL: Project Title input did not appear after clicking Add Project!');
    process.exit(1);
  } else {
    console.log('SUCCESS: Project Title input appeared successfully!');
    process.exit(0);
  }
})().catch(err => {
  console.error('Test crashed:', err);
  process.exit(1);
});
