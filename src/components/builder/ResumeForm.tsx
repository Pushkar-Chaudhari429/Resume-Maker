'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Briefcase, GraduationCap, FolderGit, Cpu, Award, Plus, Trash2, Copy,
  ChevronUp, ChevronDown, GripVertical
} from 'lucide-react';
import { ResumeData } from '@/types/resume';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TiltCard } from '@/components/ui/TiltCard';

// ─── Helper: Resolve nested RHF errors ─────────────────────────────────────
const getNestedError = (errors: any, path: string): string | undefined => {
  return path.split('.').reduce((obj, key) => obj?.[key], errors)?.message;
};

// ─── FormInput ──────────────────────────────────────────────────────────────
export interface FormInputProps extends Omit<React.ComponentPropsWithoutRef<typeof Input>, 'value' | 'onChange' | 'onBlur'> {
  name: string;
}
export function FormInput({ name, ...props }: FormInputProps) {
  const { control, formState: { errors } } = useFormContext<ResumeData>();
  const error = getNestedError(errors, name);
  return (
    <Controller
      name={name as any}
      control={control}
      render={({ field }) => <Input {...props} {...field} error={error} />}
    />
  );
}

// ─── FormTextarea ────────────────────────────────────────────────────────────
export interface FormTextareaProps extends Omit<React.ComponentPropsWithoutRef<typeof Textarea>, 'value' | 'onChange' | 'onBlur'> {
  name: string;
}
export function FormTextarea({ name, ...props }: FormTextareaProps) {
  const { control, formState: { errors } } = useFormContext<ResumeData>();
  const error = getNestedError(errors, name);
  return (
    <Controller
      name={name as any}
      control={control}
      render={({ field }) => <Textarea {...props} {...field} error={error} />}
    />
  );
}

// ─── FormSelect ──────────────────────────────────────────────────────────────
export interface FormSelectProps extends Omit<React.ComponentPropsWithoutRef<'select'>, 'value' | 'onChange' | 'onBlur'> {
  name: string;
  label: string;
  children: React.ReactNode;
}
export function FormSelect({ name, label, children, ...props }: FormSelectProps) {
  const { control, formState: { errors } } = useFormContext<ResumeData>();
  const error = getNestedError(errors, name);
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 select-none mb-1">{label}</label>
      <Controller
        name={name as any}
        control={control}
        render={({ field }) => (
          <select
            {...props}
            {...field}
            className="w-full px-3 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-800 dark:text-slate-200 focus:border-primary transition-colors cursor-pointer"
          >
            {children}
          </select>
        )}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}

// ─── FormCheckbox ────────────────────────────────────────────────────────────
export interface FormCheckboxProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'type' | 'value' | 'onChange' | 'onBlur'> {
  name: string;
  label: string;
}
export function FormCheckbox({ name, label, ...props }: FormCheckboxProps) {
  const { control } = useFormContext<ResumeData>();
  return (
    <Controller
      name={name as any}
      control={control}
      render={({ field: { value, onChange, ...field } }) => (
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 cursor-pointer select-none mt-6">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
            {...props}
            {...field}
          />
          {label}
        </label>
      )}
    />
  );
}

// ─── SectionCard: Card wrapper for each list entry ─────────────────────────
interface SectionCardProps {
  index: number;
  total: number;
  isNew?: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
  children: React.ReactNode;
}

