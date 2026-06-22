'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Download, Printer, Sun, Moon, FileText, Globe, CheckCircle2, AlertTriangle, AlertCircle, LayoutTemplate
} from 'lucide-react';
import { useLocalStorage, initialMockData } from '@/hooks/useLocalStorage';
import { ResumeForm, FormInput, FormTextarea } from '@/components/builder/ResumeForm';
import { ResumePreview } from '@/components/preview/ResumePreview';
import { PortfolioPreview } from '@/components/portfolio/PortfolioPreview';
import { analyzeAtsScore } from '@/utils/atsAnalyzer';
import { exportResumeToPdf } from '@/utils/pdfExporter';
import { Button } from '@/components/ui/Button';
import { TiltCard } from '@/components/ui/TiltCard';
import { Tabs } from '@/components/ui/Tabs';
import { Footer } from '@/components/Footer';
import { ResumeData, ResumeTemplate } from '@/types/resume';
import { parseResumeFile } from '@/utils/resumeParser';
import { Starfield } from '@/components/ui/Starfield';
import { Input, Textarea } from '@/components/ui/Input';

export default function AppWorkspace() {
  const router = useRouter();
  const { getInitialData, saveDebounced, isSaving, lastSaved, saveError } = useLocalStorage();
  
  const [activeTab, setActiveTab] = useState<string>('resume'); // 'resume' | 'portfolio'
  const [template, setTemplate] = useState<ResumeTemplate>('modern');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [atsOpen, setAtsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<'choice' | 'review' | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const lastSavedRef = useRef<string>('');

  // Initialize React Hook Form — NO zodResolver here.
  // zodResolver on the form itself was BLOCKING useFieldArray.append()
  // because RHF treats validation errors as a gate for all mutations.
  // Validation is done independently only at save/export time.
  const methods = useForm<ResumeData>({
    defaultValues: initialMockData,
    mode: 'onChange',
  });

  const { watch, reset, register } = methods;
  const formValues = watch();

  // Load localStorage data safely after mounting (prevents SSR hydration mismatch)
  useEffect(() => {
    let isMounted = true;

    const loadResume = async () => {
      const cachedData = getInitialData();

      try {
        const response = await fetch('/api/resume');
        if (!response.ok) {
          throw new Error('Unable to load resume from backend.');
        }

        const backendData = await response.json();
        if (isMounted) {
          localStorage.setItem('resumeforge_data', JSON.stringify(backendData));
          reset(backendData);
        }
      } catch {
        if (isMounted) {
          localStorage.setItem('resumeforge_data', JSON.stringify(cachedData));
          reset(cachedData);
        }
      } finally {
        if (isMounted) {
          setIsHydrated(true);
          const stored = localStorage.getItem('resumeforge_data');
          // If no custom resume data is in localStorage, show onboarding
          if (!stored || stored === JSON.stringify(initialMockData)) {
            setOnboardingStep('choice');
          }
        }
      }
    };

    void loadResume();
    
    // Theme hydration
    const savedTheme = localStorage.getItem('resumeforge_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', systemDark);
    }
    return () => {
      isMounted = false;
    };
  }, [reset, getInitialData]);

  // Debounced auto-save listener on form edits
  useEffect(() => {
    if (!isHydrated) return;

    const serialized = JSON.stringify(formValues);
    if (serialized !== lastSavedRef.current) {
      lastSavedRef.current = serialized;

      // Skip saving empty default values on mount before hydration
      if (formValues.personalInfo?.fullName !== initialMockData.personalInfo.fullName || 
          localStorage.getItem('resumeforge_data')) {
        saveDebounced(formValues);
      }
    }
  }, [formValues, saveDebounced, isHydrated]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('resumeforge_theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePdfDownload = () => {
    exportResumeToPdf(formValues, template);
  };

  const handleStartBlank = () => {
    const blankData: ResumeData = {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        portfolio: '',
        summary: ''
      },
      education: [],
      experience: [],
      projects: [],
      skills: [],
      certifications: [],
      achievements: [],
      additionalContent: ''
    };
    reset(blankData);
    localStorage.setItem('resumeforge_data', JSON.stringify(blankData));
    setOnboardingStep(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsParsing(true);
    try {
      const parsed = await parseResumeFile(file);
      reset(parsed);
      setOnboardingStep('review');
    } catch (err) {
      console.error(err);
      alert('Error parsing resume. Please make sure the file is a valid PDF, DOCX, or TXT file.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleConfirmOnboarding = () => {
    const currentValues = methods.getValues();
    localStorage.setItem('resumeforge_data', JSON.stringify(currentValues));
    setOnboardingStep(null);
  };

  const handleCancelOnboarding = () => {
    setOnboardingStep('choice');
  };

  // Run ATS analyzer in real-time
  const atsReport = analyzeAtsScore(formValues);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/5 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/5 blur-[120px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4 relative z-10"
        >
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/20 flex items-center justify-center">
            <div className="w-7 h-7 border-[3px] border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-white mb-1">Loading Workspace</p>
            <p className="text-xs text-slate-500">Setting up your resume editor...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (onboardingStep) {
    return (
      <FormProvider {...methods}>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden">
          <Starfield />
          {/* Ambient light blobing overlays */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

          {/* Header */}
          <header className="relative z-10 px-8 py-6 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md flex justify-between items-center">
            <h1 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">ResumeForge Onboarding</h1>
            <Button 
              type="button" 
              variant="glass" 
              onClick={() => router.push('/')}
              className="py-1.5 px-3 text-xs gap-1.5"
            >
              <ArrowLeft size={13} /> Landing Page
            </Button>
          </header>

          {/* Main Onboarding Body */}
          <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col items-center justify-center">
            {onboardingStep === 'choice' ? (
              <div className="w-full max-w-2xl space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">Create your profile</h2>
                  <p className="text-sm text-slate-400">Choose how you want to build your resume to get started.</p>
                </div>

                {isParsing ? (
                  <TiltCard className="bg-slate-900/40 border-slate-900 py-16 flex flex-col items-center justify-center gap-4" glow={false}>
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <div className="text-center space-y-1.5">
                      <p className="text-sm font-bold text-white">Analyzing Resume Document...</p>
                      <p className="text-xs text-slate-400">Extracting fields, mapping education, skills, and experience headings...</p>
                    </div>
                  </TiltCard>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Option 1: Start Blank */}
                    <TiltCard 
                      className="bg-slate-900/30 border-slate-900 hover:border-blue-500/30 hover:bg-slate-900/50 transition-all cursor-pointer p-6 flex flex-col justify-between text-left h-64" 
                      glow={true}
                    >
                      <div className="space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                          <FileText size={20} />
                        </div>
                        <h3 className="text-base font-extrabold text-white">Option 1: Start From Scratch</h3>
                        <p className="text-xs text-slate-400 leading-normal">
                          Start with a completely blank resume template. You can type all your sections manually within the live builder workspace.
                        </p>
                      </div>
                      <Button type="button" onClick={handleStartBlank} variant="primary" className="w-full py-2 text-xs font-bold mt-4">
                        Create Blank Resume
                      </Button>
                    </TiltCard>

                    {/* Option 2: Import Resume */}
                    <TiltCard 
                      className="bg-slate-900/30 border-slate-900 hover:border-violet-500/30 hover:bg-slate-900/50 transition-all cursor-pointer p-6 flex flex-col justify-between text-left h-64 relative overflow-hidden" 
                      glow={true}
                    >
                      <div className="space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                          <Globe size={20} />
                        </div>
                        <h3 className="text-base font-extrabold text-white">Option 2: Import Existing</h3>
                        <p className="text-xs text-slate-400 leading-normal">
                          Upload your PDF, DOCX, or TXT resume. The parser extracts personal details, education, experience, projects, skills, certifications, and achievements.
                        </p>
                      </div>
                      <label className="w-full block mt-4">
                        <span className="w-full inline-flex items-center justify-center font-bold px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs transition-colors cursor-pointer select-none">
                          Upload & Parse Resume File
                        </span>
                        <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </TiltCard>
                  </div>
                )}
              </div>
            ) : (
              // Review parsed resume details screen
              <div className="w-full max-w-3xl space-y-6 text-left">
                <div className="text-center sm:text-left space-y-2 mb-6">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">Review Imported Information</h2>
                  <p className="text-xs sm:text-sm text-slate-400">We extracted the details below. Review and correct them before populating the workspace.</p>
                </div>

                <TiltCard className="bg-slate-900/30 border-slate-900/80 p-6 space-y-4" glow={false}>
                  <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Contact & Bio</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput label="Candidate Full Name" name="personalInfo.fullName" />
                    <FormInput label="Email Address" name="personalInfo.email" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput label="Phone Number" name="personalInfo.phone" />
                    <FormInput label="Portfolio Link" name="personalInfo.portfolio" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput label="LinkedIn URL" name="personalInfo.linkedin" />
                    <FormInput label="GitHub URL" name="personalInfo.github" />
                  </div>
                  <FormTextarea label="Professional Summary Bio" name="personalInfo.summary" rows={3} />
                  
                  {/* Summary of parsed sections counts */}
                  <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider pt-2">Parsed Sections Summary</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                    <div className="p-2 border border-slate-800 bg-slate-950/40 rounded-xl">
                      <span className="block font-black text-blue-400">{formValues.education?.length || 0}</span>
                      <span className="text-[10px] text-slate-500">Education</span>
                    </div>
                    <div className="p-2 border border-slate-800 bg-slate-950/40 rounded-xl">
                      <span className="block font-black text-blue-400">{formValues.experience?.length || 0}</span>
                      <span className="text-[10px] text-slate-500">Experience</span>
                    </div>
                    <div className="p-2 border border-slate-800 bg-slate-950/40 rounded-xl">
                      <span className="block font-black text-blue-400">{formValues.projects?.length || 0}</span>
                      <span className="text-[10px] text-slate-500">Projects</span>
                    </div>
                    <div className="p-2 border border-slate-800 bg-slate-950/40 rounded-xl">
                      <span className="block font-black text-blue-400">{formValues.skills?.length || 0}</span>
                      <span className="text-[10px] text-slate-500">Skills</span>
                    </div>
                    <div className="p-2 border border-slate-800 bg-slate-950/40 rounded-xl">
                      <span className="block font-black text-blue-400">{formValues.certifications?.length || 0}</span>
                      <span className="text-[10px] text-slate-500">Certs</span>
                    </div>
                    <div className="p-2 border border-slate-800 bg-slate-950/40 rounded-xl">
                      <span className="block font-black text-blue-400">{formValues.achievements?.length || 0}</span>
                      <span className="text-[10px] text-slate-500">Awards</span>
                    </div>
                  </div>

                  {/* Additional Unmapped content */}
                  {formValues.additionalContent && (
                    <div className="space-y-1.5 pt-2">
                      <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Additional Imported Content</h3>
                      <p className="text-[10px] text-slate-500">Any text that did not map directly to sections is saved here so nothing is lost:</p>
                      <FormTextarea label="Unmapped Resume Text" name="additionalContent" rows={3} />
                    </div>
                  )}
                </TiltCard>

                {/* CTAs */}
                <div className="flex gap-3 justify-end pt-2">
                  <Button type="button" onClick={handleCancelOnboarding} variant="glass" className="py-2.5 px-5 text-xs font-bold">
                    Back to choices
                  </Button>
                  <Button type="button" onClick={handleConfirmOnboarding} variant="primary" className="py-2.5 px-5 text-xs font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    Confirm & Populate Builder
                  </Button>
                </div>
              </div>
            )}
          </main>

          <Footer />
        </div>
      </FormProvider>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
        
        {/* Header Bar */}
        <header className="sticky top-0 z-40 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-6 py-3.5 flex justify-between items-center no-print shadow-sm shadow-black/5">
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 transition-all cursor-pointer group"
              title="Back to homepage"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <FileText size={13} className="text-white" />
              </div>
              <div>
                <h1 className="text-xs font-extrabold tracking-tight text-slate-800 dark:text-slate-100">ResumeForge Workspace</h1>
                <div className="flex items-center gap-1.5 h-3.5">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-300 ${isSaving ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isSaving ? 'saving' : 'saved'}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.12 }}
                      className="text-[9px] text-slate-400 font-semibold select-none"
                    >
                      {isSaving ? 'Saving changes...' : lastSaved ? `Saved at ${lastSaved}` : 'All changes saved'}
                    </motion.span>
                  </AnimatePresence>
                  {saveError && <span className="text-[9px] text-red-400 font-semibold select-none">⚠ {saveError}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Global Header actions */}
          <div className="flex items-center gap-1.5">
            <button 
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-slate-500 dark:text-slate-400 cursor-pointer"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            <Button type="button" variant="glass" onClick={() => setOnboardingStep('choice')} className="py-2 px-3 text-[11px] gap-1.5 h-8">
              Import / Reset
            </Button>
            <Button type="button" variant="glass" onClick={handlePrint} className="py-2 px-3 text-[11px] gap-1.5 h-8">
              <Printer size={13} /> Print
            </Button>
            <Button type="button" variant="primary" onClick={handlePdfDownload} className="py-2 px-3.5 text-[11px] gap-1.5 h-8 shadow-[0_0_16px_rgba(59,130,246,0.25)]">
              <Download size={13} /> Export PDF
            </Button>
          </div>
        </header>

        {/* Main Workpane Layout */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
          
          {/* LEFT: Forms Panel (col-span-5) */}
          <div className="lg:col-span-5 space-y-6 no-print">
            
            {/* Realtime Grader Card */}
            <TiltCard className="bg-white/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50" glow={false}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center font-black text-xs">
                    <span className={atsReport.score >= 80 ? 'text-emerald-500' : atsReport.score >= 50 ? 'text-yellow-500' : 'text-red-500'}>
                      {atsReport.score}
                    </span>
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle 
                        cx="24" cy="24" r="20" 
                        className="fill-none stroke-primary" 
                        strokeWidth="4" 
                        strokeDasharray={`${2 * Math.PI * 20}`}
                        strokeDashoffset={`${2 * Math.PI * 20 * (1 - atsReport.score / 100)}`}
                        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">ATS Score Analyzer</h3>
                    <p className="text-xs font-semibold mt-0.5 text-slate-500">
                      {atsReport.score >= 80 ? 'Excellent score! High ATS compatibility.' : atsReport.score >= 50 ? 'Good progress. Needs some updates.' : 'Critical updates needed.'}
                    </p>
                  </div>
                </div>
                
                <Button 
                  type="button"
                  variant="glass" 
                  onClick={() => setAtsOpen(!atsOpen)}
                  className="py-1 px-2.5 text-[10px] font-bold"
                >
                  {atsOpen ? 'Hide Tips' : `View ${atsReport.suggestions.length} Tips`}
                </Button>
              </div>

              <AnimatePresence>
                {atsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 overflow-hidden"
                  >
                    {atsReport.suggestions.map((sug) => {
                      const Icon = sug.type === 'error' ? AlertCircle : sug.type === 'warning' ? AlertTriangle : CheckCircle2;
                      const colorClass = sug.type === 'error' ? 'text-red-400 bg-red-500/5 border-red-500/10' : sug.type === 'warning' ? 'text-yellow-400 bg-yellow-500/5 border-yellow-500/10' : 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10';
                      
                      return (
                        <div key={sug.id} className={`flex gap-2.5 p-2.5 rounded-xl border text-xs ${colorClass}`}>
                          <Icon size={14} className="mt-0.5 shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">{sug.message}</p>
                            {sug.impact > 0 && (
                              <span className="text-[10px] font-bold block mt-1">Impact: +{sug.impact} pts</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </TiltCard>

            <ResumeForm />
          </div>

          {/* RIGHT: Previews Pane (col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 no-print">
              <Tabs 
                options={[
                  { value: 'resume', label: <span className="flex items-center gap-1.5"><FileText size={13} /> ATS Resume Preview</span> },
                  { value: 'portfolio', label: <span className="flex items-center gap-1.5"><Globe size={13} /> Portfolio Preview</span> }
                ]}
                selectedValue={activeTab}
                onChange={setActiveTab}
                className="w-full sm:w-auto"
              />

              {activeTab === 'resume' && (
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <LayoutTemplate size={14} className="text-slate-400 shrink-0" />
                  <select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value as ResumeTemplate)}
                    className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-700 dark:text-slate-200 font-semibold focus:border-primary cursor-pointer"
                  >
                    <option value="modern">Modern (Accent Colors)</option>
                    <option value="professional">Professional (Serif ATS)</option>
                    <option value="minimal">Minimal (Modern Sans)</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex-1 flex justify-center items-start">
              <AnimatePresence mode="wait">
                {activeTab === 'resume' ? (
                  <motion.div
                    key="resume-preview"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="w-full flex justify-center"
                  >
                    <div className="w-full overflow-x-auto pb-4">
                      <ResumePreview ref={printRef} data={formValues} template={template} />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="portfolio-preview"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="w-full"
                  >
                    <PortfolioPreview data={formValues} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </main>

        {/* Footer */}
        <Footer />
      </div>
    </FormProvider>
  );
}
