import React, { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useMindMapStore } from '@/store/useMindMapStore';
import MindMapNode from '@/components/MindMapNode';
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
    <div className="w-full h-full bg-slate-50 dark:bg-slate-900 transition-colors">
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
          style: { strokeWidth: 2, stroke: '#3b82f6', opacity: 0.6 },
          animated: true,
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={25} size={1} />
        <Controls
          showInteractive={false}
          className="bg-white/70 backdrop-blur-md border border-white/30 rounded-lg overflow-hidden !shadow-lg"
        />
        <MiniMap
          className="bg-white/70 backdrop-blur-md border border-white/30 rounded-xl overflow-hidden !shadow-2xl"
          nodeColor={(node) => {
            if (node.data.isRoot) return '#3b82f6';
            return '#94a3b8';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
};

export default MindMapCanvas;
