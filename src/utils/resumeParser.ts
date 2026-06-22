import { ResumeData } from '@/types/resume';

// ─── PDF Text Extraction ──────────────────────────────────────────────────────
// Uses pdfjs-dist with a CDN-hosted worker to avoid Webpack bundling issues.
async function extractTextFromPdf(file: File): Promise<string> {
  try {
    // Dynamically import pdfjs-dist (legacy build for broadest compatibility)
    const pdfjsLib = await import('pdfjs-dist');

    // Use unpkg CDN for the worker — avoids Webpack worker bundling errors in Next.js
    const PDFJS_VERSION = (pdfjsLib as any).version || '4.0.379';
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;

    let extractedText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = (textContent.items as any[])
        .map((item) => item.str)
        .join(' ');
      extractedText += pageText + '\n';
    }
    return extractedText.trim();
  } catch (err) {
    console.error('PDF extraction failed:', err);
    throw new Error('Could not read the PDF file. Please try a DOCX or TXT file instead.');
  }
}

// ─── DOCX Text Extraction ─────────────────────────────────────────────────────
async function extractTextFromDocx(file: File): Promise<string> {
  try {
    const mammoth = await import('mammoth/mammoth.browser');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || '';
  } catch (err) {
    console.error('DOCX extraction failed:', err);
    throw new Error('Could not read the DOCX file. Please try a TXT or PDF file instead.');
  }
}

// ─── TXT Text Extraction ──────────────────────────────────────────────────────
function extractTextFromTxt(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || '');
    reader.onerror = () => reject(new Error('Failed to read the text file.'));
    reader.readAsText(file);
  });
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────
export async function parseResumeFile(file: File): Promise<ResumeData> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  let rawText = '';

  if (extension === 'pdf') {
    rawText = await extractTextFromPdf(file);
  } else if (extension === 'docx') {
    rawText = await extractTextFromDocx(file);
  } else if (extension === 'txt') {
    rawText = await extractTextFromTxt(file);
  } else {
    throw new Error('Unsupported file format. Please upload a PDF, DOCX, or TXT file.');
  }

  if (!rawText || rawText.length < 20) {
    throw new Error('The file appears to be empty or unreadable. Please try a different file.');
  }

  return parseResumeText(rawText);
}

