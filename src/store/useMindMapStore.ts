import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { CustomNode, MindMapState, MindMapData } from '@/types/mindmap';

interface MindMapActions {
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (parentId: string, label?: string) => void;
  addSibling: (siblingId: string, label?: string) => void;
  deleteNode: (id: string) => void;
  updateNodeData: (id: string, data: any) => void;
  updateNodeStyle: (id: string, style: any) => void;
  toggleNodeCollapse: (id: string) => void;
  setElements: (nodes: CustomNode[], edges: Edge[]) => void;
  setTitle: (title: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setSelectedNode: (id: string | null) => void;
  saveSnapshot: () => void;
  undo: () => void;
  redo: () => void;
  loadData: (data: MindMapData) => void;
  resetMap: () => void;
}

const MAX_HISTORY = 50;

const initialNodes: CustomNode[] = [
  {
    id: 'root',
    type: 'mindmap',
    data: { label: 'Central Topic', isRoot: true },
    position: { x: 0, y: 0 },
  },
];

export const useMindMapStore = create<MindMapState & MindMapActions>()(
  persist(
    (set, get) => ({
      nodes: initialNodes,
      edges: [],
      title: 'Untitled Mind Map',
      isDirty: false,
      theme: 'system',
      undoStack: [],
      redoStack: [],

      onNodesChange: (changes: NodeChange[]) => {
        set((state) => ({
          nodes: applyNodeChanges(changes, state.nodes) as CustomNode[],
          isDirty: true,
        }));
      },

      onEdgesChange: (changes: EdgeChange[]) => {
        set((state) => ({
          edges: applyEdgeChanges(changes, state.edges),
          isDirty: true,
        }));
      },

      onConnect: (connection: Connection) => {
        set((state) => ({
          edges: addEdge({
            ...connection,
            type: 'smoothstep',
            animated: true,
          }, state.edges),
          isDirty: true,
        }));
      },

      addNode: (parentId: string, label = 'New Topic') => {
        get().saveSnapshot();
        const id = uuidv4();
        const parentNode = get().nodes.find((n) => n.id === parentId);

        if (!parentNode) return;

        const newNode: CustomNode = {
          id,
          type: 'mindmap',
          data: { label },
          position: {
            x: parentNode.position.x + 250,
            y: parentNode.position.y + (Math.random() - 0.5) * 150
          },
        };

        const newEdge: Edge = {
          id: `e-${parentId}-${id}`,
          source: parentId,
          target: id,
          type: 'smoothstep',
        };

        set((state) => ({
          nodes: [...state.nodes, newNode],
          edges: [...state.edges, newEdge],
          isDirty: true,
        }));
      },

      addSibling: (siblingId: string, label = 'New Topic') => {
        const edge = get().edges.find((e) => e.target === siblingId);
        if (!edge) return;

        const parentId = edge.source;
        get().addNode(parentId, label);
      },

      deleteNode: (id: string) => {
        const node = get().nodes.find(n => n.id === id);
        if (node?.data.isRoot) return;

        get().saveSnapshot();
        set((state) => ({
          nodes: state.nodes.filter((n) => n.id !== id),
          edges: state.edges.filter((e) => e.source !== id && e.target !== id),
          isDirty: true,
        }));
      },

      updateNodeData: (id: string, data: any) => {
        set((state) => ({
          nodes: state.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n)),
          isDirty: true,
        }));
      },

      updateNodeStyle: (id: string, style: any) => {
        get().saveSnapshot();
        set((state) => ({
          nodes: state.nodes.map((n) => (n.id === id ? { ...n, style: { ...n.style, ...style } } : n)),
          isDirty: true,
        }));
      },

      toggleNodeCollapse: (id: string) => {
        const { nodes, edges } = get();
        const node = nodes.find(n => n.id === id);
        if (!node) return;

        const isCollapsed = !node.data.collapsed;

        const getDescendants = (nodeId: string): string[] => {
          const children = edges.filter(e => e.source === nodeId).map(e => e.target);
          return [...children, ...children.flatMap(childId => getDescendants(childId))];
        };

        const descendants = getDescendants(id);

        set((state) => ({
          nodes: state.nodes.map((n) => {
            if (n.id === id) {
              return { ...n, data: { ...n.data, collapsed: isCollapsed } };
            }
            if (descendants.includes(n.id)) {
              return { ...n, hidden: isCollapsed };
            }
            return n;
          }),
          edges: state.edges.map((e) => {
            if (descendants.includes(e.target) || descendants.includes(e.source)) {
               // If target is a descendant, it should be hidden.
               // Actually if either source or target is hidden, the edge should be hidden.
               // But usually we hide if target is descendant.
               return { ...e, hidden: isCollapsed };
            }
            return e;
          }),
          isDirty: true,
        }));
      },

      setElements: (nodes: CustomNode[], edges: Edge[]) => {
        set({ nodes, edges, isDirty: true });
      },

      setTitle: (title: string) => set({ title, isDirty: true }),
      setTheme: (theme: 'light' | 'dark' | 'system') => set({ theme }),

      setSelectedNode: (id: string | null) => {
        set((state) => ({
          nodes: state.nodes.map((n) => ({ ...n, selected: n.id === id })),
        }));
      },

      saveSnapshot: () => {
        const { nodes, edges, title, theme } = get();
        const snapshot: MindMapData = {
          nodes: JSON.parse(JSON.stringify(nodes)),
          edges: JSON.parse(JSON.stringify(edges)),
          metadata: {
            title,
            lastModified: new Date().toISOString(),
            theme
          }
        };

        set((state) => ({
          undoStack: [...state.undoStack.slice(-MAX_HISTORY + 1), snapshot],
          redoStack: [],
        }));
      },

      undo: () => {
        const { undoStack, nodes, edges, title, theme } = get();
        if (undoStack.length === 0) return;

        const previous = undoStack[undoStack.length - 1];
        const currentSnapshot: MindMapData = {
          nodes: JSON.parse(JSON.stringify(nodes)),
          edges: JSON.parse(JSON.stringify(edges)),
          metadata: { title, theme, lastModified: new Date().toISOString() }
        };

        set((state) => ({
          nodes: previous.nodes,
          edges: previous.edges,
          title: previous.metadata.title,
          theme: previous.metadata.theme || state.theme,
          undoStack: state.undoStack.slice(0, -1),
          redoStack: [currentSnapshot, ...state.redoStack.slice(0, MAX_HISTORY - 1)],
          isDirty: true,
        }));
      },

      redo: () => {
        const { redoStack, nodes, edges, title, theme } = get();
        if (redoStack.length === 0) return;

        const next = redoStack[0];
        const currentSnapshot: MindMapData = {
          nodes: JSON.parse(JSON.stringify(nodes)),
          edges: JSON.parse(JSON.stringify(edges)),
          metadata: { title, theme, lastModified: new Date().toISOString() }
        };

        set((state) => ({
          nodes: next.nodes,
          edges: next.edges,
          title: next.metadata.title,
          theme: next.metadata.theme || state.theme,
          undoStack: [...state.undoStack.slice(-MAX_HISTORY + 1), currentSnapshot],
          redoStack: state.redoStack.slice(1),
          isDirty: true,
        }));
      },

      loadData: (data: MindMapData) => {
        set({
          nodes: data.nodes,
          edges: data.edges,
          title: data.metadata.title,
          theme: data.metadata.theme || 'system',
          isDirty: false,
          undoStack: [],
          redoStack: [],
        });
      },

      resetMap: () => {
        set({
          nodes: initialNodes,
          edges: [],
          title: 'Untitled Mind Map',
          isDirty: false,
          undoStack: [],
          redoStack: [],
        });
      },
    }),
    {
      name: 'mindmap-storage',
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        title: state.title,
        theme: state.theme
      }),
    }
  )
);
