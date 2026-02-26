import { Edge } from 'reactflow';
import { CustomNode } from '@/types/mindmap';

export const getLayoutedElements = (nodes: CustomNode[], edges: Edge[], direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  const nodeWidth = 200;
  const nodeHeight = 60;
  const rankGap = 250;
  const nodeGap = 40;

  const layoutedNodes = [...nodes];

  // Identify root
  const root = layoutedNodes.find(n => n.data.isRoot);
  if (!root) return { nodes, edges };

  // Build tree structure
  const adj: Record<string, string[]> = {};
  edges.forEach(edge => {
    if (!edge.hidden) {
      if (!adj[edge.source]) adj[edge.source] = [];
      adj[edge.source].push(edge.target);
    }
  });

  // Map to store subtree heights
  const subtreeHeights: Record<string, number> = {};

  // First pass: Calculate subtree heights
  const calculateHeight = (id: string): number => {
    const node = layoutedNodes.find(n => n.id === id);
    if (!node || node.hidden) return 0;

    const children = adj[id] || [];
    if (children.length === 0 || node.data.collapsed) {
      subtreeHeights[id] = nodeHeight + nodeGap;
      return subtreeHeights[id];
    }

    const height = children.reduce((acc, childId) => acc + calculateHeight(childId), 0);
    subtreeHeights[id] = Math.max(height, nodeHeight + nodeGap);
    return subtreeHeights[id];
  };

  calculateHeight(root.id);

  // Second pass: Position nodes
  const positionedIds = new Set<string>();

  const positionNode = (id: string, x: number, y: number) => {
    const node = layoutedNodes.find(n => n.id === id);
    if (!node || positionedIds.has(id)) return;

    positionedIds.add(id);
    node.position = { x, y };

    const children = adj[id] || [];
    if (children.length === 0 || node.data.collapsed) return;

    let currentY = y - (subtreeHeights[id] / 2) + (nodeHeight + nodeGap) / 2;

    children.forEach(childId => {
      const childHeight = subtreeHeights[childId];
      const nextY = currentY + (childHeight / 2) - (nodeHeight + nodeGap) / 2;

      positionNode(
        childId,
        isHorizontal ? x + rankGap : x,
        isHorizontal ? nextY : y + rankGap
      );
      currentY += childHeight;
    });
  };

  positionNode(root.id, 0, 0);

  return { nodes: layoutedNodes, edges };
};
