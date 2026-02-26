import React, { useState, useEffect } from 'react';
import {
  Cloud,
  CloudUpload,
  Minus,
  Plus,
  Maximize,
  HelpCircle,
  Zap
} from 'lucide-react';
import { useMindMapStore } from '@/store/useMindMapStore';
import { useReactFlow } from 'reactflow';
import { cn } from '@/utils/cn';
import { useAutosave } from '@/hooks/useAutosave';

export const StatusBar = () => {
  const { nodes } = useMindMapStore();
  const { zoomIn, zoomOut, fitView, getZoom } = useReactFlow();
  const { isSaving } = useAutosave();

  const [currentZoom, setCurrentZoom] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        setCurrentZoom(Math.round(getZoom() * 100));
      } catch (e) {}
    }, 300);
    return () => clearInterval(interval);
  }, [getZoom]);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-11 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/50 z-[60] px-6 flex items-center justify-between shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          {isSaving ? (
            <div className="flex items-center gap-2 px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 leading-none">Saving...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 leading-none">All changes saved</span>
            </div>
          )}
        </div>
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
        <div className="flex items-center gap-2">
           <Zap size={14} className="text-primary" />
           <span className="text-[11px] font-bold text-slate-500">{nodes.length} Elements</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl">
          <button
            onClick={() => zoomOut()}
            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all text-slate-500 active:scale-90"
          >
            <Minus size={14} />
          </button>
          <span className="w-12 text-center text-[11px] font-black text-slate-600 dark:text-slate-400">{currentZoom}%</span>
          <button
            onClick={() => zoomIn()}
            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all text-slate-500 active:scale-90"
          >
            <Plus size={14} />
          </button>
          <div className="w-px h-3 bg-slate-300 dark:bg-slate-600 mx-1" />
          <button
            onClick={() => fitView({ duration: 800 })}
            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all text-slate-500 active:scale-90"
            title="Fit to Screen"
          >
            <Maximize size={14} />
          </button>
        </div>
        <button className="text-slate-400 hover:text-primary transition-colors">
          <HelpCircle size={18} />
        </button>
      </div>
    </div>
  );
};
