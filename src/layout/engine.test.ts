import { describe, it, expect } from 'vitest';
import { getLayoutedElements } from '../layout/engine';
import { CustomNode } from '../types/mindmap';
import { Edge } from 'reactflow';

describe('Layout Engine', () => {
  it('should position nodes in a tree structure', () => {
    const nodes: CustomNode[] = [
      { id: 'root', data: { label: 'Root', isRoot: true }, position: { x: 0, y: 0 }, type: 'mindmap' },
      { id: 'child1', data: { label: 'Child 1' }, position: { x: 0, y: 0 }, type: 'mindmap' },
      { id: 'child2', data: { label: 'Child 2' }, position: { x: 0, y: 0 }, type: 'mindmap' },
    ];

    const edges: Edge[] = [
      { id: 'e1', source: 'root', target: 'child1' },
      { id: 'e2', source: 'root', target: 'child2' },
    ];

    const { nodes: layoutedNodes } = getLayoutedElements(nodes, edges);

    const root = layoutedNodes.find(n => n.id === 'root');
    const c1 = layoutedNodes.find(n => n.id === 'child1');
    const c2 = layoutedNodes.find(n => n.id === 'child2');

    expect(root?.position).toEqual({ x: 0, y: 0 });
    expect(c1?.position.x).toBeGreaterThan(0);
    expect(c2?.position.x).toBeGreaterThan(0);
    expect(c1?.position.y).not.toEqual(c2?.position.y);
  });
});
