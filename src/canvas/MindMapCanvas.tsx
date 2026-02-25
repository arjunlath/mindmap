import React, { useMemo, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useMindMapStore } from '@/store/useMindMapStore';
import { MindMapNode } from '@/components/Node/MindMapNode';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

const nodeTypes = {
  mindmap: MindMapNode,
};

export const MindMapCanvas = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect
  } = useMindMapStore();

  useKeyboardShortcuts();

  const proOptions = { hideAttribution: true };

  return (
    <div className="w-full h-full bg-slate-50 dark:bg-slate-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        proOptions={proOptions}
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { strokeWidth: 2, stroke: '#94a3b8' },
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls showInteractive={false} className="bg-white/70 backdrop-blur-md border-white/30" />
        <MiniMap
          className="bg-white/70 backdrop-blur-md border-white/30 rounded-lg overflow-hidden"
          nodeColor={(node) => {
            if (node.data.isRoot) return '#3b82f6';
            return '#94a3b8';
          }}
        />
      </ReactFlow>
    </div>
  );
};

export default MindMapCanvas;
