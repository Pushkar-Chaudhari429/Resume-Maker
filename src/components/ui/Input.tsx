'use client';

import React, { useState, useEffect, forwardRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, className = '', id, value, onFocus, onBlur, onChange, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const controls = useAnimation();

    useEffect(() => {
      if (error) {
        controls.start({
          x: [0, -6, 6, -6, 6, 0],
          transition: { duration: 0.4 }
        });
      }
    }, [error, controls]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    // Label floats if focused OR has a value (non-empty string)
    const active = isFocused || (value !== undefined && value !== null && value !== '');

    return (
      <div className={`relative flex flex-col w-full group mb-1 ${className}`}>
        <motion.div
          animate={controls}
          className={`relative rounded-xl border transition-all duration-300 ${
            error
              ? 'border-red-500 bg-red-50/5 shadow-[0_0_12px_rgba(239,68,68,0.15)]'
              : success
              ? 'border-emerald-500 bg-emerald-50/5 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
              : isFocused
              ? 'border-primary bg-primary/5 shadow-[0_0_12px_rgba(59,130,246,0.25)]'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white/50 dark:bg-slate-900/50'
          }`}
        >
          {/* Floating label */}
          <label
            htmlFor={id}
            className={`absolute left-4 select-none pointer-events-none transition-all duration-200 ease-out origin-top-left ${
              active
                ? 'top-1.5 text-xs font-semibold ' + (error ? 'text-red-500' : success ? 'text-emerald-500' : 'text-primary')
                : 'top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-slate-500'
            }`}
          >
            {label}
          </label>

          <input
            id={id}
            ref={ref}
            value={value ?? ''}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full px-4 pt-6 pb-2 text-sm bg-transparent outline-none text-slate-800 dark:text-slate-100 placeholder-transparent transition-colors"
            {...props}
          />
        </motion.div>

        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500 mt-1 pl-1"
          >
            {error}
          </motion.span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  success?: boolean;
  className?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, success, className = '', id, rows = 3, value, onFocus, onBlur, onChange, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const controls = useAnimation();

    useEffect(() => {
      if (error) {
        controls.start({
          x: [0, -6, 6, -6, 6, 0],
          transition: { duration: 0.4 }
        });
      }
    }, [error, controls]);

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    const active = isFocused || (value !== undefined && value !== null && value !== '');

    return (
      <div className={`relative flex flex-col w-full group mb-1 ${className}`}>
        <motion.div
          animate={controls}
          className={`relative rounded-xl border transition-all duration-300 ${
            error
              ? 'border-red-500 bg-red-50/5 shadow-[0_0_12px_rgba(239,68,68,0.15)]'
              : success
              ? 'border-emerald-500 bg-emerald-50/5 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
              : isFocused
              ? 'border-primary bg-primary/5 shadow-[0_0_12px_rgba(59,130,246,0.25)]'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white/50 dark:bg-slate-900/50'
          }`}
        >
          <label
            htmlFor={id}
            className={`absolute left-4 select-none pointer-events-none transition-all duration-200 ease-out origin-top-left ${
              active
                ? 'top-1.5 text-xs font-semibold ' + (error ? 'text-red-500' : success ? 'text-emerald-500' : 'text-primary')
                : 'top-4 text-sm text-slate-400 dark:text-slate-500'
            }`}
          >
            {label}
          </label>

          <textarea
            id={id}
            ref={ref}
            rows={rows}
            value={value ?? ''}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full px-4 pt-6 pb-2 text-sm bg-transparent outline-none text-slate-800 dark:text-slate-100 placeholder-transparent transition-colors resize-y"
            {...props}
          />
        </motion.div>

        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500 mt-1 pl-1"
          >
            {error}
          </motion.span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
