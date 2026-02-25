import { MindMapData } from '../types/mindmap';

export const fileService = {
  async openFile(): Promise<{ filePath: string; data: MindMapData } | null> {
    const result = await window.electronAPI.showOpenDialog();
    if (!result) return null;
    return {
      filePath: result.filePath,
      data: result.content as MindMapData,
    };
  },

  async saveFile(filePath: string, data: MindMapData): Promise<boolean> {
    return await window.electronAPI.saveFile(filePath, data);
  },

  async saveAs(title: string, data: MindMapData): Promise<string | null> {
    const filePath = await window.electronAPI.showSaveDialog(title);
    if (!filePath) return null;
    const success = await this.saveFile(filePath, data);
    return success ? filePath : null;
  },

  async newFile(): Promise<MindMapData> {
    return {
      nodes: [
        {
          id: 'root',
          type: 'mindmap',
          data: { label: 'Central Topic', isRoot: true },
          position: { x: 0, y: 0 },
        },
      ],
      edges: [],
      metadata: {
        title: 'Untitled Mind Map',
        lastModified: new Date().toISOString(),
      },
    };
  }
};
