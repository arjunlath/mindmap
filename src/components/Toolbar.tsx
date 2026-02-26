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
  Search,
  MousePointer2
} from 'lucide-react';
import { useMindMapStore } from '@/store/useMindMapStore';
import { getLayoutedElements } from '@/utils/layout';
import { useReactFlow } from 'reactflow';
import { cn } from '@/utils/cn';

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
    setTimeout(() => fitView(), 100);
  };

  const handleExport = async () => {
    const { exportService } = await import('@/services/exportService');
    const element = document.querySelector('.react-flow__renderer') as HTMLElement;
    if (element) {
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
    const colors = ['#ffffff', '#fecaca', '#bfdbfe', '#bbf7d0', '#fef08a', '#e9d5ff'];
    const currentColor = selectedNode.style?.backgroundColor || '#ffffff';
    const nextIndex = (colors.indexOf(currentColor as string) + 1) % colors.length;
    updateNodeStyle(selectedNode.id, { backgroundColor: colors[nextIndex] });
  };

  const buttonClass = "p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 disabled:opacity-20 disabled:pointer-events-none text-slate-700 dark:text-slate-300 active:scale-95";

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-2xl rounded-2xl">
      <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-1.5">
        <button onClick={undo} className={buttonClass} title="Undo (Ctrl+Z)">
          <Undo size={20} />
        </button>
        <button onClick={redo} className={buttonClass} title="Redo (Ctrl+Shift+Z)">
          <Redo size={20} />
        </button>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-1.5">
        <button
          onClick={() => selectedNode && addNode(selectedNode.id)}
          disabled={!selectedNode}
          className={buttonClass}
          title="Add Child (Tab)"
        >
          <Plus size={20} />
        </button>
        <button
          onClick={() => selectedNode && addSibling(selectedNode.id)}
          disabled={!selectedNode || selectedNode.data.isRoot}
          className={buttonClass}
          title="Add Sibling (Enter)"
        >
          <GitBranch size={20} />
        </button>
        <button
          onClick={() => selectedNode && deleteNode(selectedNode.id)}
          disabled={!selectedNode || selectedNode.data.isRoot}
          className={cn(buttonClass, "hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20")}
          title="Delete (Del)"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-1.5">
        <button
          onClick={toggleBold}
          disabled={!selectedNode}
          className={cn(buttonClass, selectedNode?.style?.fontWeight === 'bold' && "bg-slate-100 dark:bg-slate-700 text-primary")}
          title="Bold"
        >
          <Bold size={20} />
        </button>
        <button
          onClick={toggleItalic}
          disabled={!selectedNode}
          className={cn(buttonClass, selectedNode?.style?.fontStyle === 'italic' && "bg-slate-100 dark:bg-slate-700 text-primary")}
          title="Italic"
        >
          <Italic size={20} />
        </button>
        <button
          onClick={changeColor}
          disabled={!selectedNode}
          className={buttonClass}
          title="Node Color"
        >
          <Palette size={20} />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={handleLayout} className={buttonClass} title="Auto Layout Tree">
          <Layout size={20} />
        </button>
        <button className={buttonClass} title="Search Nodes">
          <Search size={20} />
        </button>
        <button onClick={handleExport} className={cn(buttonClass, "text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20")} title="Export as PNG">
          <Download size={20} />
        </button>
      </div>
    </div>
  );
};
