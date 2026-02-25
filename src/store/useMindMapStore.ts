import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { CustomNode, MindMapState, MindMapData } from '../types/mindmap';

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
  setFilePath: (path: string | null) => void;
  setDirty: (isDirty: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setSelectedNode: (id: string | null) => void;
  saveSnapshot: () => void;
  undo: () => void;
  redo: () => void;
  loadData: (data: MindMapData, filePath: string | null) => void;
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

export const useMindMapStore = create<MindMapState & MindMapActions>((set, get) => ({
  nodes: initialNodes,
  edges: [],
  title: 'Untitled Mind Map',
  filePath: null,
  isDirty: false,
  lastSaved: null,
  selectedNodeId: null,
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
        markerEnd: { type: MarkerType.ArrowClosed }
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
        x: parentNode.position.x + 200,
        y: parentNode.position.y + (Math.random() - 0.5) * 100
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
    if (!edge) return; // Root has no sibling in this logic, or we handle it differently

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

    // Recursive helper to find all descendants
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
        if (descendants.includes(e.target)) {
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
  setFilePath: (filePath: string | null) => set({ filePath }),
  setDirty: (isDirty: boolean) => set({ isDirty }),
  setTheme: (theme: 'light' | 'dark' | 'system') => set({ theme }),
  setSelectedNode: (id: string | null) => {
    set((state) => ({
      nodes: state.nodes.map((n) => ({ ...n, selected: n.id === id })),
      selectedNodeId: id,
    }));
  },

  saveSnapshot: () => {
    const { nodes, edges, title } = get();
    const snapshot: MindMapData = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      metadata: {
        title,
        lastModified: new Date().toISOString(),
      }
    };

    set((state) => ({
      undoStack: [...state.undoStack.slice(-MAX_HISTORY + 1), snapshot],
      redoStack: [],
    }));
  },

  undo: () => {
    const { undoStack, nodes, edges, title } = get();
    if (undoStack.length === 0) return;

    const previous = undoStack[undoStack.length - 1];
    const currentSnapshot: MindMapData = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      metadata: { title, lastModified: new Date().toISOString() }
    };

    set((state) => ({
      nodes: previous.nodes,
      edges: previous.edges,
      title: previous.metadata.title,
      undoStack: state.undoStack.slice(0, -1),
      redoStack: [currentSnapshot, ...state.redoStack.slice(0, MAX_HISTORY - 1)],
      isDirty: true,
    }));
  },

  redo: () => {
    const { redoStack, nodes, edges, title } = get();
    if (redoStack.length === 0) return;

    const next = redoStack[0];
    const currentSnapshot: MindMapData = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      metadata: { title, lastModified: new Date().toISOString() }
    };

    set((state) => ({
      nodes: next.nodes,
      edges: next.edges,
      title: next.metadata.title,
      undoStack: [...state.undoStack.slice(-MAX_HISTORY + 1), currentSnapshot],
      redoStack: state.redoStack.slice(1),
      isDirty: true,
    }));
  },

  loadData: (data: MindMapData, filePath: string | null) => {
    set({
      nodes: data.nodes,
      edges: data.edges,
      title: data.metadata.title,
      filePath,
      isDirty: false,
      undoStack: [],
      redoStack: [],
    });
  },
}));
