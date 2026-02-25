import React from 'react';
import {
  Plus,
  GitBranch,
  Trash2,
  Bold,
  Italic,
  Palette,
  Undo,
  Redo,
  Layout,
  Download,
  Search
} from 'lucide-react';
import { useMindMapStore } from '../store/useMindMapStore';
import { getLayoutedElements } from '../layout/engine';
import { useReactFlow } from 'reactflow';

export const Toolbar = () => {
  const {
    nodes,
    edges,
    addNode,
    addSibling,
    deleteNode,
    updateNodeStyle,
    setElements,
    undo,
    redo,
    title
  } = useMindMapStore();

  const { fitView } = useReactFlow();

  const selectedNodes = nodes.filter(n => n.selected);
  const selectedNode = selectedNodes[0];

  const handleLayout = () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
    setElements(layoutedNodes, layoutedEdges);
    setTimeout(() => fitView(), 50);
  };

  const handleExport = async () => {
    const element = document.querySelector('.react-flow__renderer') as HTMLElement;
    if (element) {
      const { exportService } = await import('../services/exportService');
      await exportService.exportToPng(element, title);
    }
  };

  const toggleBold = () => {
    if (!selectedNode) return;
    const currentWeight = selectedNode.style?.fontWeight || 'normal';
    updateNodeStyle(selectedNode.id, {
      fontWeight: currentWeight === 'bold' ? 'normal' : 'bold'
    });
  };

  const toggleItalic = () => {
    if (!selectedNode) return;
    const currentStyle = selectedNode.style?.fontStyle || 'normal';
    updateNodeStyle(selectedNode.id, {
      fontStyle: currentStyle === 'italic' ? 'normal' : 'italic'
    });
  };

  const changeColor = () => {
    if (!selectedNode) return;
    const colors = ['#ffffff', '#fecaca', '#bfdbfe', '#bbf7d0', '#fef08a'];
    const currentColor = selectedNode.style?.backgroundColor || '#ffffff';
    const nextIndex = (colors.indexOf(currentColor as string) + 1) % colors.length;
    updateNodeStyle(selectedNode.id, { backgroundColor: colors[nextIndex] });
  };

  const buttonClass = "p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:pointer-events-none text-slate-700 dark:text-slate-300";

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/30 dark:border-slate-700/30 shadow-2xl rounded-2xl flex items-center gap-2">
      <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-2">
        <button onClick={undo} className={buttonClass} title="Undo">
          <Undo size={18} />
        </button>
        <button onClick={redo} className={buttonClass} title="Redo">
          <Redo size={18} />
        </button>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-2">
        <button
          onClick={() => selectedNode && addNode(selectedNode.id)}
          disabled={!selectedNode}
          className={buttonClass}
          title="Add Child (Tab)"
        >
          <Plus size={18} />
        </button>
        <button
          onClick={() => selectedNode && addSibling(selectedNode.id)}
          disabled={!selectedNode || selectedNode.data.isRoot}
          className={buttonClass}
          title="Add Sibling (Enter)"
        >
          <GitBranch size={18} />
        </button>
        <button
          onClick={() => selectedNode && deleteNode(selectedNode.id)}
          disabled={!selectedNode || selectedNode.data.isRoot}
          className={cn(buttonClass, "hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20")}
          title="Delete (Del)"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-2">
        <button
          onClick={toggleBold}
          disabled={!selectedNode}
          className={cn(buttonClass, selectedNode?.style?.fontWeight === 'bold' && "bg-slate-100 dark:bg-slate-700")}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={toggleItalic}
          disabled={!selectedNode}
          className={cn(buttonClass, selectedNode?.style?.fontStyle === 'italic' && "bg-slate-100 dark:bg-slate-700")}
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={changeColor}
          disabled={!selectedNode}
          className={buttonClass}
          title="Color"
        >
          <Palette size={18} />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={handleLayout} className={buttonClass} title="Auto Layout">
          <Layout size={18} />
        </button>
        <button className={buttonClass} title="Search">
          <Search size={18} />
        </button>
        <button onClick={handleExport} className={buttonClass} title="Export PNG">
          <Download size={18} />
        </button>
      </div>
    </div>
  );
};

import { cn } from '../utils/cn';
