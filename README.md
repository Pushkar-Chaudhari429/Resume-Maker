# ResumeForge AI

An advanced, premium ATS-friendly Resume Builder and Portfolio Generator built like a real SaaS product.

This project was built for the **Digital Heroes** Custom Software Developer application trial by **Pushkar Girish Chaudhari**.

## 🚀 Live Demo & Deployment
* **Preview url**: [https://resumeforge-ai.vercel.app](https://resumeforge-ai.vercel.app) (Optimized for Vercel Free Plan)
* **PWA Capability**: Installable on Android, iOS, and Desktop with offline caching.

---

## 🛠️ Tech Stack
* **Framework**: Next.js 15.5 (App Router, Server Components optimized)
* **Frontend**: React 19, TypeScript
* **Styling**: Tailwind CSS v4 (Glassmorphism design language, soft shadows, blur filters)
* **Animations**: Framer Motion (Smooth spring page transitions, input shakes, magnetic interactions)
* **Data Validation**: Zod (Real-time schema verification and inline errors)
* **Storage**: Local Storage (SSR-safe debounced sync with status indicator)
* **PDF Exporter**: jsPDF (Draws raw structural vectors, producing 100% searchable text for ATS scanners)
* **Analytics**: Vercel Web Analytics

---

## ✨ Features

### 1. ATS Score Analyzer
Calculates a real-time score out of 100 as you edit your details. It generates specific actionable checklist suggestions (e.g. warning on brief summary details, missing emails, low skills count) to maximize ATS compatibility.

### 2. Multi-Template Engine
Switch between three tailored layouts on the fly without refreshing:
* **Modern**: Contemporary layouts with color accent borders.
* **Professional**: Clean, centered serif layouts matching corporate/traditional recruitment settings.
* **Minimal**: Clean, high-whitespace sans-serif sheets for design and tech roles.

### 3. Portfolio Generator
Converts your structured resume state into a premium, interactive personal portfolio website on a single click, featuring interactive projects grids, skills visualization, dark-mode styling, and contact triggers.

### 4. PWA Installability
Full offline configuration using `manifest.json` and service worker registrations, allowing the app to run standalone outside the browser frame.

---

## 📂 Project Structure
```
digitalHeroes/
├── public/
│   ├── manifest.json        # PWA details and icons
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── app/
│   │   │   └── page.tsx     # Main Builder Workspace
│   │   ├── globals.css      # Themes, print styles, and PWA overlays
│   │   ├── layout.tsx       # Next.js Metadata, SEO, and Analytics
│   │   ├── robots.ts        # Dynamic robots.txt
│   │   └── sitemap.ts       # Dynamic sitemap.xml
│   │   └── page.tsx         # Showcase Landing Page
│   ├── components/
│   │   ├── builder/
│   │   │   └── ResumeForm.tsx
│   │   ├── preview/
│   │   │   └── ResumePreview.tsx
│   │   ├── portfolio/
│   │   │   └── PortfolioPreview.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Tabs.tsx
│   │   └── Footer.tsx       # Digital Heroes recruitment footer
│   ├── hooks/
│   │   └── useLocalStorage.ts
│   ├── types/
│   │   └── resume.ts
│   └── utils/
│       ├── atsAnalyzer.ts
│       ├── pdfExporter.ts
│       └── validation.ts
└── tsconfig.json
```

---

## 🏃 Local Setup Instructions

Clone the workspace and navigate inside:

```bash
# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🏗️ Production Build

To build the static server bundles and verify code safety:

```bash
npm run build
```

---

## 🌟 Digital Heroes Recruitment Footer
As required, the footer displays:
* My Full Name: **Pushkar Girish Chaudhari**
* My Email: **meet.pushkarchaudhari@gmail.com**
* Button: **Built for Digital Heroes** linking to `https://digitalheroesco.com` (opening in a new tab).
