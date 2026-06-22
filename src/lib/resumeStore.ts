import { promises as fs } from 'fs';
import path from 'path';
import { ResumeData } from '@/types/resume';
import {
  createEmptyCertification,
  createEmptyEducation,
  createEmptyExperience,
  createEmptyProject,
  createEmptySkill,
  createEmptyAchievement,
  initialResumeData,
} from '@/data/resumeDefaults';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'resume-data.json');

// Normalize incoming data — fills any missing fields with safe defaults
// so we never write incomplete/corrupt data to disk, even for drafts
function normalizeResumeData(data: Partial<ResumeData> | null | undefined): ResumeData {
  return {
    personalInfo: {
      ...initialResumeData.personalInfo,
      ...(data?.personalInfo ?? {}),
    },
    education: Array.isArray(data?.education)
      ? data.education.map((item) => createEmptyEducation(item))
      : initialResumeData.education,
    experience: Array.isArray(data?.experience)
      ? data.experience.map((item) => createEmptyExperience(item))
      : initialResumeData.experience,
    projects: Array.isArray(data?.projects)
      ? data.projects.map((item) => createEmptyProject(item))
      : initialResumeData.projects,
    skills: Array.isArray(data?.skills)
      ? data.skills.map((item) => createEmptySkill(item))
      : initialResumeData.skills,
    certifications: Array.isArray(data?.certifications)
      ? data.certifications.map((item) => createEmptyCertification(item))
      : initialResumeData.certifications,
    achievements: Array.isArray(data?.achievements)
      ? data.achievements.map((item) => createEmptyAchievement(item))
      : initialResumeData.achievements,
    additionalContent: data?.additionalContent ?? initialResumeData.additionalContent,
  };
}

async function ensureSeededFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    const OLD_DATA_FILE = path.join(process.cwd(), 'data', 'resume-data.json');
    try {
      await fs.access(OLD_DATA_FILE);
      const content = await fs.readFile(OLD_DATA_FILE, 'utf8');
      await fs.writeFile(DATA_FILE, content, 'utf8');
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify(initialResumeData, null, 2), 'utf8');
    }
  }
}

export async function readResumeData(): Promise<ResumeData> {
  await ensureSeededFile();

  try {
    const fileContents = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(fileContents) as Partial<ResumeData>;
    return normalizeResumeData(parsed);
  } catch {
    return initialResumeData;
  }
}

export async function writeResumeData(data: ResumeData): Promise<ResumeData> {
  // NO strict Zod validation here — we accept drafts with empty fields.
  // normalizeResumeData ensures the written JSON always has correct structure.
  const normalized = normalizeResumeData(data);

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(normalized, null, 2), 'utf8');

  return normalized;
}
