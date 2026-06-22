const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
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

  console.log('Starting dev server check...');
  
  // Start the dev server in the background if it's not already running
  // Actually, we'll hit port 3001 (which we'll start or is running)
  await page.goto('http://localhost:3001/app');
  await page.waitForTimeout(2000);

  // Handle onboarding choice if present
  const isChoice = await page.isVisible('text=Create Blank Resume');
  if (isChoice) {
    console.log('Clicking Create Blank Resume');
    await page.click('text=Create Blank Resume');
    await page.waitForTimeout(1000);
  }

  const sectionsToTest = [
    {
      tab: 'Experience',
      addButton: 'Add Experience',
      inputLabel: 'Company Name',
      textToType: 'Google Inc.',
      previewSelector: 'text=Google Inc.'
    },
    {
      tab: 'Projects',
      addButton: 'Add Project',
      inputLabel: 'Project Title',
      textToType: 'ResumeForge AI Project',
      previewSelector: 'text=ResumeForge AI Project'
    },
    {
      tab: 'Skills',
      addButton: 'Add Category',
      inputLabel: 'Skill Category',
      textToType: 'Backend Tech Stack',
      previewSelector: 'text=Backend Tech Stack'
    },
    {
      tab: 'Education',
      addButton: 'Add Education',
      inputLabel: 'Institution / School',
      textToType: 'Stanford University',
      previewSelector: 'text=Stanford University'
    },
    {
      tab: 'Certs',
      addButton: 'Add Certification',
      inputLabel: 'Certification Name',
      textToType: 'AWS Solutions Architect Cert',
      previewSelector: 'text=AWS Solutions Architect Cert'
    },
    {
      tab: 'Achieve',
      addButton: 'Add Achievement',
      inputLabel: 'Achievement Title',
      textToType: 'First Place Hackathon Winner',
      previewSelector: 'text=First Place Hackathon Winner'
    }
  ];

  for (const sec of sectionsToTest) {
    console.log(`\n--- Testing Section: ${sec.tab} ---`);
    
    // 1. Click tab
    console.log(`Clicking tab: ${sec.tab}`);
    await page.click(`button:has-text("${sec.tab}")`);
    await page.waitForTimeout(500);

    // 2. Click Add button
    console.log(`Clicking Add button: ${sec.addButton}`);
    // Let's try clicking the EmptyState button first (since it was empty)
    const emptyStateText = `Click ${sec.addButton} to add your first entry`;
    const emptyStateVisible = await page.isVisible(`text=${sec.addButton}`);
    
    if (emptyStateVisible) {
      console.log('Clicking EmptyState button');
      await page.click(`button:has-text("${sec.addButton}")`);
    } else {
      console.log('EmptyState not visible, clicking header button');
      await page.click(`button:has-text("${sec.addButton}")`);
    }
    await page.waitForTimeout(1000);

    // 3. Verify card appeared by typing in the input
    console.log(`Typing into input: ${sec.inputLabel}`);
    // Wait for the input field to be visible and type
    const inputSelector = `label:has-text("${sec.inputLabel}") + input, input[placeholder*="${sec.inputLabel}"], label:has-text("${sec.inputLabel}") ~ input`;
    // We can also find by label text or selector
    await page.fill(`input:near(label:has-text("${sec.inputLabel}"))`, sec.textToType);
    await page.waitForTimeout(1000);

    // 4. Verify preview updates
    console.log(`Checking if text is in preview`);
    // Wait a bit for preview sync
    await page.waitForTimeout(1000);
    const inPreview = await page.isVisible(`#resume-preview-root >> text=${sec.textToType}`);
    console.log(`Text in Preview status: ${inPreview}`);
  }

  // Final screenshot
  await page.screenshot({ path: 'screenshot-all-sections.png', fullPage: true });
  console.log('\nFinal screenshot saved to screenshot-all-sections.png');

  await browser.close();

  if (pageErrors.length > 0) {
    console.error('\nErrors encountered during run:');
    console.error(pageErrors);
    process.exit(1);
  } else {
    console.log('\nAll sections checked without browser errors.');
  }
})().catch(err => {
  console.error('Test script crashed:', err);
  process.exit(1);
});