function SectionCard({ index, total, isNew, onMoveUp, onMoveDown, onDuplicate, onRemove, children }: SectionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isNew && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      const firstInput = cardRef.current.querySelector<HTMLInputElement | HTMLTextAreaElement>('input:not([type=hidden]), textarea');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 80);
      }
    }
  }, [isNew]);

  return (
    <div ref={cardRef} className="space-y-3 relative">
      <div className="flex items-center justify-between no-print mb-1.5">
        {total > 1 ? (
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider select-none">
            Entry #{index + 1}
          </span>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-1.5">
          {total > 1 && (
            <>
              <button
                type="button"
                disabled={index === 0}
                onClick={onMoveUp}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20 transition-all cursor-pointer"
                title="Move Up"
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                disabled={index === total - 1}
                onClick={onMoveDown}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20 transition-all cursor-pointer"
                title="Move Down"
              >
                <ChevronDown size={14} />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onDuplicate}
            className="p-1 px-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10 transition-all cursor-pointer flex items-center gap-1"
            title="Copy Entry"
          >
            <Copy size={11} />
            Copy
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1 px-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 transition-all cursor-pointer flex items-center gap-1"
            title="Delete Entry"
          >
            <Trash2 size={11} />
            Delete
          </button>
        </div>
      </div>
      {children}
      {total > 1 && index < total - 1 && (
        <hr className="border-slate-200/50 dark:border-slate-800/50 my-6 no-print" />
      )}
    </div>
  );
}

// ─── EmptyState ──────────────────────────────────────────────────────────────
function EmptyState({ label, onAdd }: { label: string; onAdd: () => void }) {
  return (
    <button
      type="button"
      onClick={() => {
        console.log("EmptyState clicked:", label);
        onAdd();
      }}
      className="w-full flex flex-col items-center justify-center py-10 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 bg-slate-50/30 dark:bg-slate-950/20 text-center gap-3 transition-colors duration-200 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-primary/50"
    >
      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 group-hover:bg-blue-500/10 flex items-center justify-center transition-colors">
        <Plus size={18} className="text-slate-400 group-hover:text-primary transition-colors" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">No entries yet</p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Click <span className="font-bold text-primary group-hover:underline">{label}</span> to add your first entry</p>
      </div>
    </button>
  );
}

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, onAdd, addLabel }: {
  icon: React.ElementType;
  title: string;
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <div className="flex justify-between items-center mb-1">
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <Icon size={15} className="text-primary" />
        {title}
      </h3>
      <Button
        type="button"
        variant="glass"
        onClick={() => {
          console.log("SectionHeader Add Button clicked:", addLabel);
          onAdd();
        }}
        className="py-1 px-3 text-xs gap-1 h-7"
      >
        <Plus size={13} />
        {addLabel}
      </Button>
    </div>
  );
}

