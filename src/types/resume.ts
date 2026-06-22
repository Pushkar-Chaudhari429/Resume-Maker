export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string; // Comma-separated list for easy editing
  link?: string;
  role?: string;
  githubLink?: string;
  liveLink?: string;
  startDate?: string;
  endDate?: string;
}

export interface Skill {
  id: string;
  category: string; // e.g., "Frontend", "Backend", "Languages"
  name: string; // e.g., "React, TypeScript, Next.js"
  level?: string; // e.g., "Expert", "Intermediate"
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface Achievement {
  id: string;
  title: string;
  date: string;
  issuer?: string;
  description?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skill[];
  certifications: Certification[];
  achievements: Achievement[];
  additionalContent?: string;
}

export type ResumeTemplate = 'modern' | 'professional' | 'minimal';
