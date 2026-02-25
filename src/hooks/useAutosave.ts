import { useEffect, useRef } from 'react';
import { useMindMapStore } from '../store/useMindMapStore';
import { fileService } from '../services/fileService';

export const useAutosave = (debounceMs = 3000) => {
  const {
    nodes,
    edges,
    title,
    filePath,
    isDirty,
    setDirty
  } = useMindMapStore();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isDirty || !filePath) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      const data = {
        nodes,
        edges,
        metadata: {
          title,
          lastModified: new Date().toISOString(),
        }
      };

      const success = await fileService.saveFile(filePath, data);
      if (success) {
        setDirty(false);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [nodes, edges, title, filePath, isDirty, setDirty, debounceMs]);
};
