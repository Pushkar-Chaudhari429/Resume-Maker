import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResumeForge AI — ATS Resume Builder & Portfolio Generator",
  description: "Create structured, ATS-compliant resumes and generate personal portfolios in real time. Built with Next.js 15, Framer Motion, Zod, and jsPDF.",
  keywords: ["ATS resume builder", "portfolio generator", "developer resume", "Next.js 15", "Vercel", "Digital Heroes"],
  authors: [{ name: "Pushkar Girish Chaudhari", url: "mailto:meet.pushkarchaudhari@gmail.com" }],
  metadataBase: new URL("https://resumeforge-ai.vercel.app"),
  
  // PWA elements
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ResumeForge AI",
  },
  
  // Open Graph
  openGraph: {
    title: "ResumeForge AI — ATS Resume Builder & Portfolio Generator",
    description: "Create structured, ATS-compliant resumes and generate personal portfolios in real-time.",
    url: "https://resumeforge-ai.vercel.app",
    siteName: "ResumeForge AI",
    locale: "en_US",
    type: "website",
  },

  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    title: "ResumeForge AI — ATS Resume Builder & Portfolio Generator",
    description: "Create structured, ATS-compliant resumes and generate personal portfolios in real-time.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <meta name="theme-color" content="#030712" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
