import { useEffect, useState, useRef } from 'react';
import { useMindMapStore } from '@/store/useMindMapStore';

export const useAutosave = (delay = 2000) => {
  const isDirty = useMindMapStore((state) => state.isDirty);
  const setDirty = useMindMapStore((state) => state.setDirty);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isDirty) {
      setIsSaving(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        // In a real SaaS, this would be an API call
        // For now, Zustand persist handles local storage
        // We just clear the dirty flag and show saved status
        setDirty(false);
        setIsSaving(false);
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isDirty, setDirty, delay]);

  return { isSaving };
};
