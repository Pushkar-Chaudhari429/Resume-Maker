import { jsPDF } from 'jspdf';
import { ResumeData, ResumeTemplate } from '@/types/resume';

export function exportResumeToPdf(data: ResumeData, template: ResumeTemplate) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  const leftMargin = 45;
  const rightMargin = 45;
  const topMargin = 45;
  const bottomMargin = 45;
  const contentWidth = pageWidth - leftMargin - rightMargin;

  let y = topMargin;

  // Font adjustments based on template selection
  const fontMain = template === 'professional' ? 'times' : 'helvetica';
  const accentColor = template === 'modern' ? [59, 130, 246] : [15, 23, 42]; // Modern blue vs Slate

  // Helper: check page overflow and append pages
  function ensureSpace(heightNeeded: number): number {
    if (y + heightNeeded > pageHeight - bottomMargin) {
      doc.addPage();
      y = topMargin;
    }
    return y;
  }

  // Set initial font settings
  doc.setFont(fontMain, 'normal');

  // --- HEADER SECTION ---
  if (template === 'professional') {
    // Centered professional layout
    doc.setFont(fontMain, 'bold');
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text(data.personalInfo.fullName, pageWidth / 2, y, { align: 'center' });
    y += 18;

    doc.setFont(fontMain, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    const subHeader = [
      data.personalInfo.email,
      data.personalInfo.phone,
      data.personalInfo.linkedin,
      data.personalInfo.github,
      data.personalInfo.portfolio
    ].filter(Boolean).join('  |  ');
    doc.text(subHeader, pageWidth / 2, y, { align: 'center' });
    y += 15;
  } else {
    // Left-aligned Modern / Minimal Layout
    doc.setFont(fontMain, 'bold');
    doc.setFontSize(24);
    doc.setTextColor(15, 23, 42);
    doc.text(data.personalInfo.fullName, leftMargin, y);
    
    // Add colored modern accent block next to name
    if (template === 'modern') {
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.rect(leftMargin, y + 6, 80, 4, 'F');
      y += 12;
    }
    y += 18;

    doc.setFont(fontMain, 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(75, 85, 99);
    
    const contactLine1 = [
      data.personalInfo.email && `Email: ${data.personalInfo.email}`,
      data.personalInfo.phone && `Phone: ${data.personalInfo.phone}`,
    ].filter(Boolean).join('  •  ');
    
    const contactLine2 = [
      data.personalInfo.linkedin && `LinkedIn: ${data.personalInfo.linkedin}`,
      data.personalInfo.github && `GitHub: ${data.personalInfo.github}`,
      data.personalInfo.portfolio && `Portfolio: ${data.personalInfo.portfolio}`
    ].filter(Boolean).join('  •  ');

    doc.text(contactLine1, leftMargin, y);
    y += 14;
    doc.text(contactLine2, leftMargin, y);
    y += 15;
  }

  // Separator rule
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(1);
  doc.line(leftMargin, y, pageWidth - rightMargin, y);
  y += 15;

  // Generic helper to render section headers
  function renderSectionHeader(title: string) {
    y = ensureSpace(30);
    doc.setFont(fontMain, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text(title.toUpperCase(), leftMargin, y);
    
    y += 5;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1);
    doc.line(leftMargin, y, pageWidth - rightMargin, y);
    y += 12;
  }

  // 1. PROFESSIONAL SUMMARY
  if (data.personalInfo.summary) {
    renderSectionHeader('Professional Summary');
    doc.setFont(fontMain, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    
    const lines = doc.splitTextToSize(data.personalInfo.summary, contentWidth);
    const summaryHeight = lines.length * 14;
    y = ensureSpace(summaryHeight);
    
    lines.forEach((line: string) => {
      doc.text(line, leftMargin, y);
      y += 14;
    });
    y += 8;
  }

  // 2. EXPERIENCE
  if (data.experience.length > 0) {
    renderSectionHeader('Experience');
    
    data.experience.forEach((exp) => {
      // Estimate height: header (15) + lines * 14 + spacing (10)
      const descLines = doc.splitTextToSize(exp.description || '', contentWidth - 15);
      const entryHeight = 20 + (descLines.length * 14) + 10;
      y = ensureSpace(entryHeight);

      // Job Title & Company
      doc.setFont(fontMain, 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${exp.position} at ${exp.company}`, leftMargin, y);

      // Dates
      doc.setFont(fontMain, 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(100, 116, 139);
      const dateText = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
      doc.text(dateText, pageWidth - rightMargin, y, { align: 'right' });
      y += 15;

      // Description Bullet Points
      doc.setFont(fontMain, 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);

      // Split descriptions by newlines to render as actual bullets if they aren't already
      const paragraphs = (exp.description || '').split('\n').filter(Boolean);
      paragraphs.forEach((para) => {
        let cleanPara = para.trim();
        if (cleanPara.startsWith('•') || cleanPara.startsWith('-')) {
          cleanPara = cleanPara.substring(1).trim();
        }
        
        const lines = doc.splitTextToSize(cleanPara, contentWidth - 15);
        y = ensureSpace(lines.length * 13 + 5);
        
        lines.forEach((line: string, index: number) => {
          if (index === 0) {
            doc.text('•', leftMargin + 5, y);
            doc.text(line, leftMargin + 15, y);
          } else {
            doc.text(line, leftMargin + 15, y);
          }
          y += 13;
        });
      });
      y += 6;
    });
  }

  // 3. PROJECTS
  if (data.projects.length > 0) {
    renderSectionHeader('Projects');
    
    data.projects.forEach((proj) => {
      const descLines = doc.splitTextToSize(proj.description || '', contentWidth - 15);
      const entryHeight = 20 + (descLines.length * 14) + 10;
      y = ensureSpace(entryHeight);

      // Project Title & Role
      doc.setFont(fontMain, 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      const titleStr = proj.role ? `${proj.title} (${proj.role})` : proj.title;
      doc.text(titleStr, leftMargin, y);

      // Project Dates (Right aligned)
      if (proj.startDate || proj.endDate) {
        doc.setFont(fontMain, 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(100, 116, 139);
        const dateStr = `${proj.startDate || ''} - ${proj.endDate || ''}`;
        doc.text(dateStr, pageWidth - rightMargin, y, { align: 'right' });
      }
      y += 14;

      // Project Links
      doc.setFont(fontMain, 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(59, 130, 246);
      
      const linkParts: string[] = [];
      if (proj.githubLink) linkParts.push(`GitHub: ${proj.githubLink}`);
      if (proj.liveLink) linkParts.push(`Live: ${proj.liveLink}`);
      if (linkParts.length === 0 && proj.link) linkParts.push(proj.link);
      
      if (linkParts.length > 0) {
        doc.text(linkParts.join('  |  '), leftMargin, y);
        y += 13;
      }

      // Tech Stack
      doc.setFont(fontMain, 'italic');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Technologies: ${proj.technologies || ''}`, leftMargin, y);
      y += 13;

      // Project Description
      doc.setFont(fontMain, 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      
      const paragraphs = (proj.description || '').split('\n').filter(Boolean);
      paragraphs.forEach((para) => {
        let cleanPara = para.trim();
        if (cleanPara.startsWith('•') || cleanPara.startsWith('-')) {
          cleanPara = cleanPara.substring(1).trim();
        }
        
        const lines = doc.splitTextToSize(cleanPara, contentWidth - 15);
        y = ensureSpace(lines.length * 13 + 5);
        
        lines.forEach((line: string, index: number) => {
          if (index === 0) {
            doc.text('•', leftMargin + 5, y);
            doc.text(line, leftMargin + 15, y);
          } else {
            doc.text(line, leftMargin + 15, y);
          }
          y += 13;
        });
      });
      y += 6;
    });
  }

  // 4. SKILLS
  if (data.skills.length > 0) {
    renderSectionHeader('Technical Skills');
    
    data.skills.forEach((skill) => {
      const skillText = `${skill.category}: ${skill.name}`;
      const lines = doc.splitTextToSize(skillText, contentWidth);
      y = ensureSpace(lines.length * 14 + 5);
      
      doc.setFont(fontMain, 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      
      lines.forEach((line: string, index: number) => {
        // Bold the category name
        if (index === 0) {
          doc.setFont(fontMain, 'bold');
          doc.setTextColor(15, 23, 42);
          doc.text(`${skill.category}: `, leftMargin, y);
          
          const catWidth = doc.getTextWidth(`${skill.category}: `);
          doc.setFont(fontMain, 'normal');
          doc.setTextColor(51, 65, 85);
          
          // Draw the remaining part of line 1
          const remainingText = line.substring(`${skill.category}: `.length);
          doc.text(remainingText, leftMargin + catWidth, y);
        } else {
          doc.text(line, leftMargin, y);
        }
        y += 14;
      });
    });
    y += 5;
  }

  // 5. EDUCATION
  if (data.education.length > 0) {
    renderSectionHeader('Education');
    
    data.education.forEach((edu) => {
      const entryHeight = edu.description ? 35 : 20;
      y = ensureSpace(entryHeight);

      // Degree & Major
      doc.setFont(fontMain, 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${edu.degree} in ${edu.fieldOfStudy}`, leftMargin, y);

      // Dates
      doc.setFont(fontMain, 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`${edu.startDate} - ${edu.endDate}`, pageWidth - rightMargin, y, { align: 'right' });
      y += 14;

      // School Name & GPA
      doc.setFont(fontMain, 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const gpaStr = edu.gpa ? ` | GPA: ${edu.gpa}` : '';
      doc.text(`${edu.institution}${gpaStr}`, leftMargin, y);
      y += 14;

      if (edu.description) {
        const lines = doc.splitTextToSize(edu.description, contentWidth);
        y = ensureSpace(lines.length * 13 + 5);
        doc.setFont(fontMain, 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        lines.forEach((line: string) => {
          doc.text(line, leftMargin, y);
          y += 13;
        });
        y += 5;
      }
    });
  }

  // 6. CERTIFICATIONS
  if (data.certifications.length > 0) {
    renderSectionHeader('Certifications');
    
    data.certifications.forEach((cert) => {
      y = ensureSpace(20);

      // Cert Name & Issuer
      doc.setFont(fontMain, 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(`${cert.name} - ${cert.issuer}`, leftMargin, y);

      // Date
      doc.setFont(fontMain, 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(100, 116, 139);
      doc.text(cert.date, pageWidth - rightMargin, y, { align: 'right' });
      
      y += 14;
    });
  }

  // 7. ACHIEVEMENTS
  if (data.achievements && data.achievements.length > 0) {
    renderSectionHeader('Achievements');
    
    data.achievements.forEach((ach) => {
      const descLines = ach.description ? doc.splitTextToSize(ach.description, contentWidth) : [];
      const entryHeight = 18 + (descLines.length * 13) + 6;
      y = ensureSpace(entryHeight);

      // Achievement Title & Issuer
      doc.setFont(fontMain, 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      const titleStr = ach.issuer ? `${ach.title} - ${ach.issuer}` : ach.title;
      doc.text(titleStr, leftMargin, y);

      // Date
      doc.setFont(fontMain, 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(100, 116, 139);
      doc.text(ach.date, pageWidth - rightMargin, y, { align: 'right' });
      
      y += 14;

      if (ach.description) {
        doc.setFont(fontMain, 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        descLines.forEach((line: string) => {
          y = ensureSpace(13);
          doc.text(line, leftMargin, y);
          y += 13;
        });
      }
      y += 6;
    });
  }

  // 8. ADDITIONAL IMPORTED CONTENT
  if (data.additionalContent) {
    renderSectionHeader('Additional Imported Content');
    doc.setFont(fontMain, 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    
    const lines = doc.splitTextToSize(data.additionalContent, contentWidth);
    lines.forEach((line: string) => {
      y = ensureSpace(13);
      doc.text(line, leftMargin, y);
      y += 13;
    });
  }

  // Output filename
  const cleanName = data.personalInfo.fullName.replace(/\s+/g, '_') || 'Resume';
  doc.save(`${cleanName}_Resume.pdf`);
}
