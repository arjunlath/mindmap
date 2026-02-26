import { describe, it, expect } from 'vitest';
import { getLayoutedElements } from '../utils/layout';
import { CustomNode } from '../types/mindmap';
import { Edge } from 'reactflow';

describe('Layout Engine', () => {
  it('should position nodes correctly', () => {
    const nodes: CustomNode[] = [
      { id: 'root', data: { label: 'Root', isRoot: true }, position: { x: 0, y: 0 }, type: 'mindmap' },
      { id: 'child1', data: { label: 'Child 1' }, position: { x: 0, y: 0 }, type: 'mindmap' },
    ];
    const edges: Edge[] = [
      { id: 'e1', source: 'root', target: 'child1' }
    ];

    const { nodes: layoutedNodes } = getLayoutedElements(nodes, edges);

    const root = layoutedNodes.find(n => n.id === 'root');
    const child = layoutedNodes.find(n => n.id === 'child1');

    expect(root?.position).toEqual({ x: 0, y: 0 });
    expect(child?.position.x).toBeGreaterThan(0);
  });
});
