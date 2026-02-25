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
  History
} from 'lucide-react';
import { useMindMapStore } from '../store/useMindMapStore';
import { motion, AnimatePresence } from 'framer-motion';
import { fileService } from '../services/fileService';
import { cn } from '../utils/cn';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const {
    nodes,
    edges,
    title,
    setTitle,
    loadData,
    setFilePath,
    filePath,
    theme,
    setTheme
  } = useMindMapStore();

  const rootNode = nodes.find(n => n.data.isRoot);

  const handleNew = async () => {
    const data = await fileService.newFile();
    loadData(data, null);
  };

  const handleOpen = async () => {
    const result = await fileService.openFile();
    if (result) {
      loadData(result.data, result.filePath);
    }
  };

  const handleSaveAs = async () => {
    const data = {
      nodes,
      edges,
      metadata: {
        title,
        lastModified: new Date().toISOString(),
      }
    };
    const newPath = await fileService.saveAs(title, data);
    if (newPath) {
      setFilePath(newPath);
    }
  };

  const renderOutline = (parentId: string, depth = 0) => {
    return nodes
      .filter(n => n.id !== 'root')
      .map(node => (
        <div
          key={node.id}
          className="flex items-center gap-2 py-1 px-4 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-sm"
          style={{ paddingLeft: `${(depth + 1) * 12}px` }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span className="truncate">{node.data.label}</span>
        </div>
      ));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-[60] p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : -320 }}
        className="fixed top-0 left-0 h-screen w-80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800 z-50 pt-20 flex flex-col shadow-2xl"
      >
        <div className="px-6 mb-8">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-bold bg-transparent border-none outline-none w-full text-slate-800 dark:text-slate-100"
            placeholder="Untitled Mind Map"
          />
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 truncate">
            <FileText size={10} />
            {filePath || 'Local .mmap file'}
          </div>
        </div>

        <div className="px-6 mb-6 grid grid-cols-2 gap-2">
          <button
            onClick={handleNew}
            className="flex items-center justify-center gap-2 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            New
          </button>
          <button
            onClick={handleOpen}
            className="flex items-center justify-center gap-2 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Open
          </button>
          <button
            onClick={handleSaveAs}
            className="col-span-2 flex items-center justify-center gap-2 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Save As...
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Outline</span>
            <ChevronDown size={14} />
          </div>
          <div className="mb-8">
            <div className="flex items-center gap-2 py-1 px-6 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium text-sm">
              <ChevronRight size={14} />
              <span>{rootNode?.data.label}</span>
            </div>
            {renderOutline('root')}
          </div>

          <div className="px-6 mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Recent Files</span>
            <History size={14} />
          </div>
          <div className="px-6 space-y-2">
            <div className="text-sm text-slate-400 italic">No recent files</div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setTheme('light')}
              className={cn("p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800", theme === 'light' ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "text-slate-500")}
            >
              <Sun size={18} />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={cn("p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800", theme === 'dark' ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "text-slate-500")}
            >
              <Moon size={18} />
            </button>
            <button
              onClick={() => setTheme('system')}
              className={cn("p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800", theme === 'system' ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "text-slate-500")}
            >
              <Monitor size={18} />
            </button>
          </div>
          <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <Settings size={18} />
          </button>
        </div>
      </motion.div>
    </>
  );
};
