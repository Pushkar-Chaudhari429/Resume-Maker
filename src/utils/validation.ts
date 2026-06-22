import { z } from 'zod';

// PersonalInfo stays strict — these are required for a valid resume
export const PersonalInfoSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(5, { message: 'Phone number must be at least 5 characters.' }),
  linkedin: z.string().default(''),
  github: z.string().default(''),
  portfolio: z.string().default(''),
  summary: z.string().min(10, { message: 'Summary must be at least 10 characters.' }),
});

// Draft-friendly schemas — all content fields accept empty strings
// so newly-added cards (before the user fills them in) don't break save

export const EducationSchema = z.object({
  id: z.string(),
  institution: z.string().default(''),
  degree: z.string().default(''),
  fieldOfStudy: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  gpa: z.string().optional().default(''),
  description: z.string().optional().default(''),
});

export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string().default(''),
  position: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  current: z.boolean().default(false),
  description: z.string().default(''),
});

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().default(''),
  description: z.string().default(''),
  technologies: z.string().default(''),
  link: z.string().optional().default(''),
  role: z.string().optional().default(''),
  githubLink: z.string().optional().default(''),
  liveLink: z.string().optional().default(''),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
});

export const SkillSchema = z.object({
  id: z.string(),
  category: z.string().default(''),
  name: z.string().default(''),
  level: z.string().optional().default('Expert'),
});

export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string().default(''),
  issuer: z.string().default(''),
  date: z.string().default(''),
  link: z.string().optional().default(''),
});

export const AchievementSchema = z.object({
  id: z.string(),
  title: z.string().default(''),
  date: z.string().default(''),
  issuer: z.string().optional().default(''),
  description: z.string().optional().default(''),
});

export const ResumeDataSchema = z.object({
  personalInfo: PersonalInfoSchema,
  education: z.array(EducationSchema).default([]),
  experience: z.array(ExperienceSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  skills: z.array(SkillSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  achievements: z.array(AchievementSchema).default([]),
  additionalContent: z.string().optional().default(''),
});

// Helpers to get nested errors from a ZodError for our custom hook/state
export function getZodErrors(schema: any, data: any): Record<string, string> {
  const result = schema.safeParse(data);
  if (result.success) return {};
  
  const errors: Record<string, string> = {};
  result.error.errors.forEach((err: any) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  return errors;
}
