'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import {
  Sparkles, FileText, Layout, ShieldCheck, Zap, BarChart3, ArrowRight,
  CheckCircle2, Code2, Globe, Layers, Star, Award, Download, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Footer } from '@/components/Footer';
import { Starfield } from '@/components/ui/Starfield';

// ─── Scroll Progress Bar ─────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX, width: '100%' }}
    />
  );
}

// ─── Feature Card ────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, description, color, delay }: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative p-6 rounded-2xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-sm hover:border-slate-700/80 hover:bg-slate-900/50 transition-all duration-300 cursor-default overflow-hidden"
    >
      {/* Glow on hover */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${color.replace('text-', 'bg-').replace('-400', '-500/4')}`} />
      
      <div className={`relative inline-flex items-center justify-center w-11 h-11 rounded-xl ${color.replace('text-', 'bg-').replace('-400', '-500/10')} mb-4`}>
        <Icon size={20} className={color} />
      </div>
      <h3 className="relative text-sm font-bold text-slate-100 mb-2">{title}</h3>
      <p className="relative text-xs text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

// ─── Tech Badge ──────────────────────────────────────────────────────────────
function TechBadge({ name, delay }: { name: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay }}
      className="px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900/60 text-xs font-semibold text-slate-400 hover:border-slate-700 hover:text-slate-200 hover:bg-slate-900 transition-all duration-200 cursor-default select-none"
    >
      {name}
    </motion.span>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className="text-center"
    >
      <div className="text-3xl font-black bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent mb-1">{value}</div>
      <div className="text-xs text-slate-500 font-medium">{label}</div>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ShowcaseLanding() {
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -60]);
  const heroOpacity = useTransform(scrollY, [0, 350], [1, 0]);

  useEffect(() => {
    const handle = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handle, { passive: true });
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  const features = [
    { icon: BarChart3, title: 'Real-Time ATS Grader', description: 'Live scoring out of 100 with actionable hints to optimize keyword density, section completeness, and readability.', color: 'text-blue-400', delay: 0 },
    { icon: Layers, title: '3 Premium Templates', description: 'Modern, Professional (ATS-safe serif), and Minimal layouts. Switch instantly with live preview.', color: 'text-violet-400', delay: 0.05 },
    { icon: Zap, title: 'Instant Auto-Save', description: 'Every keystroke is saved to localStorage and synced to the server. No save button. Zero data loss.', color: 'text-amber-400', delay: 0.1 },
    { icon: FileText, title: 'PDF Export', description: 'Generate searchable, machine-readable ATS-compliant PDFs. Text remains selectable for recruiters.', color: 'text-emerald-400', delay: 0.15 },
    { icon: Globe, title: 'Portfolio Generator', description: 'Your resume automatically converts to a beautiful interactive portfolio website. Shareable instantly.', color: 'text-cyan-400', delay: 0.2 },
    { icon: ShieldCheck, title: 'Zod Validation', description: 'Real-time field error indicators with shake animations, protecting against invalid emails and missing data.', color: 'text-red-400', delay: 0.25 },
    { icon: Code2, title: 'Resume Import & OCR', description: 'Upload PDF, DOCX, or image resumes. Client-side text extraction plus OCR fallback automatically populates the builder.', color: 'text-pink-400', delay: 0.3 },
    { icon: Award, title: 'PWA Ready', description: 'Installable as a desktop or mobile app. Works offline with full service worker caching.', color: 'text-orange-400', delay: 0.35 },
  ];

  const techStack = [
    'Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS v4',
    'Framer Motion', 'React Hook Form', 'Zod', 'jsPDF',
    'Vercel Analytics', 'PWA', 'pdfjs-dist', 'mammoth.js'
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-950 text-slate-100 font-sans">
      <ScrollProgress />

      {/* ── Layered Background ────────────────────────────────────── */}
      {/* Starfield */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 z-0"
      >
        <Starfield />
      </motion.div>

      {/* Aurora blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="aurora-animate absolute top-[-15%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/8 blur-[140px] pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: 'easeOut', delay: 0.2 }}
        className="aurora-animate absolute top-[10%] right-[-15%] w-[55%] h-[55%] rounded-full bg-violet-500/8 blur-[150px] pointer-events-none"
        style={{ animationDelay: '4s' }}
      />
      <div className="absolute bottom-[5%] left-[15%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Mouse spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59,130,246,0.055), transparent 70%)`,
        }}
      />

      {/* ── Header ───────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-2 z-50 mx-4 sm:mx-8 mt-3"
      >
        <div className="rounded-2xl border border-slate-800/60 bg-slate-950/80 backdrop-blur-xl px-5 py-3 flex justify-between items-center shadow-lg shadow-black/20">
          <div className="flex items-center gap-2.5 select-none">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <FileText size={15} className="text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles size={6} className="text-white" />
              </div>
            </div>
            <span className="text-sm font-black tracking-tight bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              ResumeForge AI
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/8 border border-emerald-500/20 px-2.5 py-1 rounded-full select-none">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Live Demo
            </span>
            <Button
              variant="glass"
              onClick={() => router.push('/app')}
              className="text-xs py-1.5 px-4"
            >
              Open Builder <ChevronRight size={13} className="ml-0.5" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main className="relative z-10 flex-1">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <motion.section
          ref={heroRef}
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-5xl mx-auto px-6 pt-20 sm:pt-32 pb-16 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/25 bg-blue-500/6 text-blue-400 text-xs font-bold tracking-wider uppercase mb-6 select-none"
          >
            <Sparkles size={11} className="text-violet-400" />
            Recruiter Portfolio Showcase — Built with Production-Grade Stack
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6"
          >
            <span className="bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Forge ATS Resumes
            </span>
            <br />
            <span className="text-gradient">
              & Portfolios — Instantly
            </span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.38 }}
            className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10"
          >
            A production-grade SaaS resume builder built with Next.js 15, Framer Motion, Zod, and jsPDF. 
            Real-time ATS scoring, 3 premium templates, drag-and-drop reordering, and auto-save — all in one workspace.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              variant="primary"
              magnetic={true}
              stars={true}
              shineSweep={true}
              onClick={() => router.push('/app')}
              className="text-sm font-extrabold px-7 py-3.5 shadow-[0_0_36px_rgba(59,130,246,0.28)] gap-2 group w-full sm:w-auto"
            >
              Launch Builder
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            <Button
              variant="glass"
              onClick={() => router.push('/app')}
              className="text-sm font-bold px-7 py-3.5 gap-2 w-full sm:w-auto"
            >
              <Download size={14} />
              Try Resume Import
            </Button>
          </motion.div>

          {/* Social proof dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex items-center justify-center gap-4 mt-8"
          >
            {['✓ No signup required', '✓ Auto-save', '✓ Free export'].map((item, i) => (
              <span key={i} className="text-xs text-slate-500 font-medium">{item}</span>
            ))}
          </motion.div>
        </motion.section>

        {/* ── DASHBOARD PREVIEW ────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          className="max-w-6xl mx-auto px-6 mb-28"
        >
          <div className="relative rounded-2xl border border-slate-800/60 bg-slate-900/30 p-1.5 shadow-2xl shadow-black/50">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-950/80 border-b border-slate-800/60 rounded-t-xl">
              <span className="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70 hover:bg-yellow-500 transition-colors" />
              <span className="w-3 h-3 rounded-full bg-green-500/70 hover:bg-green-500 transition-colors" />
              <div className="flex-1 flex justify-center">
                <span className="text-[10px] text-slate-500 font-mono bg-slate-900/80 border border-slate-800 px-3 py-0.5 rounded-full tracking-wide">
                  resumeforge-ai.vercel.app/app
                </span>
              </div>
            </div>

            {/* App mockup interior */}
            <div className="bg-slate-950 rounded-b-xl aspect-[16/7] sm:aspect-[16/6] flex overflow-hidden">
              {/* Left panel simulation */}
              <div className="w-2/5 border-r border-slate-800/60 p-4 flex flex-col gap-3">
                <div className="flex gap-1.5 mb-1">
                  {['Personal', 'Exp', 'Projects', 'Skills', 'Edu', 'Certs', 'Awards'].map((t, i) => (
                    <div key={i} className={`flex-1 h-7 rounded-lg text-[8px] font-bold flex items-center justify-center ${i === 0 ? 'bg-blue-500/15 border border-blue-500/30 text-blue-400' : 'bg-slate-900/60 border border-slate-800/40 text-slate-600'}`}>{t}</div>
                  ))}
                </div>
                <div className="space-y-2">
                  {['Full Name', 'Email', 'Phone', 'Portfolio'].map((f, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                      <div className="h-1.5 w-12 bg-slate-800 rounded" />
                      <div className={`h-7 rounded-lg border border-slate-800/60 bg-slate-900/40 px-2 flex items-center ${i === 0 ? 'border-blue-500/40' : ''}`}>
                        <div className={`h-1.5 rounded ${i === 0 ? 'bg-blue-400/60 w-24' : 'bg-slate-700 w-16'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right resume preview simulation */}
              <div className="flex-1 p-4 flex flex-col gap-2 overflow-hidden">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex gap-1">
                    <div className="h-5 w-16 bg-slate-800/60 rounded-lg" />
                    <div className="h-5 w-20 bg-slate-800/60 rounded-lg" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                      <CheckCircle2 size={9} className="text-emerald-400" />
                    </div>
                    <div className="h-4 w-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full" />
                    <span className="text-[8px] text-emerald-400 font-bold">ATS 96/100</span>
                  </div>
                </div>
                <div className="flex-1 bg-white/3 rounded-xl border border-slate-800/30 p-3 space-y-2">
                  <div className="h-3 w-32 bg-slate-600/50 rounded" />
                  <div className="h-2 w-48 bg-slate-700/40 rounded" />
                  <div className="border-t border-slate-800/40 pt-2 space-y-1">
                    <div className="h-1.5 w-16 bg-blue-500/40 rounded" />
                    <div className="h-1.5 w-full bg-slate-800/60 rounded" />
                    <div className="h-1.5 w-4/5 bg-slate-800/60 rounded" />
                    <div className="h-1.5 w-3/4 bg-slate-800/60 rounded" />
                  </div>
                  <div className="border-t border-slate-800/40 pt-2 space-y-1">
                    <div className="h-1.5 w-20 bg-violet-500/40 rounded" />
                    <div className="flex gap-1 flex-wrap">
                      {['React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB'].map(s => (
                        <div key={s} className="h-4 px-1.5 bg-slate-800/60 border border-slate-700/40 rounded-full text-[7px] text-slate-500 flex items-center">{s}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── STATS ────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 mb-28">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 p-8 rounded-2xl border border-slate-800/50 bg-slate-900/20">
            <StatCard value="100%" label="ATS Compliance" delay={0} />
            <StatCard value="3" label="Resume Templates" delay={0.08} />
            <StatCard value="< 1s" label="Save Response Time" delay={0.16} />
            <StatCard value="0" label="TypeScript Errors" delay={0.24} />
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-800 bg-slate-900/60 text-xs text-slate-400 font-bold uppercase tracking-wider mb-5 select-none">
              <Star size={11} className="text-amber-400" />
              Feature-Complete SaaS Architecture
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent mb-3">
              Everything Recruiters & Engineers Expect
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              Built from the ground up with production-grade tooling. Every feature is implemented with the same standards used at top-tier startups.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </section>

        {/* ── TECH STACK ───────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 mb-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55 }}
            className="mb-8"
          >
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-100 mb-2">Modern Technical Stack</h2>
            <p className="text-sm text-slate-500">Zero scaffolding templates. Clean TypeScript from first principles.</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-2">
            {techStack.map((tech, i) => (
              <TechBadge key={tech} name={tech} delay={i * 0.04} />
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-10 rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-900/60 to-slate-950/60 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-violet-500/5 to-blue-500/5 pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/15 to-violet-500/15 border border-blue-500/20 mb-6">
                <Sparkles size={24} className="text-blue-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3 bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
                Ready to Build Your Resume?
              </h2>
              <p className="text-sm text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                Start from scratch or import your existing resume. Everything is auto-saved and ready to export as a PDF in seconds.
              </p>
              <Button
                variant="primary"
                magnetic={true}
                shineSweep={true}
                stars={true}
                onClick={() => router.push('/app')}
                className="text-sm font-extrabold px-8 py-3.5 gap-2 group shadow-[0_0_36px_rgba(59,130,246,0.25)]"
              >
                Open Builder — It's Free
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
