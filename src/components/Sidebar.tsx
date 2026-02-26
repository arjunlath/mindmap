import React, { useState } from 'react';
import {
  FileText,
  Settings,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Monitor,
  Moon,
  Sun,
  History,
  FilePlus,
  FolderOpen,
  Save,
  Share2
} from 'lucide-react';
import { useMindMapStore } from '@/store/useMindMapStore';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    nodes,
    title,
    setTitle,
    loadData,
    resetMap,
    theme,
    setTheme
  } = useMindMapStore();

  const rootNode = nodes.find(n => n.data.isRoot);

  const handleNew = () => {
    if (confirm('Are you sure? Unsaved changes will be lost.')) {
      resetMap();
    }
  };

  const handleDownload = async () => {
    const { fileService } = await import('@/services/fileService');
    const { edges, title: currentTitle } = useMindMapStore.getState();
    const data = {
      nodes,
      edges,
      metadata: {
        title: currentTitle,
        lastModified: new Date().toISOString(),
        theme
      }
    };
    fileService.downloadFile(data, `${currentTitle}.mmap`);
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.mmap,application/json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const { fileService } = await import('@/services/fileService');
      const data = await fileService.readFile(file);
      loadData(data);
    };
    input.click();
  };

  const renderOutline = (depth = 0) => {
    return nodes
      .filter(n => !n.data.isRoot && !n.hidden)
      .map(node => (
        <div
          key={node.id}
          className="flex items-center gap-3 py-2 px-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
          <span className="truncate text-sm text-slate-600 dark:text-slate-400 font-medium">
            {node.data.label}
          </span>
        </div>
      ));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed top-8 left-8 z-[60] p-3 rounded-2xl shadow-xl transition-all duration-300",
          "bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40",
          "hover:scale-105 active:scale-95 text-slate-700 dark:text-slate-300"
        )}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-screen w-[320px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl border-r border-slate-200/50 dark:border-slate-800/50 z-50 flex flex-col shadow-[20px_0_60px_-15px_rgba(0,0,0,0.1)]"
          >
            <div className="pt-24 px-8 mb-10">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-black bg-transparent border-none outline-none w-full text-slate-800 dark:text-slate-100 placeholder:text-slate-300"
                placeholder="Map Title..."
              />
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary mt-2 flex items-center gap-2">
                <Share2 size={12} />
                SaaS Browser Mode
              </div>
            </div>

            <div className="px-6 mb-8 grid grid-cols-2 gap-3">
              <button
                onClick={handleNew}
                className="flex flex-col items-center justify-center gap-2 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <FilePlus size={18} className="text-blue-500" />
                New
              </button>
              <button
                onClick={handleUpload}
                className="flex flex-col items-center justify-center gap-2 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <FolderOpen size={18} className="text-amber-500" />
                Open
              </button>
              <button
                onClick={handleDownload}
                className="col-span-2 flex items-center justify-center gap-3 py-3.5 bg-primary text-primary-foreground rounded-2xl text-sm font-black shadow-lg shadow-primary/25 hover:opacity-90 transition-all active:scale-[0.98]"
              >
                <Save size={18} />
                Download .mmap
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="px-8 mb-4 flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Outline</span>
                <ChevronDown size={14} className="text-slate-300" />
              </div>
              <div className="mb-8">
                <div className="flex items-center gap-3 py-2.5 px-8 bg-primary/5 text-primary font-bold text-sm">
                  <ChevronRight size={16} />
                  <span>{rootNode?.data.label}</span>
                </div>
                {renderOutline()}
              </div>

              <div className="px-8 mb-4 flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Appearance</span>
              </div>
              <div className="px-8 flex gap-2 mb-10">
                <button
                  onClick={() => setTheme('light')}
                  className={cn("p-2.5 rounded-xl border transition-all", theme === 'light' ? "bg-white border-slate-200 shadow-sm text-primary" : "border-transparent text-slate-400 hover:bg-slate-50")}
                >
                  <Sun size={18} />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={cn("p-2.5 rounded-xl border transition-all", theme === 'dark' ? "bg-slate-800 border-slate-700 shadow-sm text-primary" : "border-transparent text-slate-400 hover:bg-slate-800")}
                >
                  <Moon size={18} />
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={cn("p-2.5 rounded-xl border transition-all", theme === 'system' ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm text-primary" : "border-transparent text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800")}
                >
                  <Monitor size={18} />
                </button>
              </div>
            </div>

            <div className="p-8 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-primary/20">
                    M
                 </div>
                 <div className="flex flex-col">
                    <span className="text-xs font-bold dark:text-white">MindMap SaaS</span>
                    <span className="text-[10px] text-slate-400 font-medium">Free Tier</span>
                 </div>
              </div>
              <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400">
                <Settings size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
