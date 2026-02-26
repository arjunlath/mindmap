import { useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import { useMindMapStore } from '@/store/useMindMapStore';

export const useKeyboardShortcuts = () => {
  const { getNodes } = useReactFlow();
  const addNode = useMindMapStore((state) => state.addNode);
  const addSibling = useMindMapStore((state) => state.addSibling);
  const deleteNode = useMindMapStore((state) => state.deleteNode);
  const undo = useMindMapStore((state) => state.undo);
  const redo = useMindMapStore((state) => state.redo);
  const setSelectedNode = useMindMapStore((state) => state.setSelectedNode);
  const edges = useMindMapStore((state) => state.edges);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const allNodes = getNodes();
      const selectedNodes = allNodes.filter((node) => node.selected);
      const selectedNode = selectedNodes[0];

      // Avoid triggering shortcuts when typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (!selectedNode) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
          if (event.shiftKey) redo();
          else undo();
        }
        return;
      }

      switch (event.key) {
        case 'Tab':
          event.preventDefault();
          addNode(selectedNode.id);
          break;
        case 'Enter':
          event.preventDefault();
          addSibling(selectedNode.id);
          break;
        case 'Delete':
        case 'Backspace':
          event.preventDefault();
          deleteNode(selectedNode.id);
          break;
        case 'z':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            if (event.shiftKey) redo();
            else undo();
          }
          break;
        case 'ArrowRight': {
          event.preventDefault();
          const edge = edges.find(e => e.source === selectedNode.id && !e.hidden);
          if (edge) {
            setSelectedNode(edge.target);
          }
          break;
        }
        case 'ArrowLeft': {
          event.preventDefault();
          const edge = edges.find(e => e.target === selectedNode.id && !e.hidden);
          if (edge) {
            setSelectedNode(edge.source);
          }
          break;
        }
        case 'ArrowDown': {
          event.preventDefault();
          const parentEdge = edges.find(e => e.target === selectedNode.id);
          if (parentEdge) {
            const siblings = edges
              .filter(e => e.source === parentEdge.source && !e.hidden)
              .map(e => e.target);
            const index = siblings.indexOf(selectedNode.id);
            if (index < siblings.length - 1) {
              setSelectedNode(siblings[index + 1]);
            }
          }
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          const parentEdge = edges.find(e => e.target === selectedNode.id);
          if (parentEdge) {
            const siblings = edges
              .filter(e => e.source === parentEdge.source && !e.hidden)
              .map(e => e.target);
            const index = siblings.indexOf(selectedNode.id);
            if (index > 0) {
              setSelectedNode(siblings[index - 1]);
            }
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [getNodes, addNode, addSibling, deleteNode, undo, redo, edges, setSelectedNode]);
};