// ─── Main ResumeForm ─────────────────────────────────────────────────────────
export function ResumeForm() {
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [newIdx, setNewIdx] = useState<Record<string, number>>({});

  const { register, control, getValues, watch, formState: { errors } } = useFormContext<ResumeData>();

  // Field arrays for all 6 dynamic sections
  const { fields: eduFields, append: appendEdu, remove: removeEdu, move: moveEdu, insert: insertEdu } = useFieldArray({ control, name: 'education' });
  const { fields: expFields, append: appendExp, remove: removeExp, move: moveExp, insert: insertExp } = useFieldArray({ control, name: 'experience' });
  const { fields: projFields, append: appendProj, remove: removeProj, move: moveProj, insert: insertProj } = useFieldArray({ control, name: 'projects' });
  const { fields: skillFields, append: appendSkill, remove: removeSkill, move: moveSkill, insert: insertSkill } = useFieldArray({ control, name: 'skills' });
  const { fields: certFields, append: appendCert, remove: removeCert, move: moveCert, insert: insertCert } = useFieldArray({ control, name: 'certifications' });
  const { fields: achFields, append: appendAch, remove: removeAch, move: moveAch, insert: insertAch } = useFieldArray({ control, name: 'achievements' });

  // Automatically initialize all dynamic sections with at least one blank entry so they work exactly like Personal Info
  useEffect(() => {
    if (eduFields.length === 0) appendEdu({ id: `edu-${Date.now()}`, institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '', description: '' });
    if (expFields.length === 0) appendExp({ id: `exp-${Date.now()}`, company: '', position: '', startDate: '', endDate: '', current: false, description: '' });
    if (projFields.length === 0) appendProj({ id: `proj-${Date.now()}`, title: '', description: '', technologies: '', link: '', role: '', githubLink: '', liveLink: '', startDate: '', endDate: '' });
    if (skillFields.length === 0) appendSkill({ id: `skill-${Date.now()}`, category: '', name: '', level: 'Expert' });
    if (certFields.length === 0) appendCert({ id: `cert-${Date.now()}`, name: '', issuer: '', date: '', link: '' });
    if (achFields.length === 0) appendAch({ id: `ach-${Date.now()}`, title: '', date: '', issuer: '', description: '' });
  }, [
    eduFields.length, expFields.length, projFields.length, skillFields.length, certFields.length, achFields.length,
    appendEdu, appendExp, appendProj, appendSkill, appendCert, appendAch
  ]);

  // Helpers
  const up = (moveFn: (a: number, b: number) => void, i: number) => { if (i > 0) moveFn(i, i - 1); };
  const down = (moveFn: (a: number, b: number) => void, i: number, len: number) => { if (i < len - 1) moveFn(i, i + 1); };
  const dup = (name: keyof ResumeData, insertFn: (i: number, v: any) => void, i: number) => {
    const item = getValues(`${name}.${i}` as any);
    insertFn(i + 1, { ...item, id: `${name}-${Date.now()}` });
  };

  const addAndTrack = (section: string, appendFn: (v: any) => void, value: any, currentLen: number) => {
    console.log(`[ResumeForm] addAndTrack for section "${section}" - Before append, length:`, currentLen);
    appendFn(value);
    console.log(`[ResumeForm] addAndTrack for section "${section}" - After append`);
    setNewIdx(prev => ({ ...prev, [section]: currentLen }));
  };

  const sections = [
    { id: 'personal', name: 'Personal', icon: User },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'projects', name: 'Projects', icon: FolderGit },
    { id: 'skills', name: 'Skills', icon: Cpu },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'certifications', name: 'Certs', icon: Award },
    { id: 'achievements', name: 'Achieve', icon: Award },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Section Nav */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 w-full no-print">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          const hasErr = Object.keys(errors).some(k =>
            sec.id === 'personal' ? k.startsWith('personalInfo') : k.startsWith(sec.id)
          );
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-primary/10 border-primary/50 text-primary shadow-sm shadow-primary/10'
                  : 'bg-white/50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 hover:bg-white dark:hover:bg-slate-900/70 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {hasErr && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />}
              <Icon size={15} className="mb-1" />
              <span className="text-[9px] font-bold tracking-wide uppercase select-none leading-none">{sec.name}</span>
            </button>
          );
        })}
      </div>

      {/* Section Content Panel */}
      <TiltCard className="glass-panel" glow={false}>
        <div>

          {/* ── PERSONAL DETAILS ─────────────────────────────────── */}
          {activeSection === 'personal' && (
            <div className="space-y-3 text-left">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-1">
                <User size={15} className="text-primary" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormInput label="Full Name" name="personalInfo.fullName" />
                <FormInput label="Email Address" name="personalInfo.email" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormInput label="Phone Number" name="personalInfo.phone" />
                <FormInput label="Portfolio Website" name="personalInfo.portfolio" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormInput label="LinkedIn Profile" name="personalInfo.linkedin" />
                <FormInput label="GitHub Profile" name="personalInfo.github" />
              </div>
              <FormTextarea label="Professional Summary" name="personalInfo.summary" rows={4} />
            </div>
          )}

          {/* ── WORK EXPERIENCE ──────────────────────────────────── */}
          {activeSection === 'experience' && (
            <div className="space-y-3 text-left">
              <SectionHeader icon={Briefcase} title="Work Experience" addLabel="Add Experience" onAdd={() => addAndTrack('experience', appendExp, { id: `exp-${Date.now()}`, company: '', position: '', startDate: '', endDate: '', current: false, description: '' }, expFields.length)} />
              {expFields.length === 0
                ? <EmptyState label="Add Experience" onAdd={() => addAndTrack('experience', appendExp, { id: `exp-${Date.now()}`, company: '', position: '', startDate: '', endDate: '', current: false, description: '' }, expFields.length)} />
                : expFields.map((field, idx) => {
                    console.log("[ResumeForm] Rendering experience field at index:", idx, "id:", field.id);
                    return (
                      <SectionCard key={field.id} index={idx} total={expFields.length} isNew={newIdx.experience === idx} onMoveUp={() => up(moveExp, idx)} onMoveDown={() => down(moveExp, idx, expFields.length)} onDuplicate={() => dup('experience', insertExp, idx)} onRemove={() => removeExp(idx)}>
                        <input type="hidden" {...register(`experience.${idx}.id`)} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <FormInput label="Company Name" name={`experience.${idx}.company`} />
                          <FormInput label="Job Title / Position" name={`experience.${idx}.position`} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
                          <FormInput label="Start Date" name={`experience.${idx}.startDate`} placeholder="e.g. 2023-01" />
                          <FormInput label="End Date" name={`experience.${idx}.endDate`} placeholder="e.g. 2025-06" disabled={watch(`experience.${idx}.current` as any)} />
                          <FormCheckbox label="Current Role" name={`experience.${idx}.current`} />
                        </div>
                        <FormTextarea label="Job Description / Achievements" name={`experience.${idx}.description`} rows={3} placeholder="Describe your key responsibilities and achievements..." />
                      </SectionCard>
                    );
                  })
                }
            </div>
          )}

          {/* ── KEY PROJECTS ─────────────────────────────────────── */}
          {activeSection === 'projects' && (
            <div className="space-y-3 text-left">
              <SectionHeader icon={FolderGit} title="Key Projects" addLabel="Add Project" onAdd={() => addAndTrack('projects', appendProj, { id: `proj-${Date.now()}`, title: '', description: '', technologies: '', link: '', role: '', githubLink: '', liveLink: '', startDate: '', endDate: '' }, projFields.length)} />
              {projFields.length === 0
                ? <EmptyState label="Add Project" onAdd={() => addAndTrack('projects', appendProj, { id: `proj-${Date.now()}`, title: '', description: '', technologies: '', link: '', role: '', githubLink: '', liveLink: '', startDate: '', endDate: '' }, projFields.length)} />
                : projFields.map((field, idx) => {
                    console.log("[ResumeForm] Rendering project field at index:", idx, "id:", field.id);
                    return (
                      <SectionCard key={field.id} index={idx} total={projFields.length} isNew={newIdx.projects === idx} onMoveUp={() => up(moveProj, idx)} onMoveDown={() => down(moveProj, idx, projFields.length)} onDuplicate={() => dup('projects', insertProj, idx)} onRemove={() => removeProj(idx)}>
                        <input type="hidden" {...register(`projects.${idx}.id`)} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <FormInput label="Project Title" name={`projects.${idx}.title`} />
                          <FormInput label="Technologies Used" name={`projects.${idx}.technologies`} placeholder="React, Next.js, TypeScript..." />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <FormInput label="GitHub URL" name={`projects.${idx}.githubLink`} placeholder="https://github.com/..." />
                          <FormInput label="Live URL" name={`projects.${idx}.liveLink`} placeholder="https://..." />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <FormInput label="Start Date" name={`projects.${idx}.startDate`} placeholder="YYYY-MM" />
                          <FormInput label="End Date" name={`projects.${idx}.endDate`} placeholder="YYYY-MM or Present" />
                          <FormInput label="Your Role" name={`projects.${idx}.role`} placeholder="Lead Developer" />
                        </div>
                        <FormTextarea label="Project Description" name={`projects.${idx}.description`} rows={3} placeholder="Describe the project, your impact, and the outcome..." />
                      </SectionCard>
                    );
                  })
                }
            </div>
          )}

          {/* ── TECHNICAL SKILLS ─────────────────────────────────── */}
          {activeSection === 'skills' && (
            <div className="space-y-3 text-left">
              <SectionHeader icon={Cpu} title="Technical Skills" addLabel="Add Category" onAdd={() => addAndTrack('skills', appendSkill, { id: `skill-${Date.now()}`, category: '', name: '', level: 'Expert' }, skillFields.length)} />
              {skillFields.length === 0
                ? <EmptyState label="Add Category" onAdd={() => addAndTrack('skills', appendSkill, { id: `skill-${Date.now()}`, category: '', name: '', level: 'Expert' }, skillFields.length)} />
                : skillFields.map((field, idx) => {
                    console.log("[ResumeForm] Rendering skill field at index:", idx, "id:", field.id);
                    return (
                      <SectionCard key={field.id} index={idx} total={skillFields.length} isNew={newIdx.skills === idx} onMoveUp={() => up(moveSkill, idx)} onMoveDown={() => down(moveSkill, idx, skillFields.length)} onDuplicate={() => dup('skills', insertSkill, idx)} onRemove={() => removeSkill(idx)}>
                        <input type="hidden" {...register(`skills.${idx}.id`)} />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <FormInput label="Skill Category" name={`skills.${idx}.category`} placeholder="e.g. Frontend, Backend, Tools" />
                          </div>
                          <FormSelect label="Proficiency" name={`skills.${idx}.level`}>
                            <option value="Expert">Expert</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Beginner">Beginner</option>
                          </FormSelect>
                        </div>
                        <FormInput label="Skills (comma-separated)" name={`skills.${idx}.name`} placeholder="React, TypeScript, Next.js, CSS Modules..." />
                      </SectionCard>
                    );
                  })
                }
            </div>
          )}

          {/* ── EDUCATION ────────────────────────────────────────── */}
          {activeSection === 'education' && (
            <div className="space-y-3 text-left">
              <SectionHeader icon={GraduationCap} title="Education" addLabel="Add Education" onAdd={() => addAndTrack('education', appendEdu, { id: `edu-${Date.now()}`, institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '', description: '' }, eduFields.length)} />
              {eduFields.length === 0
                ? <EmptyState label="Add Education" onAdd={() => addAndTrack('education', appendEdu, { id: `edu-${Date.now()}`, institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '', description: '' }, eduFields.length)} />
                : eduFields.map((field, idx) => {
                    console.log("[ResumeForm] Rendering education field at index:", idx, "id:", field.id);
                    return (
                      <SectionCard key={field.id} index={idx} total={eduFields.length} isNew={newIdx.education === idx} onMoveUp={() => up(moveEdu, idx)} onMoveDown={() => down(moveEdu, idx, eduFields.length)} onDuplicate={() => dup('education', insertEdu, idx)} onRemove={() => removeEdu(idx)}>
                        <input type="hidden" {...register(`education.${idx}.id`)} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <FormInput label="Institution / School" name={`education.${idx}.institution`} />
                          <FormInput label="Degree" name={`education.${idx}.degree`} placeholder="B.Tech, M.Sc..." />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <FormInput label="Field of Study" name={`education.${idx}.fieldOfStudy`} placeholder="Computer Science" />
                          <FormInput label="Start Year" name={`education.${idx}.startDate`} placeholder="2020" />
                          <FormInput label="End Year" name={`education.${idx}.endDate`} placeholder="2024" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <FormInput label="GPA / Grade" name={`education.${idx}.gpa`} placeholder="9.2/10 or 3.9/4.0" />
                          <FormInput label="Honors / Notes" name={`education.${idx}.description`} placeholder="Dean's List, Research Fellowship..." />
                        </div>
                      </SectionCard>
                    );
                  })
                }
            </div>
          )}

          {/* ── CERTIFICATIONS ───────────────────────────────────── */}
          {activeSection === 'certifications' && (
            <div className="space-y-3 text-left">
              <SectionHeader icon={Award} title="Certifications" addLabel="Add Certification" onAdd={() => addAndTrack('certifications', appendCert, { id: `cert-${Date.now()}`, name: '', issuer: '', date: '', link: '' }, certFields.length)} />
              {certFields.length === 0
                ? <EmptyState label="Add Certification" onAdd={() => addAndTrack('certifications', appendCert, { id: `cert-${Date.now()}`, name: '', issuer: '', date: '', link: '' }, certFields.length)} />
                : certFields.map((field, idx) => {
                    console.log("[ResumeForm] Rendering certification field at index:", idx, "id:", field.id);
                    return (
                      <SectionCard key={field.id} index={idx} total={certFields.length} isNew={newIdx.certifications === idx} onMoveUp={() => up(moveCert, idx)} onMoveDown={() => down(moveCert, idx, certFields.length)} onDuplicate={() => dup('certifications', insertCert, idx)} onRemove={() => removeCert(idx)}>
                        <input type="hidden" {...register(`certifications.${idx}.id`)} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <FormInput label="Certification Name" name={`certifications.${idx}.name`} />
                          <FormInput label="Issuing Organization" name={`certifications.${idx}.issuer`} placeholder="AWS, Google, Coursera..." />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <FormInput label="Issue Date" name={`certifications.${idx}.date`} placeholder="2024 or 2024-06" />
                          <FormInput label="Verification Link" name={`certifications.${idx}.link`} placeholder="https://..." />
                        </div>
                      </SectionCard>
                    );
                  })
                }
            </div>
          )}

          {/* ── ACHIEVEMENTS ─────────────────────────────────────── */}
          {activeSection === 'achievements' && (
            <div className="space-y-3 text-left">
              <SectionHeader icon={Award} title="Achievements" addLabel="Add Achievement" onAdd={() => addAndTrack('achievements', appendAch, { id: `ach-${Date.now()}`, title: '', date: '', issuer: '', description: '' }, achFields.length)} />
              {achFields.length === 0
                ? <EmptyState label="Add Achievement" onAdd={() => addAndTrack('achievements', appendAch, { id: `ach-${Date.now()}`, title: '', date: '', issuer: '', description: '' }, achFields.length)} />
                : achFields.map((field, idx) => {
                    console.log("[ResumeForm] Rendering achievement field at index:", idx, "id:", field.id);
                    return (
                      <SectionCard key={field.id} index={idx} total={achFields.length} isNew={newIdx.achievements === idx} onMoveUp={() => up(moveAch, idx)} onMoveDown={() => down(moveAch, idx, achFields.length)} onDuplicate={() => dup('achievements', insertAch, idx)} onRemove={() => removeAch(idx)}>
                        <input type="hidden" {...register(`achievements.${idx}.id`)} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <FormInput label="Achievement Title" name={`achievements.${idx}.title`} />
                          <FormInput label="Awarding Organization" name={`achievements.${idx}.issuer`} placeholder="e.g. Google, University..." />
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          <FormInput label="Date / Year" name={`achievements.${idx}.date`} placeholder="2024" />
                          <FormTextarea label="Description" name={`achievements.${idx}.description`} rows={2} placeholder="What you accomplished..." />
                        </div>
                      </SectionCard>
                    );
                  })
                }
            </div>
          )}

        </div>
      </TiltCard>
    </div>
  );
}
