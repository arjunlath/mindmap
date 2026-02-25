import { Edge } from 'reactflow';
import { CustomNode } from '../types/mindmap';

export const getLayoutedElements = (nodes: CustomNode[], edges: Edge[], direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  const nodeWidth = 200;
  const nodeHeight = 60;
  const rankGap = 200;
  const nodeGap = 50;

  const layoutedNodes = [...nodes];

  // Simple hierarchical layout logic
  // 1. Identify root
  const root = layoutedNodes.find(n => n.data.isRoot);
  if (!root) return { nodes, edges };

  // 2. Build tree structure
  const adj: Record<string, string[]> = {};
  edges.forEach(edge => {
    if (!adj[edge.source]) adj[edge.source] = [];
    adj[edge.source].push(edge.target);
  });

  // 3. Recursive positioning
  const positionedIds = new Set<string>();

  const positionNode = (id: string, x: number, y: number): number => {
    const node = layoutedNodes.find(n => n.id === id);
    if (!node || positionedIds.has(id)) return 0;

    positionedIds.add(id);
    node.position = { x, y };

    const children = adj[id] || [];
    if (children.length === 0) return nodeHeight + nodeGap;

    let totalHeight = 0;
    let currentY = y - ((children.length - 1) * (nodeHeight + nodeGap)) / 2;

    children.forEach(childId => {
      const childHeight = positionNode(
        childId,
        isHorizontal ? x + rankGap : x,
        isHorizontal ? currentY : y + rankGap
      );
      totalHeight += childHeight;
      currentY += childHeight;
    });

    return totalHeight;
  };

  positionNode(root.id, 0, 0);

  return { nodes: layoutedNodes, edges };
};
