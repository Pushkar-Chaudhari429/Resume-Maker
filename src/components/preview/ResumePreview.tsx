'use client';

import React, { forwardRef } from 'react';
import { ResumeData, ResumeTemplate } from '@/types/resume';

interface ResumePreviewProps {
  data: ResumeData;
  template: ResumeTemplate;
}

// forwardRef is required so parent can reference the printable container for window.print() or canvas selectors
export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ data, template }, ref) => {
    const { personalInfo, education, experience, projects, skills, certifications, achievements, additionalContent } = data;

    // Styles based on template type
    const isSerif = template === 'professional';
    const isModern = template === 'modern';
    
    const fontClass = isSerif ? 'font-serif' : 'font-sans';
    const primaryTextClass = 'text-slate-900';
    const accentBorderColor = isModern ? 'border-blue-500' : 'border-slate-800';
    const sectionTitleColor = isModern ? 'text-blue-600' : 'text-slate-900';

    return (
      <div 
        ref={ref}
        id="resume-preview-root"
        className={`print-container w-full max-w-[800px] min-h-[1050px] bg-white p-8 sm:p-12 text-slate-800 text-left shadow-lg border border-slate-200/50 dark:border-slate-800/10 rounded-sm leading-relaxed overflow-hidden ${fontClass}`}
        style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
      >
        {/* --- HEADER SECTION --- */}
        <div className="print-section mb-6">
          {template === 'professional' ? (
            /* Classic Centered Layout */
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
                {personalInfo.fullName || 'Your Full Name'}
              </h1>
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-slate-600">
                {personalInfo.email && <span className="print-text-muted">Email: {personalInfo.email}</span>}
                {personalInfo.phone && <span className="print-text-muted">Phone: {personalInfo.phone}</span>}
                {personalInfo.linkedin && <span className="print-text-muted">LinkedIn: {personalInfo.linkedin}</span>}
                {personalInfo.github && <span className="print-text-muted">GitHub: {personalInfo.github}</span>}
                {personalInfo.portfolio && <span className="print-text-muted">Portfolio: {personalInfo.portfolio}</span>}
              </div>
            </div>
          ) : (
            /* Left Aligned Layout (Modern & Minimal) */
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                {personalInfo.fullName || 'Your Full Name'}
              </h1>
              {isModern && (
                <div className="w-16 h-1 bg-blue-500 mt-2 mb-3" />
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-2">
                {personalInfo.email && <span className="print-text-muted">Email: {personalInfo.email}</span>}
                {personalInfo.phone && <span className="print-text-muted">Phone: {personalInfo.phone}</span>}
                {personalInfo.linkedin && <span className="print-text-muted">LinkedIn: {personalInfo.linkedin}</span>}
                {personalInfo.github && <span className="print-text-muted">GitHub: {personalInfo.github}</span>}
                {personalInfo.portfolio && <span className="print-text-muted">Portfolio: {personalInfo.portfolio}</span>}
              </div>
            </div>
          )}

          {/* Thin dividing line */}
          <div className={`border-b border-slate-200 mt-4 print-border`} />
        </div>


        {/* --- SUMMARY SECTION --- */}
        {personalInfo.summary && (
          <div className="mb-4 print-section">
            <h2 className={`text-xs font-bold uppercase tracking-wider ${sectionTitleColor} print-text-dark`}>
              Professional Summary
            </h2>
            <div className={`border-b-2 ${accentBorderColor} mt-1 mb-2 print-border`} />
            <p className="text-[10pt] leading-normal text-slate-700 print-text-dark">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* --- EXPERIENCE SECTION --- */}
        {experience.length > 0 && (
          <div className="mb-4 print-section">
            <h2 className={`text-xs font-bold uppercase tracking-wider ${sectionTitleColor} print-text-dark`}>
              Experience
            </h2>
            <div className={`border-b-2 ${accentBorderColor} mt-1 mb-2 print-border`} />
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="text-[10pt]">
                  <div className="flex justify-between font-bold text-slate-800 print-text-dark">
                    <span>{exp.position} — {exp.company}</span>
                    <span className="font-normal text-slate-500 text-xs print-text-muted">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <ul className="list-disc list-inside text-slate-700 mt-1 space-y-1 pl-1 print-text-dark">
                    {(exp.description || '').split('\n').filter(Boolean).map((bullet, index) => {
                      let cleanBullet = bullet.trim();
                      if (cleanBullet.startsWith('•') || cleanBullet.startsWith('-')) {
                        cleanBullet = cleanBullet.substring(1).trim();
                      }
                      return (
                        <li key={index} className="leading-snug">
                          {cleanBullet}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- PROJECTS SECTION --- */}
        {projects.length > 0 && (
          <div className="mb-4 print-section">
            <h2 className={`text-xs font-bold uppercase tracking-wider ${sectionTitleColor} print-text-dark`}>
              Projects
            </h2>
            <div className={`border-b-2 ${accentBorderColor} mt-1 mb-2 print-border`} />
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="text-[10pt]">
                  <div className="flex justify-between font-bold text-slate-800 print-text-dark">
                    <span>{proj.title} {proj.role && <span className="font-normal text-slate-500 text-xs">({proj.role})</span>}</span>
                    {(proj.startDate || proj.endDate) && (
                      <span className="font-normal text-slate-500 text-xs print-text-muted">
                        {proj.startDate || ''} - {proj.endDate || ''}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-[9pt] mb-1 flex-wrap gap-2">
                    <div className="italic text-slate-500 font-semibold print-text-muted">
                      Technologies: {proj.technologies}
                    </div>
                    <div className="flex gap-2 text-xs">
                      {proj.githubLink && (
                        <a href={proj.githubLink.startsWith('http') ? proj.githubLink : `https://${proj.githubLink}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline print-text-muted">
                          GitHub
                        </a>
                      )}
                      {proj.liveLink && (
                        <a href={proj.liveLink.startsWith('http') ? proj.liveLink : `https://${proj.liveLink}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline print-text-muted">
                          Live Demo
                        </a>
                      )}
                      {!proj.githubLink && !proj.liveLink && proj.link && (
                        <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline print-text-muted">
                          Link
                        </a>
                      )}
                    </div>
                  </div>
                  <ul className="list-disc list-inside text-slate-700 space-y-1 pl-1 print-text-dark">
                    {(proj.description || '').split('\n').filter(Boolean).map((bullet, index) => {
                      let cleanBullet = bullet.trim();
                      if (cleanBullet.startsWith('•') || cleanBullet.startsWith('-')) {
                        cleanBullet = cleanBullet.substring(1).trim();
                      }
                      return (
                        <li key={index} className="leading-snug">
                          {cleanBullet}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TECHNICAL SKILLS SECTION --- */}
        {skills.length > 0 && (
          <div className="mb-4 print-section">
            <h2 className={`text-xs font-bold uppercase tracking-wider ${sectionTitleColor} print-text-dark`}>
              Technical Skills
            </h2>
            <div className={`border-b-2 ${accentBorderColor} mt-1 mb-2 print-border`} />
            <div className="space-y-1 text-[10pt]">
              {skills.map((skill) => (
                <div key={skill.id} className="text-slate-700 print-text-dark">
                  <strong className="text-slate-900 print-text-dark">{skill.category}:</strong> {skill.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- EDUCATION SECTION --- */}
        {education.length > 0 && (
          <div className="mb-4 print-section">
            <h2 className={`text-xs font-bold uppercase tracking-wider ${sectionTitleColor} print-text-dark`}>
              Education
            </h2>
            <div className={`border-b-2 ${accentBorderColor} mt-1 mb-2 print-border`} />
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="text-[10pt]">
                  <div className="flex justify-between font-bold text-slate-800 print-text-dark">
                    <span>{edu.degree} in {edu.fieldOfStudy}</span>
                    <span className="font-normal text-slate-500 text-xs print-text-muted">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <div className="text-slate-700 print-text-dark">
                    {edu.institution} {edu.gpa && <span>— GPA: {edu.gpa}</span>}
                  </div>
                  {edu.description && (
                    <div className="text-[9pt] text-slate-500 italic mt-0.5 print-text-muted">
                      {edu.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- CERTIFICATIONS SECTION --- */}
        {certifications.length > 0 && (
          <div className="mb-4 print-section">
            <h2 className={`text-xs font-bold uppercase tracking-wider ${sectionTitleColor} print-text-dark`}>
              Certifications
            </h2>
            <div className={`border-b-2 ${accentBorderColor} mt-1 mb-2 print-border`} />
            <div className="space-y-1.5">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between text-[10pt] text-slate-700 print-text-dark">
                  <div>
                    <strong className="text-slate-900 print-text-dark">{cert.name}</strong> — {cert.issuer}
                  </div>
                  <span className="text-slate-500 text-xs print-text-muted">{cert.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ACHIEVEMENTS SECTION --- */}
        {achievements && achievements.length > 0 && (
          <div className="mb-4 print-section">
            <h2 className={`text-xs font-bold uppercase tracking-wider ${sectionTitleColor} print-text-dark`}>
              Achievements & Awards
            </h2>
            <div className={`border-b-2 ${accentBorderColor} mt-1 mb-2 print-border`} />
            <div className="space-y-2">
              {achievements.map((ach) => (
                <div key={ach.id} className="text-[10pt]">
                  <div className="flex justify-between font-bold text-slate-800 print-text-dark">
                    <span>{ach.title} {ach.issuer && <span className="font-normal text-slate-500 text-xs">({ach.issuer})</span>}</span>
                    <span className="font-normal text-slate-500 text-xs print-text-muted">{ach.date}</span>
                  </div>
                  {ach.description && (
                    <p className="text-slate-700 mt-0.5 print-text-dark text-[9.5pt] leading-normal">{ach.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ADDITIONAL IMPORTED CONTENT --- */}
        {additionalContent && (
          <div className="mb-4 print-section no-print border-t border-dashed border-slate-200 pt-4 mt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Additional Imported Content (Not Printed)
            </h2>
            <p className="text-[9pt] leading-relaxed text-slate-500 mt-1 whitespace-pre-line">
              {additionalContent}
            </p>
          </div>
        )}
      </div>
    );
  }
);

ResumePreview.displayName = 'ResumePreview';
