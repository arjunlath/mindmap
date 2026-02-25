import { Node, Edge } from 'reactflow';

export interface MindMapNodeData {
  label: string;
  isRoot?: boolean;
  collapsed?: boolean;
  icon?: string;
  emoji?: string;
  tags?: string[];
  description?: string;
}

export interface MindMapNodeStyle {
  backgroundColor?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: string | number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
}

export type CustomNode = Node<MindMapNodeData>;

export interface MindMapData {
  nodes: CustomNode[];
  edges: Edge[];
  metadata: {
    title: string;
    description?: string;
    author?: string;
    lastModified: string;
    theme?: string;
  };
}

export interface MindMapState {
  nodes: CustomNode[];
  edges: Edge[];
  title: string;
  filePath: string | null;
  isDirty: boolean;
  lastSaved: string | null;
  selectedNodeId: string | null;
  theme: 'light' | 'dark' | 'system';
  undoStack: MindMapData[];
  redoStack: MindMapData[];
}
