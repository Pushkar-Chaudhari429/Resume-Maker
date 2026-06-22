'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TabOption {
  value: string;
  label: string | React.ReactNode;
}

interface TabsProps {
  options: TabOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ options, selectedValue, onChange, className = '' }: TabsProps) {
  return (
    <div className={`flex p-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm ${className}`}>
      {options.map((option) => {
        const isSelected = option.value === selectedValue;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`relative flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors focus:outline-none select-none cursor-pointer ${
              isSelected
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200/30 dark:border-slate-700/30 z-0"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
