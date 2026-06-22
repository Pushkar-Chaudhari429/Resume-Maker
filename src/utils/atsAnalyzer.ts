import { ResumeData } from '@/types/resume';

export interface Suggestion {
  id: string;
  type: 'error' | 'warning' | 'success';
  message: string;
  impact: number; // how much score would increase
}

export interface AtsReport {
  score: number;
  suggestions: Suggestion[];
  metrics: {
    contactCount: number;
    experienceCount: number;
    projectsCount: number;
    skillsCount: number;
    certificationsCount: number;
  };
}

export function analyzeAtsScore(data: ResumeData): AtsReport {
  let score = 20; // Base score
  const suggestions: Suggestion[] = [];

  const { personalInfo, education, experience, projects, skills, certifications } = data;

  // 1. Personal Info checks (Max +35)
  if (personalInfo.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
    score += 10;
  } else {
    suggestions.push({
      id: 'email',
      type: 'error',
      message: 'Add a valid email address so recruiters can contact you.',
      impact: 10
    });
  }

  if (personalInfo.phone && personalInfo.phone.trim().length >= 5) {
    score += 10;
  } else {
    suggestions.push({
      id: 'phone',
      type: 'error',
      message: 'Add a phone number to complete contact details.',
      impact: 10
    });
  }

  if (personalInfo.linkedin && personalInfo.linkedin.trim() !== '') {
    score += 5;
  } else {
    suggestions.push({
      id: 'linkedin',
      type: 'warning',
      message: 'Add a LinkedIn profile link. 85%+ recruiters look for it.',
      impact: 5
    });
  }

  if (personalInfo.github && personalInfo.github.trim() !== '') {
    score += 5;
  } else {
    suggestions.push({
      id: 'github',
      type: 'warning',
      message: 'Add a GitHub profile link to showcase your source code.',
      impact: 5
    });
  }

  if (personalInfo.summary && personalInfo.summary.trim().length >= 80) {
    score += 5;
  } else {
    const currentLen = personalInfo.summary ? personalInfo.summary.trim().length : 0;
    suggestions.push({
      id: 'summary',
      type: 'warning',
      message: `Strengthen summary. Keep it over 80 characters (currently ${currentLen}).`,
      impact: 5
    });
  }

  // 2. Experience checks (Max +20)
  if (experience.length > 0) {
    score += 10;
    const shortDesc = experience.some(exp => exp.description.trim().length < 80);
    if (shortDesc) {
      suggestions.push({
        id: 'exp-description',
        type: 'warning',
        message: 'Expand job descriptions. Aim for at least 80 characters outlining metrics and impact.',
        impact: 10
      });
    } else {
      score += 10;
    }
  } else {
    suggestions.push({
      id: 'experience',
      type: 'error',
      message: 'Add at least one professional work experience entry.',
      impact: 20
    });
  }

  // 3. Projects checks (Max +15)
  if (projects.length > 0) {
    score += 10;
    if (projects.length >= 2) {
      score += 5;
    } else {
      suggestions.push({
        id: 'projects-count',
        type: 'warning',
        message: 'Add at least 2 projects to showcase practical experience.',
        impact: 5
      });
    }
  } else {
    suggestions.push({
      id: 'projects',
      type: 'error',
      message: 'Add at least one key software project.',
      impact: 15
    });
  }

  // 4. Education checks (Max +10)
  if (education.length > 0) {
    score += 10;
  } else {
    suggestions.push({
      id: 'education',
      type: 'error',
      message: 'Add at least one education entry.',
      impact: 10
    });
  }

  // 5. Skills checks (Max +15)
  if (skills.length > 0) {
    score += 10;
    const totalSkillsList = skills.reduce((acc, curr) => acc + (curr.name ? curr.name.split(',').length : 0), 0);
    if (totalSkillsList >= 6) {
      score += 5;
    } else {
      suggestions.push({
        id: 'skills-count',
        type: 'warning',
        message: 'List at least 6 core technologies/skills in your developer categories.',
        impact: 5
      });
    }
  } else {
    suggestions.push({
      id: 'skills',
      type: 'error',
      message: 'Add skills list containing categories and technical keywords.',
      impact: 15
    });
  }

  if (certifications.length === 0) {
    suggestions.push({
      id: 'certifications',
      type: 'success',
      message: 'Optional Tip: Add industry certifications (AWS, Scrum, etc.) to stand out.',
      impact: 0
    });
  }

  // Final score check
  score = Math.min(100, Math.max(0, score));

  return {
    score,
    suggestions: suggestions.sort((a, b) => b.impact - a.impact),
    metrics: {
      contactCount: (personalInfo.email ? 1 : 0) + (personalInfo.phone ? 1 : 0) + (personalInfo.linkedin ? 1 : 0) + (personalInfo.github ? 1 : 0),
      experienceCount: experience.length,
      projectsCount: projects.length,
      skillsCount: skills.length,
      certificationsCount: certifications.length
    }
  };
}
