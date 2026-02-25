import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useMindMapStore } from '../../store/useMindMapStore';
import { MindMapNodeData } from '../../types/mindmap';
import { cn } from '../../utils/cn';
import { ChevronRight, ChevronDown } from 'lucide-react';

export const MindMapNode = ({ id, data, selected }: NodeProps<MindMapNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const updateNodeData = useMindMapStore((state) => state.updateNodeData);
  const toggleNodeCollapse = useMindMapStore((state) => state.toggleNodeCollapse);
  const edges = useMindMapStore((state) => state.edges);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLabel(data.label);
  }, [data.label]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const onBlur = useCallback(() => {
    setIsEditing(false);
    updateNodeData(id, { label });
  }, [id, label, updateNodeData]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onBlur();
    }
  }, [onBlur]);

  const isRoot = data.isRoot;

  return (
    <div
      className={cn(
        'px-4 py-2 rounded-xl shadow-lg transition-all duration-200 min-w-[120px] text-center',
        'backdrop-blur-md bg-white/70 border border-white/30 dark:bg-slate-800/70 dark:border-slate-700/30',
        selected && 'ring-2 ring-blue-500 ring-offset-2',
        isRoot ? 'text-lg font-bold bg-blue-500/10 border-blue-500/30' : 'text-sm font-medium'
      )}
      onDoubleClick={() => setIsEditing(true)}
    >
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-blue-400" />

      <div className="flex flex-col items-center justify-center">
        {isEditing ? (
          <input
            ref={inputRef}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            className="bg-transparent border-none outline-none text-center w-full"
          />
        ) : (
          <div className="break-words max-w-[200px]">
            {data.emoji && <span className="mr-2">{data.emoji}</span>}
            {label}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-blue-400" />

      {edges.some(e => e.source === id) && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleNodeCollapse(id);
          }}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors z-10"
        >
          {data.collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
        </button>
      )}
    </div>
  );
};

export default React.memo(MindMapNode);
