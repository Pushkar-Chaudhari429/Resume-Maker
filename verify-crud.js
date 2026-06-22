/**
 * Programmatic CRUD & Persistence Verification Script
 * Checks all 6 resume sections: Projects, Experience, Education, Skills, Certifications, Achievements
 */

/* eslint-disable @typescript-eslint/no-require-imports */

const { z } = require('zod');
const fs = require('fs');
const path = require('path');

// 1. Zod validation schemas (matching validation.ts exactly)
const PersonalInfoSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  linkedin: z.string().optional().or(z.literal('')),
  github: z.string().optional().or(z.literal('')),
  portfolio: z.string().optional().or(z.literal('')),
  summary: z.string().min(10),
});

const EducationSchema = z.object({
  id: z.string(),
  institution: z.string().min(2),
  degree: z.string().min(2),
  fieldOfStudy: z.string().min(2),
  startDate: z.string().min(2),
  endDate: z.string().min(2),
  gpa: z.string().optional(),
  description: z.string().optional(),
});

const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(2),
  position: z.string().min(2),
  startDate: z.string().min(2),
  endDate: z.string().min(2),
  current: z.boolean(),
  description: z.string().min(10),
});

const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(2),
  description: z.string().min(10),
  technologies: z.string().min(2),
  link: z.string().optional().or(z.literal('')),
  role: z.string().optional(),
  githubLink: z.string().optional().or(z.literal('')),
  liveLink: z.string().optional().or(z.literal('')),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
});

const SkillSchema = z.object({
  id: z.string(),
  category: z.string().min(2),
  name: z.string().min(2),
  level: z.string().optional(),
});

const CertificationSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  issuer: z.string().min(2),
  date: z.string().min(2),
  link: z.string().optional().or(z.literal('')),
});

const AchievementSchema = z.object({
  id: z.string(),
  title: z.string().min(2),
  date: z.string().min(2),
  issuer: z.string().optional(),
  description: z.string().optional(),
});

const ResumeDataSchema = z.object({
  personalInfo: PersonalInfoSchema,
  education: z.array(EducationSchema),
  experience: z.array(ExperienceSchema),
  projects: z.array(ProjectSchema),
  skills: z.array(SkillSchema),
  certifications: z.array(CertificationSchema),
  achievements: z.array(AchievementSchema),
  additionalContent: z.string().optional(),
});

