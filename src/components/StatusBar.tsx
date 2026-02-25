import React from 'react';
import {
  CloudCheck,
  CloudUpload,
  Minus,
  Plus,
  Maximize,
  HelpCircle
} from 'lucide-react';
import { useMindMapStore } from '../store/useMindMapStore';
import { useReactFlow } from 'reactflow';

export const StatusBar = () => {
  const { nodes, isDirty, lastSaved } = useMindMapStore();
  const { zoomIn, zoomOut, fitView, getZoom } = useReactFlow();

  const [currentZoom, setCurrentZoom] = React.useState(100);

  // Update zoom percentage display
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentZoom(Math.round(getZoom() * 100));
    }, 200);
    return () => clearInterval(interval);
  }, [getZoom]);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-[60] px-4 flex items-center justify-between text-xs text-slate-500 font-medium">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          {isDirty ? (
            <>
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-600 dark:text-amber-400">Saving...</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400">All changes saved</span>
            </>
          )}
        </div>
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
        <div>{nodes.length} Nodes</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button onClick={() => zoomOut()} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
            <Minus size={14} />
          </button>
          <span className="w-10 text-center">{currentZoom}%</span>
          <button onClick={() => zoomIn()} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
            <Plus size={14} />
          </button>
          <button onClick={() => fitView()} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded" title="Fit to Screen">
            <Maximize size={14} />
          </button>
        </div>
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
          <HelpCircle size={14} />
        </button>
      </div>
    </div>
  );
};