// ─── Text → ResumeData Parser ─────────────────────────────────────────────────
export function parseResumeText(text: string): ResumeData {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // ── Helper utilities ──
  const findLineAfter = (keywords: string[], offset = 1): string => {
    for (const kw of keywords) {
      const idx = lines.findIndex(l => l.toLowerCase().includes(kw.toLowerCase()));
      if (idx !== -1 && lines[idx + offset]) return lines[idx + offset].trim();
    }
    return '';
  };

  const extractSection = (startKeywords: string[], endKeywords: string[]): string[] => {
    let started = false;
    const result: string[] = [];
    for (const line of lines) {
      const ll = line.toLowerCase();
      if (!started && startKeywords.some(k => ll.includes(k))) { started = true; continue; }
      if (started && endKeywords.some(k => ll.includes(k))) break;
      if (started) result.push(line);
    }
    return result;
  };

  // ── Email / Phone via regex ──
  const fullText = text;
  const emailMatch = fullText.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
  const phoneMatch = fullText.match(/(\+?\d[\d\s\-().]{7,}\d)/);
  const linkedinMatch = fullText.match(/linkedin\.com\/in\/[\w-]+/i);
  const githubMatch = fullText.match(/github\.com\/[\w-]+/i);
  const portfolioMatch = fullText.match(/https?:\/\/(?!github|linkedin)[^\s"'<>]+/i);

  // ── Name: First non-email, non-phone, longish line near top ──
  let fullName = '';
  for (const line of lines.slice(0, 8)) {
    if (line.length > 3 && line.length < 60 && !line.includes('@') && !/\d{5,}/.test(line)) {
      fullName = line;
      break;
    }
  }

  // ── Summary ──
  const summaryLines = extractSection(
    ['summary', 'about', 'objective', 'profile'],
    ['experience', 'education', 'skills', 'projects', 'certif', 'achievement', 'work history']
  );
  const summary = summaryLines.slice(0, 4).join(' ').trim();

  // ── Experience ──
  const expLines = extractSection(
    ['experience', 'work history', 'employment'],
    ['education', 'skills', 'projects', 'certif', 'achievement']
  );
  const experience = parseExperience(expLines);

  // ── Education ──
  const eduLines = extractSection(
    ['education', 'academic'],
    ['experience', 'skills', 'projects', 'certif', 'achievement', 'work history']
  );
  const education = parseEducation(eduLines);

  // ── Skills ──
  const skillLines = extractSection(
    ['skills', 'technical skills', 'technologies', 'competencies'],
    ['experience', 'education', 'projects', 'certif', 'achievement', 'work history']
  );
  const skills = parseSkills(skillLines);

  // ── Projects ──
  const projLines = extractSection(
    ['projects', 'key projects', 'personal projects'],
    ['experience', 'education', 'skills', 'certif', 'achievement', 'work history']
  );
  const projects = parseProjects(projLines);

  // ── Certifications ──
  const certLines = extractSection(
    ['certif', 'courses', 'licenses'],
    ['experience', 'education', 'skills', 'projects', 'achievement', 'work history']
  );
  const certifications = parseCertifications(certLines);

  // ── Achievements / Awards ──
  const achLines = extractSection(
    ['achievement', 'awards', 'honors', 'recognition'],
    ['experience', 'education', 'skills', 'projects', 'certif', 'work history']
  );
  const achievements = parseAchievements(achLines);

  return {
    personalInfo: {
      fullName,
      email: emailMatch?.[0] || '',
      phone: phoneMatch?.[0]?.replace(/\s+/g, ' ').trim() || '',
      linkedin: linkedinMatch ? `https://${linkedinMatch[0]}` : '',
      github: githubMatch ? `https://${githubMatch[0]}` : '',
      portfolio: portfolioMatch?.[0] || '',
      summary,
    },
    education,
    experience,
    projects,
    skills,
    certifications,
    achievements,
    additionalContent: '',
  };
}

// ─── Section Parsers ──────────────────────────────────────────────────────────

function parseExperience(lines: string[]) {
  const entries: any[] = [];
  let current: any = null;
  const descLines: string[] = [];

  const datePattern = /(\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{4})/gi;

  for (const line of lines) {
    const ll = line.toLowerCase();
    const isCompanyLine = /^[A-Z]/.test(line) && line.length < 80 && !datePattern.test(line);
    const hasDate = datePattern.test(line);

    if (hasDate || isCompanyLine) {
      if (current) {
        current.description = descLines.join('\n').trim();
        entries.push(current);
        descLines.length = 0;
      }
      const dates = line.match(/(\d{4})/g) || [];
      current = {
        id: `exp-${Date.now()}-${entries.length}`,
        company: isCompanyLine && !hasDate ? line : '',
        position: '',
        startDate: dates[0] || '',
        endDate: dates[1] || (line.toLowerCase().includes('present') ? 'Present' : ''),
        current: line.toLowerCase().includes('present'),
        description: '',
      };
    } else if (current && !current.company) {
      current.company = line;
    } else if (current && !current.position && ll.includes('developer') || ll.includes('engineer') || ll.includes('manager') || ll.includes('intern') || ll.includes('analyst') || ll.includes('lead')) {
      current.position = line;
    } else if (current) {
      descLines.push(line);
    }
  }

  if (current) {
    current.description = descLines.join('\n').trim();
    entries.push(current);
  }

  return entries.filter(e => e.company || e.position);
}

function parseEducation(lines: string[]) {
  const entries: any[] = [];
  let current: any = null;

  const degreeKeywords = ['bachelor', 'master', 'b.tech', 'b.e', 'm.tech', 'm.e', 'b.sc', 'm.sc', 'phd', 'diploma', 'associate', 'mba', 'bca', 'mca'];
  const datePattern = /(\d{4})/g;

  for (const line of lines) {
    const ll = line.toLowerCase();
    const isDegree = degreeKeywords.some(k => ll.includes(k));
    const hasDate = datePattern.test(line);

    if (isDegree || (hasDate && !current)) {
      if (current) entries.push(current);
      const dates = line.match(/(\d{4})/g) || [];
      current = {
        id: `edu-${Date.now()}-${entries.length}`,
        institution: '',
        degree: isDegree ? line : '',
        fieldOfStudy: '',
        startDate: dates[0] || '',
        endDate: dates[1] || '',
        gpa: '',
        description: '',
      };
    } else if (current && !current.institution && /university|college|school|institute|iit|nit|bits/i.test(line)) {
      current.institution = line;
    } else if (current && !current.fieldOfStudy) {
      current.fieldOfStudy = line;
    } else if (current && /gpa|cgpa|percentage|grade/i.test(line)) {
      const num = line.match(/[\d.]+/);
      if (num) current.gpa = num[0];
    }
  }

  if (current) entries.push(current);
  return entries.filter(e => e.institution || e.degree);
}

function parseSkills(lines: string[]) {
  const entries: any[] = [];
  
  for (const line of lines) {
    if (!line.trim() || line.length < 2) continue;
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0 && colonIdx < 40) {
      // "Frontend: React, TypeScript, CSS"
      const category = line.slice(0, colonIdx).trim();
      const skills = line.slice(colonIdx + 1).trim();
      if (skills) {
        entries.push({
          id: `skill-${Date.now()}-${entries.length}`,
          category,
          name: skills,
          level: 'Expert',
        });
      }
    } else if (line.includes(',')) {
      // Comma-separated list without category label
      entries.push({
        id: `skill-${Date.now()}-${entries.length}`,
        category: 'Technical Skills',
        name: line,
        level: 'Expert',
      });
    }
  }

  if (entries.length === 0 && lines.length > 0) {
    entries.push({
      id: `skill-${Date.now()}`,
      category: 'Technical Skills',
      name: lines.join(', '),
      level: 'Expert',
    });
  }

  return entries;
}

function parseProjects(lines: string[]) {
  const entries: any[] = [];
  let current: any = null;
  const descLines: string[] = [];

  for (const line of lines) {
    const isTitle = /^[A-Z]/.test(line) && line.length < 80 && !line.includes('http');
    const isLink = line.includes('http') || line.includes('github.com');

    if (isTitle && line.length > 5) {
      if (current) {
        current.description = descLines.join(' ').trim();
        entries.push(current);
        descLines.length = 0;
      }
      current = {
        id: `proj-${Date.now()}-${entries.length}`,
        title: line,
        description: '',
        technologies: '',
        githubLink: '',
        liveLink: '',
        startDate: '',
        endDate: '',
        role: '',
        link: '',
      };
    } else if (current && isLink) {
      if (line.includes('github.com')) current.githubLink = line;
      else current.liveLink = line;
    } else if (current && /react|angular|vue|next|node|python|java|django|flask|typescript/i.test(line)) {
      current.technologies = line;
    } else if (current) {
      descLines.push(line);
    }
  }

  if (current) {
    current.description = descLines.join(' ').trim();
    entries.push(current);
  }

  return entries.filter(e => e.title);
}

function parseCertifications(lines: string[]) {
  return lines
    .filter(l => l.length > 5)
    .map((l, i) => {
      const dateMatch = l.match(/\d{4}/);
      const parts = l.split(/[-–|]/);
      return {
        id: `cert-${Date.now()}-${i}`,
        name: (parts[0] || l).trim(),
        issuer: (parts[1] || '').trim(),
        date: dateMatch?.[0] || '',
        link: '',
      };
    });
}

function parseAchievements(lines: string[]) {
  return lines
    .filter(l => l.length > 5)
    .map((l, i) => {
      const dateMatch = l.match(/\d{4}/);
      return {
        id: `ach-${Date.now()}-${i}`,
        title: l.replace(/^\d{4}[-\s]/, '').trim(),
        date: dateMatch?.[0] || '',
        issuer: '',
        description: '',
      };
    });
}
