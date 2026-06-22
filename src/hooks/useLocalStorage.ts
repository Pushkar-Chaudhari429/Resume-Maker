import { useState, useEffect, useRef, useCallback } from 'react';
import { ResumeData } from '@/types/resume';
import { initialResumeData } from '@/data/resumeDefaults';

export const initialMockData: ResumeData = {
  ...initialResumeData
};

const STORAGE_KEY = 'resumeforge_data';

export function useLocalStorage() {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('');
  const [saveError, setSaveError] = useState<string>('');
  const backendTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Read data on initialization - client side only
  const getInitialData = useCallback((): ResumeData => {
    if (typeof window === 'undefined') return initialMockData;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          personalInfo: {
            ...initialMockData.personalInfo,
            ...parsed.personalInfo,
          },
          education: parsed.education || [],
          experience: parsed.experience || [],
          projects: parsed.projects || [],
          skills: parsed.skills || [],
          certifications: parsed.certifications || [],
          achievements: parsed.achievements || [],
          additionalContent: parsed.additionalContent || '',
        };
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockData));
        return initialMockData;
      }
    } catch (err) {
      console.error('Error reading localStorage:', err);
      return initialMockData;
    }
  }, []);

  // Debounced write function
  const saveDebounced = useCallback((newData: ResumeData) => {
    if (typeof window === 'undefined') return;

    setSaveError('');
    setIsSaving(true);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSaved(time);
    } catch (err) {
      console.error('Error writing to localStorage:', err);
      setSaveError('Failed to update local cache.');
      setIsSaving(false);
      return;
    }

    if (backendTimeoutRef.current) {
      clearTimeout(backendTimeoutRef.current);
    }

    backendTimeoutRef.current = setTimeout(() => {
      void fetch('/api/resume', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      })
        .then(async (response) => {
          if (!response.ok) {
            const payload = await response.json().catch(() => null);
            throw new Error(payload?.message ?? 'Failed to save resume data.');
          }
        })
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : 'Failed to save resume data.';
          setSaveError(message);
        })
        .finally(() => {
          setIsSaving(false);
        });
    }, 350);
  }, []);

  useEffect(() => {
    return () => {
      if (backendTimeoutRef.current) clearTimeout(backendTimeoutRef.current);
    };
  }, []);

  return {
    getInitialData,
    saveDebounced,
    isSaving,
    lastSaved,
    saveError,
  };
}
