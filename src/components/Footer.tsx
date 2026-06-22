'use client';

import React from 'react';
import { ExternalLink, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/50 dark:border-slate-800/50 bg-white/25 dark:bg-slate-950/20 backdrop-blur-md py-8 mt-16 no-print">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Author details */}
        <div className="text-center md:text-left space-y-1.5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Developer Profile</p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Pushkar Girish Chaudhari
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            meet.pushkarchaudhari@gmail.com
          </p>
        </div>

        {/* Heart logo block */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Crafted with</span>
          <Heart size={12} className="text-red-500 fill-red-500" />
          <span>for the Tech Recruitment Trial</span>
        </div>

        {/* Mandatory CTA button */}
        <div>
          <a 
            href="https://digitalheroesco.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button 
              variant="primary" 
              magnetic={true} 
              className="text-xs px-5 py-2.5 font-bold flex items-center gap-2"
            >
              Built for Digital Heroes
              <ExternalLink size={12} />
            </Button>
          </a>
        </div>

      </div>
    </footer>
  );
}
