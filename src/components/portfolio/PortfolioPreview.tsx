'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  Globe, Mail, Phone, Code2, FolderGit, GraduationCap, Send, ExternalLink, Award
} from 'lucide-react';
import { ResumeData } from '@/types/resume';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TiltCard } from '@/components/ui/TiltCard';

interface PortfolioPreviewProps {
  data: ResumeData;
}

export function PortfolioPreview({ data }: PortfolioPreviewProps) {
  const { personalInfo, education, experience, projects, skills, certifications, achievements } = data;
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll Progress Tracker inside the preview panel container
  const { scrollYProgress } = useScroll({
    container: containerRef
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  } as const;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  } as const;

  return (
    <div 
      ref={containerRef}
      className="w-full h-[950px] overflow-y-auto bg-slate-950 text-slate-100 rounded-2xl border border-slate-900 font-sans relative scroll-smooth"
    >
      {/* Dynamic Top Reading Progress Scroll Bar */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 origin-left z-50"
        style={{ scaleX }}
      />
      
      {/* Portfolio Header Bar */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <span className="text-sm font-extrabold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent select-none">
          {personalInfo.fullName ? personalInfo.fullName.split(' ').map(n => n[0]).join('') : 'RF'}
        </span>
        <div className="flex gap-4 text-xs font-semibold text-slate-400 select-none">
          <a href="#portfolio-about" className="hover:text-blue-400 transition-colors">About</a>
          <a href="#portfolio-skills" className="hover:text-blue-400 transition-colors">Skills</a>
          <a href="#portfolio-projects" className="hover:text-blue-400 transition-colors">Projects</a>
          {certifications && certifications.length > 0 && (
            <a href="#portfolio-certifications" className="hover:text-blue-400 transition-colors">Certificates</a>
          )}
          {achievements && achievements.length > 0 && (
            <a href="#portfolio-achievements" className="hover:text-blue-400 transition-colors">Awards</a>
          )}
          <a href="#portfolio-contact" className="hover:text-blue-400 transition-colors">Contact</a>
        </div>
      </div>

      <div className="px-6 py-12 sm:px-12 space-y-24">
        
        {/* --- HERO SECTION --- */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center space-y-6 pt-6"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-semibold tracking-wide uppercase select-none">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            Available for Opportunities
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-3xl sm:text-5xl font-black tracking-tight leading-tight"
          >
            Hi, I'm{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {personalInfo.fullName || 'John Doe'}
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed"
          >
            {personalInfo.summary || 'A passionate software developer creating high-performance web applications and sleek visual experiences.'}
          </motion.p>

          <motion.div variants={itemVariants} className="flex justify-center gap-3">
            {personalInfo.linkedin && (
              <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                <Button variant="glass" className="p-2.5 rounded-xl">
                  <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </Button>
              </a>
            )}
            {personalInfo.github && (
              <a href={`https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
                <Button variant="glass" className="p-2.5 rounded-xl">
                  <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </Button>
              </a>
            )}
            {personalInfo.portfolio && (
              <a href={`https://${personalInfo.portfolio}`} target="_blank" rel="noopener noreferrer" aria-label="Portfolio link">
                <Button variant="glass" className="p-2.5 rounded-xl"><Globe size={18} /></Button>
              </a>
            )}
          </motion.div>
        </motion.section>

        {/* --- ABOUT & EDUCATION SECTION --- */}
        <motion.section 
          id="portfolio-about" 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="space-y-6 scroll-mt-20"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-slate-900">
            <GraduationCap className="text-blue-400" size={20} />
            <h2 className="text-lg font-bold text-slate-100">About & Education</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <p className="text-sm text-slate-400 leading-relaxed">
                {personalInfo.summary || 'Summary description details about my technical journey, challenges tackled, and core engineering philosophy.'}
              </p>
              
              {experience.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Latest Work</h4>
                  {experience.slice(0, 1).map((exp) => (
                    <div key={exp.id} className="text-xs bg-slate-900/40 p-3.5 rounded-xl border border-slate-900">
                      <div className="flex justify-between font-bold text-slate-200">
                        <span>{exp.position} at {exp.company}</span>
                        <span className="font-normal text-slate-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                      </div>
                      <p className="text-slate-400 mt-1 line-clamp-2">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Education</h4>
              {education.length === 0 ? (
                <span className="text-xs text-slate-600 block">No education entered.</span>
              ) : (
                education.map((edu) => (
                  <div key={edu.id} className="p-3 border border-slate-900 bg-slate-900/30 rounded-xl space-y-1">
                    <h5 className="text-xs font-bold text-slate-200">{edu.degree}</h5>
                    <p className="text-[11px] text-slate-400">{edu.fieldOfStudy}</p>
                    <p className="text-[10px] text-slate-500">{edu.institution} • {edu.endDate}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.section>

        {/* --- SKILLS SECTION --- */}
        <motion.section 
          id="portfolio-skills" 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="space-y-6 scroll-mt-20"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-slate-900">
            <Code2 className="text-blue-400" size={20} />
            <h2 className="text-lg font-bold text-slate-100">Technical Skillset</h2>
          </div>

          {skills.length === 0 ? (
            <span className="text-xs text-slate-600">No skills categories entered yet.</span>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {skills.map((skill) => (
                <TiltCard key={skill.id} className="bg-slate-900/30 border-slate-900" glow={true}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-bold text-blue-400">{skill.category}</h4>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{skill.level || 'Expert'}</span>
                  </div>
                  
                  {/* Category level progress bar */}
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mb-3.5 border border-slate-900/50">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: skill.level === 'Expert' ? '95%' : 
                               skill.level === 'Advanced' ? '80%' : 
                               skill.level === 'Intermediate' ? '65%' : '45%' 
                      }}
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {(skill.name || '').split(',').map((item, idx) => (
                      <span 
                        key={idx} 
                        className="px-2.5 py-1 text-[11px] font-semibold bg-slate-950 border border-slate-900 text-slate-400 rounded-lg hover:border-slate-700 hover:text-slate-200 transition-colors cursor-default"
                      >
                        {item.trim()}
                      </span>
                    ))}
                  </div>
                </TiltCard>
              ))}
            </div>
          )}
        </motion.section>

        {/* --- PROJECTS SECTION --- */}
        <motion.section 
          id="portfolio-projects" 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="space-y-6 scroll-mt-20"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-slate-900">
            <FolderGit className="text-blue-400" size={20} />
            <h2 className="text-lg font-bold text-slate-100">Featured Projects</h2>
          </div>

          {projects.length === 0 ? (
            <span className="text-xs text-slate-600">No projects listed.</span>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <TiltCard key={proj.id} className="flex flex-col justify-between h-full bg-slate-900/30 border-slate-900" glow={true}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-200">{proj.title}</h4>
                        {(proj.startDate || proj.endDate) && (
                          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                            {proj.startDate || ''} - {proj.endDate || ''}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {proj.githubLink && (
                          <a 
                            href={proj.githubLink.startsWith('http') ? proj.githubLink : `https://${proj.githubLink}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-blue-400 transition-colors"
                            title="GitHub Repository"
                          >
                            <span className="text-xs font-semibold">GitHub</span>
                          </a>
                        )}
                        {proj.liveLink && (
                          <a 
                            href={proj.liveLink.startsWith('http') ? proj.liveLink : `https://${proj.liveLink}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-blue-400 transition-colors"
                            title="Live Demo"
                          >
                            <span className="text-xs font-semibold">Live</span>
                          </a>
                        )}
                        {!proj.githubLink && !proj.liveLink && proj.link && (
                          <a 
                            href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-blue-400 transition-colors"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                    {proj.role && (
                      <span className="inline-block text-[10px] uppercase font-bold text-blue-400/80 bg-blue-400/5 px-2 py-0.5 rounded border border-blue-400/10 select-none">
                        {proj.role}
                      </span>
                    )}
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-slate-900 flex flex-wrap gap-1">
                    {(proj.technologies || '').split(',').map((tech, idx) => (
                      <span key={idx} className="text-[10px] text-slate-500 font-medium bg-slate-950 px-2 py-0.5 rounded select-none">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </TiltCard>
              ))}
            </div>
          )}
        </motion.section>

        {/* --- CERTIFICATIONS SECTION --- */}
        {certifications && certifications.length > 0 && (
          <motion.section 
            id="portfolio-certifications" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="space-y-6 scroll-mt-20"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-slate-900">
              <Award className="text-blue-400" size={20} />
              <h2 className="text-lg font-bold text-slate-100">Certifications</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {certifications.map((cert) => (
                <TiltCard key={cert.id} className="bg-slate-900/30 border-slate-900 flex flex-col justify-between" glow={true}>
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between items-start flex-wrap gap-1">
                      <h4 className="text-sm font-extrabold text-slate-200">{cert.name}</h4>
                      <span className="text-[10px] text-slate-500 font-bold">{cert.date}</span>
                    </div>
                    {cert.issuer && (
                      <span className="text-[10px] text-blue-400 font-semibold block">{cert.issuer}</span>
                    )}
                    {cert.link && (
                      <a 
                        href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-2"
                      >
                        Verify Credential <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </TiltCard>
              ))}
            </div>
          </motion.section>
        )}

        {/* --- ACHIEVEMENTS SECTION --- */}
        {achievements && achievements.length > 0 && (
          <motion.section 
            id="portfolio-achievements" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="space-y-6 scroll-mt-20"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-slate-900">
              <Award className="text-blue-400" size={20} />
              <h2 className="text-lg font-bold text-slate-100">Awards & Honors</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {achievements.map((ach) => (
                <TiltCard key={ach.id} className="bg-slate-900/30 border-slate-900 flex flex-col justify-between" glow={true}>
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between items-start flex-wrap gap-1">
                      <h4 className="text-sm font-extrabold text-slate-200">{ach.title}</h4>
                      <span className="text-[10px] text-slate-500 font-bold">{ach.date}</span>
                    </div>
                    {ach.issuer && (
                      <span className="text-[10px] text-blue-400 font-semibold block">{ach.issuer}</span>
                    )}
                    {ach.description && (
                      <p className="text-xs text-slate-400 leading-relaxed pt-1 border-t border-slate-900/50">{ach.description}</p>
                    )}
                  </div>
                </TiltCard>
              ))}
            </div>
          </motion.section>
        )}
        <motion.section 
          id="portfolio-contact" 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="space-y-6 scroll-mt-20 pb-6"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-slate-900">
            <Mail className="text-blue-400" size={20} />
            <h2 className="text-lg font-bold text-slate-100">Get In Touch</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-4 text-sm text-slate-400">
              <p>Have an exciting opportunity or project? Feel free to drop a message, I will get back to you as soon as possible.</p>
              
              <div className="space-y-2 pt-2 text-xs">
                {personalInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-blue-400" />
                    <span>{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-blue-400" />
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="md:col-span-3 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Name" id="portfolio-contact-name" value="" onChange={() => {}} disabled />
                <Input label="Email" id="portfolio-contact-email" value="" onChange={() => {}} disabled />
              </div>
              <Textarea label="Message" id="portfolio-contact-msg" rows={3} value="" onChange={() => {}} disabled />
              
              <Button type="button" disabled variant="primary" className="w-full text-xs py-2">
                <Send size={12} /> Send Message (Demo)
              </Button>
            </form>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
