import { ResumeData } from '@/types/resume';

export const createEmptyEducation = (overrides: Partial<ResumeData['education'][number]> = {}): ResumeData['education'][number] => ({
  id: overrides.id ?? `edu-${Date.now()}`,
  institution: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  gpa: '',
  description: '',
  ...overrides,
});

export const createEmptyExperience = (overrides: Partial<ResumeData['experience'][number]> = {}): ResumeData['experience'][number] => ({
  id: overrides.id ?? `exp-${Date.now()}`,
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  ...overrides,
});

export const createEmptyProject = (overrides: Partial<ResumeData['projects'][number]> = {}): ResumeData['projects'][number] => ({
  id: overrides.id ?? `proj-${Date.now()}`,
  title: '',
  description: '',
  technologies: '',
  link: '',
  role: '',
  githubLink: '',
  liveLink: '',
  startDate: '',
  endDate: '',
  ...overrides,
});

export const createEmptySkill = (overrides: Partial<ResumeData['skills'][number]> = {}): ResumeData['skills'][number] => ({
  id: overrides.id ?? `skill-${Date.now()}`,
  category: '',
  name: '',
  level: 'Expert',
  ...overrides,
});

export const createEmptyCertification = (overrides: Partial<ResumeData['certifications'][number]> = {}): ResumeData['certifications'][number] => ({
  id: overrides.id ?? `cert-${Date.now()}`,
  name: '',
  issuer: '',
  date: '',
  link: '',
  ...overrides,
});

export const createEmptyAchievement = (overrides: Partial<ResumeData['achievements'][number]> = {}): ResumeData['achievements'][number] => ({
  id: overrides.id ?? `ach-${Date.now()}`,
  title: '',
  date: '',
  issuer: '',
  description: '',
  ...overrides,
});

export const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: 'Pushkar Girish Chaudhari',
    email: 'meet.pushkarchaudhari@gmail.com',
    phone: '+91 98765 43210',
    linkedin: 'linkedin.com/in/pushkar-chaudhari',
    github: 'github.com/pushkar-chaudhari',
    portfolio: 'pushkarchaudhari.dev',
    summary:
      'Passionate Full-Stack Developer with hands-on experience building highly responsive web applications using Next.js, React, TypeScript, and modern styling libraries. Specialized in creating scalable systems, optimizing web performance, and delivering premium user experiences.',
  },
  education: [
    createEmptyEducation({
      id: 'edu-1',
      institution: 'State University of Technology',
      degree: 'Bachelor of Technology',
      fieldOfStudy: 'Computer Science & Engineering',
      startDate: '2022',
      endDate: '2026',
      gpa: '9.2/10',
      description: 'Focused on Software Architecture, Algorithms, and Web Systems.',
    }),
  ],
  experience: [
    createEmptyExperience({
      id: 'exp-1',
      company: 'Tech Solutions Inc.',
      position: 'Frontend Developer Intern',
      startDate: '2025-01',
      endDate: 'Present',
      current: true,
      description:
        'Designed responsive dashboard systems using React and Tailwind CSS. Improved page load times by 35% using lazy-loading and code-splitting. Collaborated on API integrations with TypeScript.',
    }),
    createEmptyExperience({
      id: 'exp-2',
      company: 'Digital Innovators',
      position: 'Web Developer Freelancer',
      startDate: '2024-06',
      endDate: '2024-12',
      current: false,
      description:
        'Delivered 5+ clean responsive websites for various local businesses. Implemented accessible layouts using semantic HTML, ARIA standards, and focus states. Standardized components for reusability.',
    }),
  ],
  projects: [
    createEmptyProject({
      id: 'proj-1',
      title: 'ResumeForge AI',
      description:
        'Advanced ATS-friendly resume builder and portfolio generator built with Next.js 15, Framer Motion, and jsPDF. Features real-time ATS optimization scoring and Zod validations.',
      technologies: 'Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Zod, jsPDF',
      link: 'https://github.com/meetp/digitalHeroes',
      githubLink: 'https://github.com/meetp/digitalHeroes',
      liveLink: 'https://resumeforge.dev',
      startDate: '2025-01',
      endDate: 'Present',
      role: 'Lead Creator',
    }),
    createEmptyProject({
      id: 'proj-2',
      title: 'TaskFlow Platform',
      description:
        'Collaborative SaaS project management tool featuring drag-and-drop kanban boards, real-time sync, and detailed productivity charts.',
      technologies: 'React, Node.js, Express, MongoDB, Tailwind CSS',
      link: 'https://taskflow.dev',
      githubLink: 'https://github.com/taskflow',
      liveLink: 'https://taskflow.dev',
      startDate: '2024-06',
      endDate: '2024-12',
      role: 'Full Stack Developer',
    }),
  ],
  skills: [
    createEmptySkill({
      id: 'skill-1',
      category: 'Frontend',
      name: 'React, Next.js, TypeScript, Tailwind CSS, HTML5, CSS3, Framer Motion',
      level: 'Expert',
    }),
    createEmptySkill({
      id: 'skill-2',
      category: 'Backend & Databases',
      name: 'Node.js, Express, MongoDB, PostgreSQL, REST APIs',
      level: 'Intermediate',
    }),
    createEmptySkill({
      id: 'skill-3',
      category: 'Tools & DevOps',
      name: 'Git, GitHub, Vercel, npm, PWA, Webpack',
      level: 'Advanced',
    }),
  ],
  certifications: [
    createEmptyCertification({
      id: 'cert-1',
      name: 'AWS Certified Developer - Associate',
      issuer: 'Amazon Web Services',
      date: '2025',
    }),
    createEmptyCertification({
      id: 'cert-2',
      name: 'Advanced React & Next.js Professional',
      issuer: 'Tech Academy',
      date: '2024',
    }),
  ],
  achievements: [
    createEmptyAchievement({
      id: 'ach-1',
      title: 'Winner - National Hackathon',
      date: '2024',
      issuer: 'Ministry of Education',
      description: 'Awarded first place among 500+ teams for building an AI-powered disaster response portal.',
    }),
  ],
  additionalContent: '',
};
