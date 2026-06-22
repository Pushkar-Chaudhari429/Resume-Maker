const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
  console.log("Starting browser...");
  const browser = await chromium.launch({
    headless: true
  });

  const videoDir = path.join(__dirname, 'video-tmp');
  fs.mkdirSync(videoDir, { recursive: true });
  
  const context = await browser.newContext({
    recordVideo: {
      dir: videoDir,
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();
  console.log("Navigating to http://localhost:3000/app ...");
  await page.goto('http://localhost:3000/app');
  await page.waitForTimeout(3000); // Wait for page hydration

  // If onboarding step 'choice' is open, click "Create Blank Resume"
  console.log("Checking if onboarding choice screen is visible...");
  const onboardingBtn = await page.$('button:has-text("Create Blank Resume")');
  if (onboardingBtn) {
    console.log("Onboarding active, clicking 'Create Blank Resume'...");
    await onboardingBtn.click();
    await page.waitForTimeout(2000);
  }

  // Personal Info typing
  console.log("Interacting with Personal Info...");
  await page.fill('input[name="personalInfo.fullName"]', 'Pushkar Girish Chaudhari');
  await page.waitForTimeout(400);
  await page.fill('input[name="personalInfo.email"]', 'pushkar@example.com');
  await page.waitForTimeout(400);
  await page.fill('input[name="personalInfo.phone"]', '+1 (555) 019-2834');
  await page.waitForTimeout(400);
  await page.fill('textarea[name="personalInfo.summary"]', 'Experienced Software Engineer specializing in modern web applications, scalable APIs, and responsive UI/UX designs.');
  await page.waitForTimeout(800);

  // Experience Section
  console.log("Interacting with Experience...");
  await page.click('button:has-text("Experience")');
  await page.waitForTimeout(800);
  // Experience is now automatically initialized with one entry, so let's type directly!
  await page.fill('input[name="experience.0.company"]', 'SpaceX');
  await page.waitForTimeout(400);
  await page.fill('input[name="experience.0.position"]', 'Senior Software Engineer');
  await page.waitForTimeout(400);
  await page.fill('input[name="experience.0.startDate"]', '2023-01');
  await page.waitForTimeout(400);
  await page.fill('textarea[name="experience.0.description"]', 'Leading development of mission control dashboard interfaces. Optimized telemetry data processing pipeline by 40%.');
  await page.waitForTimeout(800);

  // Click "Add Experience" to show second card creation and editing
  console.log("Adding secondary Experience card...");
  await page.click('button:has-text("Add Experience")');
  await page.waitForTimeout(800);
  await page.fill('input[name="experience.1.company"]', 'NASA JPL');
  await page.waitForTimeout(400);
  await page.fill('input[name="experience.1.position"]', 'Software Engineer');
  await page.waitForTimeout(400);
  await page.fill('textarea[name="experience.1.description"]', 'Developed flight software and testing automation for Mars rover operations.');
  await page.waitForTimeout(800);

  // Projects Section
  console.log("Interacting with Projects...");
  await page.click('button:has-text("Projects")');
  await page.waitForTimeout(800);
  await page.fill('input[name="projects.0.title"]', 'Starship Launch Dashboard');
  await page.waitForTimeout(400);
  await page.fill('input[name="projects.0.technologies"]', 'React, Next.js, TailwindCSS, TypeScript');
  await page.waitForTimeout(400);
  await page.fill('input[name="projects.0.githubLink"]', 'https://github.com/space/starship');
  await page.waitForTimeout(400);
  await page.fill('input[name="projects.0.liveLink"]', 'https://starship.space');
  await page.waitForTimeout(400);
  await page.fill('textarea[name="projects.0.description"]', 'Real-time monitoring interface for launch operations and telemetry stream analysis.');
  await page.waitForTimeout(800);

  // Skills Section
  console.log("Interacting with Skills...");
  await page.click('button:has-text("Skills")');
  await page.waitForTimeout(800);
  await page.fill('input[name="skills.0.category"]', 'Frontend Development');
  await page.waitForTimeout(400);
  await page.fill('input[name="skills.0.name"]', 'React, Next.js, TypeScript, TailwindCSS, HTML5, CSS3');
  await page.waitForTimeout(800);

  // Education Section
  console.log("Interacting with Education...");
  await page.click('button:has-text("Education")');
  await page.waitForTimeout(800);
  await page.fill('input[name="education.0.institution"]', 'Massachusetts Institute of Technology');
  await page.waitForTimeout(400);
  await page.fill('input[name="education.0.degree"]', 'Master of Science');
  await page.waitForTimeout(400);
  await page.fill('input[name="education.0.fieldOfStudy"]', 'Computer Science');
  await page.waitForTimeout(400);
  await page.fill('input[name="education.0.startDate"]', '2020');
  await page.waitForTimeout(400);
  await page.fill('input[name="education.0.endDate"]', '2022');
  await page.waitForTimeout(400);
  await page.fill('input[name="education.0.gpa"]', '4.0/4.0');
  await page.waitForTimeout(800);

  // Certifications Section
  console.log("Interacting with Certifications...");
  await page.click('button:has-text("Certs")');
  await page.waitForTimeout(800);
  await page.fill('input[name="certifications.0.name"]', 'AWS Certified Solutions Architect');
  await page.waitForTimeout(400);
  await page.fill('input[name="certifications.0.issuer"]', 'Amazon Web Services');
  await page.waitForTimeout(400);
  await page.fill('input[name="certifications.0.date"]', '2024');
  await page.waitForTimeout(800);

  // Achievements Section
  console.log("Interacting with Achievements...");
  await page.click('button:has-text("Achieve")');
  await page.waitForTimeout(800);
  await page.fill('input[name="achievements.0.title"]', 'NASA Innovative Concepts Award');
  await page.waitForTimeout(400);
  await page.fill('input[name="achievements.0.issuer"]', 'NASA');
  await page.waitForTimeout(400);
  await page.fill('textarea[name="achievements.0.description"]', 'Recognized for pioneering contribution to deep-space autonomous navigation system designs.');
  await page.waitForTimeout(1000);

  // Scroll to show preview
  console.log("Scrolling and finishing up...");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);

  await context.close();
  await browser.close();

  // Find the video file
  const files = fs.readdirSync(videoDir);
  const videoFile = files.find(f => f.endsWith('.webm'));
  if (videoFile) {
    const srcPath = path.join(videoDir, videoFile);
    const destPath = 'C:/Users/meetp/.gemini/antigravity/brain/ad6b5e60-f8ee-43d0-bcc7-a79ae992815b/preview.webm';
    fs.copyFileSync(srcPath, destPath);
    console.log(`Video saved successfully to ${destPath}`);
  } else {
    console.log("No video file found!");
  }
}

run().catch(console.error);