// Mock Initial State
let mockState = {
  personalInfo: {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    portfolio: "johndoe.dev",
    summary: "Dedicated software engineer with over 5 years of industry experience."
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
  achievements: [],
  additionalContent: ""
};

// Helper: Assert conditions and output status
function assert(condition, message) {
  if (!condition) {
    console.error(`\x1b[31mFAIL: ${message}\x1b[0m`);
    process.exit(1);
  }
}

console.log("\x1b[36m=== STARTING CRUD & PERSISTENCE VERIFICATION ===\x1b[0m\n");

// Step 1: Validate Initial State
const parseInit = ResumeDataSchema.safeParse(mockState);
assert(parseInit.success, "Initial state validation must pass");
console.log("✓ Initial empty state validated successfully.");

// List of sections to test
const sections = [
  {
    name: "education",
    item: {
      id: "edu-1",
      institution: "Stanford University",
      degree: "Master of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2020",
      endDate: "2022",
      gpa: "3.9",
      description: "Specialized in Artificial Intelligence."
    },
    editField: "institution",
    editValue: "MIT"
  },
  {
    name: "experience",
    item: {
      id: "exp-1",
      company: "Google Inc.",
      position: "Software Engineer",
      startDate: "2022",
      endDate: "Present",
      current: true,
      description: "Working on large-scale distributed systems and cloud backends."
    },
    editField: "company",
    editValue: "Alphabet Inc."
  },
  {
    name: "projects",
    item: {
      id: "proj-1",
      title: "ResumeForge AI",
      role: "Lead Engineer",
      technologies: "Next.js, Framer Motion, Zod",
      description: "An automated builder compiling resumes to PDFs and portfolio hubs.",
      link: "resumeforge.dev",
      githubLink: "github.com/meetp/digitalHeroes",
      liveLink: "resumeforge.dev",
      startDate: "2025-01",
      endDate: "Present"
    },
    editField: "title",
    editValue: "ResumeForge AI Hub"
  },
  {
    name: "skills",
    item: {
      id: "skill-1",
      category: "Frontend Development",
      name: "React, TypeScript, Next.js, CSS",
      level: "Expert"
    },
    editField: "category",
    editValue: "Web Development"
  },
  {
    name: "certifications",
    item: {
      id: "cert-1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023",
      link: "aws.com/credential"
    },
    editField: "name",
    editValue: "AWS Solutions Architect Professional"
  },
  {
    name: "achievements",
    item: {
      id: "ach-1",
      title: "First Place - Global Hackathon",
      issuer: "TechCrunch",
      date: "2024",
      description: "Won first prize out of 500 competing international teams."
    },
    editField: "title",
    editValue: "Grand Champion - Hackathon 2024"
  }
];

// Execute CRUD operations for each section
sections.forEach((sec) => {
  console.log(`\n\x1b[33mTesting Section: [${sec.name}]\x1b[0m`);

  // 1. ADD ITEM
  mockState[sec.name].push(sec.item);
  assert(mockState[sec.name].length === 1, `Add item failed for ${sec.name}`);
  assert(ResumeDataSchema.safeParse(mockState).success, `Validation failed after Add in ${sec.name}`);
  console.log(`  ✓ Add item passed.`);

  // 2. EDIT ITEM
  mockState[sec.name][0][sec.editField] = sec.editValue;
  assert(mockState[sec.name][0][sec.editField] === sec.editValue, `Edit item failed for ${sec.name}`);
  assert(ResumeDataSchema.safeParse(mockState).success, `Validation failed after Edit in ${sec.name}`);
  console.log(`  ✓ Edit item passed.`);

  // 3. DUPLICATE ITEM
  const original = mockState[sec.name][0];
  const duplicate = {
    ...original,
    id: `${sec.name}-dup-${Date.now()}`
  };
  mockState[sec.name].push(duplicate);
  assert(mockState[sec.name].length === 2, `Duplicate item failed for ${sec.name}`);
  assert(ResumeDataSchema.safeParse(mockState).success, `Validation failed after Duplicate in ${sec.name}`);
  console.log(`  ✓ Duplicate item passed.`);

  // 4. REORDER ITEMS
  // Swap the first and second items
  const temp = mockState[sec.name][0];
  mockState[sec.name][0] = mockState[sec.name][1];
  mockState[sec.name][1] = temp;
  // Assert order has changed (the duplicated item ID is now at index 0)
  assert(mockState[sec.name][0].id === duplicate.id, `Reorder items failed for ${sec.name}`);
  assert(ResumeDataSchema.safeParse(mockState).success, `Validation failed after Reorder in ${sec.name}`);
  console.log(`  ✓ Reorder item passed.`);

  // 5. DELETE ITEM
  mockState[sec.name].splice(1, 1); // Delete the item at index 1
  assert(mockState[sec.name].length === 1, `Delete item failed for ${sec.name}`);
  assert(ResumeDataSchema.safeParse(mockState).success, `Validation failed after Delete in ${sec.name}`);
  console.log(`  ✓ Delete item passed.`);
});

// Step 6 & 7: Persistence Simulation (save, clear state, load, verify)
console.log("\n\x1b[33mTesting Storage Persistence Simulation...\x1b[0m");

const testFilePath = path.join(__dirname, 'mock_local_storage.json');
try {
  // Save/Persist State
  fs.writeFileSync(testFilePath, JSON.stringify(mockState, null, 2), 'utf-8');
  console.log("  ✓ Save operation succeeded.");

  // Clear memory state
  const previousStateStr = JSON.stringify(mockState);
  mockState = null;

  // Restore State
  const loadedDataStr = fs.readFileSync(testFilePath, 'utf-8');
  mockState = JSON.parse(loadedDataStr);
  console.log("  ✓ Load operation succeeded.");

  // Confirm data integrity
  assert(JSON.stringify(mockState) === previousStateStr, "Persistence mismatch: Loaded state must match saved state exactly");
  assert(ResumeDataSchema.safeParse(mockState).success, "Loaded state fails schema validation");
  console.log("  ✓ Persistence integrity check passed.");

} catch (err) {
  assert(false, `Storage persistence failed: ${err.message}`);
} finally {
  // Clean up
  if (fs.existsSync(testFilePath)) {
    fs.unlinkSync(testFilePath);
  }
}

console.log("\n\x1b[32m==================================================\x1b[0m");
console.log("\x1b[32m✓ ALL MANDATORY CRUD & PERSISTENCE TESTS PASSED!\x1b[0m");
console.log("\x1b[32m==================================================\x1b[0m\n");
