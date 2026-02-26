import { Node, Edge } from 'reactflow';

export interface MindMapNodeData {
  label: string;
  isRoot?: boolean;
  collapsed?: boolean;
  emoji?: string;
}

export interface MindMapNodeStyle {
  backgroundColor?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontStyle?: string;
}

export type CustomNode = Node<MindMapNodeData>;

export interface MindMapData {
  nodes: CustomNode[];
  edges: Edge[];
  metadata: {
    title: string;
    lastModified: string;
    theme?: 'light' | 'dark' | 'system';
  };
}

export interface MindMapState {
  nodes: CustomNode[];
  edges: Edge[];
  title: string;
  isDirty: boolean;
  theme: 'light' | 'dark' | 'system';
  undoStack: MindMapData[];
  redoStack: MindMapData[];
}
